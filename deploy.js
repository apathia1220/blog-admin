const childProcess = require('child_process')
const path = require('path')
const uploadClient = require('node-scp').Client
const sshClient = require('ssh2').Client
const ora = require('ora')
const dotenv = require('dotenv')

dotenv.config()

// SSH连接配置
const sshConfig = {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.SSHPORT || 22,
    username: process.env.USERNAME || 'root',
    password: process.env.PASSWD || '123456'
};

const localPath = __dirname
const remotePath = '/usr/local/vue'

const spinner = ora('正在部署项目到服务器...');

// 打包项目
const build = () => { 
    return new Promise((resolve, reject) => {
        const buildPrcoess = childProcess.exec(`pnpm build`, (err, stdout, stderr) => {
            if (err) {
                console.error(stdout)
                reject(err)
                spinner.fail(`打包失败`)
            }
        })
        buildPrcoess.on('exit', () => {
            resolve()
            spinner.succeed(`项目打包成功`)
        })
    })
}

const upload2Remote = async () => {
    try {
        const client = await uploadClient(sshConfig)
        const uploadSpinner = ora('正在上传文件到服务器......')
        uploadSpinner.start()
        spinner.info('项目文件开始上传')
        const localDir = path.join(localPath, '/dist')
        const remoteDir = path.join(remotePath, '/admin')
        await client.uploadDir(localDir, remoteDir)
        uploadSpinner.succeed('文件上传成功')
        uploadSpinner.stop()
        client.close()
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}

const conn = new sshClient()

const remoteRunCmd = async(cmd) => {
  cmd = `${cmd}\nexit\n`
  return new Promise((resolve, reject) => {
    let outData = ``
    conn.on(`ready`, () => {
      conn.shell((err, stream) => {
        if (err) {
          return reject(err)
        }
        stream.on(`close`, () => {
            conn.end()
            resolve(outData)
        }).on(`data`, (data) => {
            outData = outData + data
            // process.stdout.write(data)
        })
        stream.end(cmd)
      })
    }).connect(sshConfig)
  })
}

const ssh2Cmd = async () => {
    let cmdStr = `sh /usr/local/mihoyo/docker/restart-nginx.sh`
    const dockerSpinner = ora('正在重新更新资源并重启服务......')
    dockerSpinner.start()
    await remoteRunCmd(cmdStr)
    spinner.succeed('服务重启成功')
    dockerSpinner.stop()
}

(async () => {
    spinner.start()
    // 打包文件
    await build()
    // 上传文件
    await upload2Remote()
    // 重启docker
    await ssh2Cmd()
    spinner.succeed('项目部署完成')
    spinner.stop()
})()