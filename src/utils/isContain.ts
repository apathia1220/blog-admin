export const isFullContain = (container: number[], target: number[] | number) => {
  if (container.length === 0) return false

  if (target instanceof Array) {
    if (container.length >= 0 && target.length === 0) return true

    let count = 0
    target.forEach((item) => {
      const index = container.indexOf(item)
      if (index !== -1) count++
    })

    return count === target.length
  } else {
    const index = container.indexOf(target)
    return index !== -1 ? true : false
  }
}
