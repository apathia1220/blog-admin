import ky from 'ky'
import type { Options } from 'ky'

export type Input = Request | string | URL

export interface HttpOptions extends Options {
  skipResponseCheck?: boolean
}

export interface IGetOptions extends HttpOptions {
  query?: Record<string, any>
}

export interface IPostOptions extends HttpOptions {
  form?: URLSearchParams | Record<string, any>
  file?: FormData
}

export interface IPutOptions extends HttpOptions {
  form?: URLSearchParams | Record<string, any>
}

export interface IResponse<Data> {
  code: number
  msg?: string
  message?: string
  data: Data
}

export interface MngHttp {
  get: <T>(url: Input, options?: IGetOptions) => Promise<IResponse<T>>
  post: <T>(url: Input, options?: IPostOptions) => Promise<IResponse<T>>
  put: <T>(url: Input, options?: IPutOptions) => Promise<IResponse<T>>
  delete: <T>(url: Input, options?: HttpOptions) => Promise<IResponse<T>>
  patch: <T>(url: Input, options?: HttpOptions) => Promise<IResponse<T>>
}

type RequestOptions<K extends keyof MngHttp> = Exclude<Parameters<MngHttp[K]>[1], undefined>

const http = {} as MngHttp
const LEGACY_URL_REGEXP = /^\/api\//

function resolveUrl(input: Input) {
  if (typeof input === 'string') {
    return input
  }
  if (input instanceof URL) {
    return input.toString()
  }
  return input.url
}

function createRequest<M extends keyof MngHttp>(method: M) {
  return async (url: Input, options?: RequestOptions<M>) => {
    const targetUrl = resolveUrl(url)

    if (!targetUrl || !/^\//.test(targetUrl)) {
      console.warn('地址要以/开头')
      throw new Error('地址要以/开头')
    }

    let SUCCESS_CODE = 0
    if (LEGACY_URL_REGEXP.test(targetUrl)) {
      SUCCESS_CODE = 20000
    }
    try {
      const resp = (await ky[method](url, options as HttpOptions).json()) as IResponse<any>
      if (resp && resp.code !== SUCCESS_CODE) {
        if (options?.skipResponseCheck) {
          return Promise.reject(resp)
        }
        return Promise.reject(resp)
      }
      return resp
    } catch (error: any) {
      //   const url = error?.response?.url || ''
      throw error
    }
  }
}

function wrapper<F extends (...args: any) => any>(fn: F, enhance: (fn: F) => F) {
  return enhance(fn)
}
/**
 * # get 请求, 以下三种写法等价。强烈建议使用第一种
 * http.get(url, { query: { a: 1, b: 2 } }) ⭐️ 推荐
 * http.get(url, { searchParams: { a: 1, b: 2 } })
 * http.get(url, { searchParams: new URLSearchParams({ a: 1, b: 2 }) })
 */

/**
 * 发送get请求
 * @param {Input} url 地址
 * @param {HttpOptions} options. { query: object }
 * @returns {Promise}
 */
http.get = wrapper(createRequest('get'), (fn) => (url, options) => {
  const { query, searchParams, ...others } = options || {}
  return fn(url, {
    ...others,
    // 对象或者URLSearchParams都会自动转化为 URLSearchParams对象
    searchParams: searchParams || query
  })
})

/**
 * # post请求，根据不同编码写法不一样。这里对常用的 www-form-urlencoded编码进行了一次封装
 * application/www-form-urlencoded
 * 1. http.post(url, { body: new URLSearchParams({ a: 1, b: 2 }) })
 * 2. http.post(url, { form: { a: 1, b: 2 } }) ⭐️ 推荐
 *
 * application/json
 * http.post(url, { json: { a: 1, b: 2 } }) ⭐️ 推荐
 *
 * multipart/form-data
 * http.post(url, { body: new FormData() }) ⭐️ 推荐
 */

/**
 * 发送post请求
 * @param {Input} url 地址
 * @param {HttpOptions} options json: { json: object }, form-data: { body: new FormData() }, www-form-urlencoded: { form: object }
 * @returns {Promise}
 */
http.post = wrapper(createRequest('post'), (fn) => async (url, options) => {
  const { form, json, file, body, ...others } = options || {}
  const formBody = {} as IPostOptions
  if (body) {
    formBody.body = body
  } else if (json) {
    formBody.json = json
  } else if (form) {
    formBody.body = form instanceof URLSearchParams ? form : new URLSearchParams(form)
  } else if (file) {
    formBody.body = file
  }
  return fn(url, {
    ...others,
    ...formBody
  })
})

/**
 * 发送put请求
 * @param {Input} url 地址
 * @param {IPutOption} options
 * @returns {Promise}
 */
http.put = wrapper(createRequest('put'), (fn) => async (url, options) => {
  const { form, json, body, ...others } = (options as IPutOptions) || {}
  const formBody = {} as IPutOptions
  if (body) {
    formBody.body = body
  } else if (json) {
    formBody.json = json
  } else if (form) {
    formBody.body = form instanceof URLSearchParams ? form : new URLSearchParams(form)
  }
  return fn(url, {
    ...others,
    ...formBody
  })
})
// http.put = createRequest('put')

/**
 * 发送patch请求
 * @param {Input} url 地址
 * @param {HttpOptions} options
 * @returns {Promise}
 */
http.patch = createRequest('patch')

/**
 * 发送delete请求
 * @param {Input} url 地址
 * @param {HttpOptions} options
 * @returns {Promise}
 */
http.delete = createRequest('delete')

export { http }
