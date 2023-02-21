import { cloneDeep, isArray, isObjectLike } from 'lodash-es'

type MergeType<T, S> = {
  [K in keyof T]: K extends keyof S ? S[K] : T[K]
}

export function baseMerge<T extends Record<string, any>, S extends Record<string, any>>(
  obj: T = {} as T,
  source: S,
  nullSafe = false
): MergeType<T, S> {
  if (source == null) {
    return obj
  }
  const result = {} as MergeType<T, S>

  Object.keys(obj).forEach((key) => {
    let val = source[key]
    const useObjVal = nullSafe ? val == null : val === undefined
    if (useObjVal) {
      val = obj[key]
    }
    result[key as keyof T] = cloneDeep(val)
  })
  return result
}

export function baseMergeDeep(defaultVal: any = {}, srcValue: any) {
  if (srcValue == null) {
    return defaultVal
  }
  const result: any = {}
  // ObjectLike 包含数组
  if (isArray(defaultVal)) {
    const defaultElem = defaultVal[0]
    return srcValue.map((val: any) => {
      return baseMergeDeep(defaultElem, val)
    })
  }
  Object.keys(defaultVal).forEach((key) => {
    let val = srcValue[key]
    if (val == null) {
      val = defaultVal[key]
    } else if (isObjectLike(val)) {
      result[key] = baseMergeDeep(defaultVal[key], val)
      return
    }
    result[key] = cloneDeep(val)
  })
  return result
}
