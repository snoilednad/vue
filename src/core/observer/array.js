/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

// 对于数组，通过这7个方法进行依赖收集,俗称"7君子哈哈"
const methodsToPatch = [
  'push', // 从数组的尾部插入
  'pop', // 从数组尾部删除
  'shift', // 从数组头部删除
  'unshift', // 从数组头部插入
  'splice', // 数组元素替换
  'sort', // 数组元素排序
  'reverse' // 数组元素反转
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
