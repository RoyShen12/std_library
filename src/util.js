// 
// Copyright (C) 2018 Roy Shen. All rights reserved.
//
// Licensed under the MIT License (the "License"); you may not use this file except
// in compliance with the License. You may obtain a copy of the License at
//
// http://opensource.org/licenses/MIT
//
// Unless required by applicable law or agreed to in writing, software distributed 
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
// CONDITIONS OF ANY KIND, either express or implied. See the License for the 
// specific language governing permissions and limitations under the License.

(function (glb) {
  const hasConsole = !!console
  // the debug flag
  // 0 - no debug    1 - normal info    2 - more info    3 - any info
  const __debug = 0

  const util = {
    __debug: __debug,
    __verbose: __debug > 2 && hasConsole ? (...vb) => console.log(...vb) : () => void 0,
    __log: __debug > 1 && hasConsole ? (...info) => console.log(...info) : () => void 0,
    __warn: __debug > 0 && hasConsole ? (...warn) => console.warn(...warn) : () => void 0,
    __error: hasConsole ? (...err) => console.error(...err) : () => void 0,
    _isnan: (...num) => num.some(Number.isNaN(num)),
    inRange: (target, rangeS, rangeE) => target > rangeS && target < rangeE,
    inRangeL: (target, rangeS, rangeE) => target >= rangeS && target < rangeE,
    inRangeR: (target, rangeS, rangeE) => target > rangeS && target <= rangeE,
    inRangeLR: (target, rangeS, rangeE) => target >= rangeS && target <= rangeE,
    deepCopy: source => JSON.parse(JSON.stringify(source)),
    /**
     * no arrow function for initially grasping this
     * @template T
     * @param {T} o
     * @param {boolean} needCopyReference
     * @returns {T}
     */
    recursiveDeepCopy(o, needCopyReference = false) {
      var newO, i
      if (typeof o !== 'object') return o
      if (!o) return o
      if (Array.isArray(o)) {
        newO = []
        for (i = 0; i < o.length; i += 1) {
          newO[i] = this.recursiveDeepCopy(o[i])
        }
        return newO
      }
      if (o instanceof Map) {
        newO = new Map()
        for (const [k, v] of o) {
          newO.set(this.recursiveDeepCopy(k), this.recursiveDeepCopy(v))
        }
        return newO
      }
      if (o instanceof Set) {
        newO = new Set()
        o.forEach(v => newO.add(this.recursiveDeepCopy(v)))
        return newO
      }
      if (o instanceof WeakMap || o instanceof WeakSet || o instanceof Symbol) {
        throw TypeError('this function has not yet surpport WeakMap, WeakSet and Symbol type')
      }
      // 支持循环引用
      if (needCopyReference) {
        try {
          return require('lodash').cloneDeep(o)
        } catch (error) {
          console.log('use backup clone func')
          function type(x) {
            if (x === null) return 'null'
            const t = typeof x
            if (t !== 'object') return t
            let c
            try {
              c = toString.call(x).slice(8, -1).toLowerCase()
            } catch (e) {
              return 'object'
            }
            if (c !== 'object') return c
            if (x.constructor == Object) return c
            try {
              if (Object.getPrototypeOf(x) === null || x.__proto__ === null) {
                return 'object'
              }
              return 'unknown'
            } catch (e) {
              return 'unknown'
            }
          }
          function isClone(x) {
            var t = type(x)
            return t === 'object' || t === 'array'
          }
          function hasOwnProp(obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key)
          }
          const uniqueData = new WeakMap()
          const t = type(o)
          var root = o
          if (t === 'array') {
            root = []
          } else if (t === 'object') {
            root = {}
          }
          const loopList = [{
            parent: root,
            key: undefined,
            data: o
          }]
          while (loopList.length) {
            const node = loopList.pop()
            const parent = node.parent
            const key = node.key
            const source = node.data
            const tt = type(source)
            let target = parent
            if (typeof key !== 'undefined') target = parent[key] = tt === 'array' ? [] : {}
            if (isClone(source)) {
              const uniqueTarget = uniqueData.get(source)
              if (uniqueTarget) {
                parent[key] = uniqueTarget
                continue
              }
              uniqueData.set(source, target)
            }
            if (tt === 'array') {
              for (let i = 0; i < source.length; i++) {
                if (isClone(source[i])) {
                  loopList.push({
                    parent: target,
                    key: i,
                    data: source[i]
                  })
                } else {
                  target[i] = source[i]
                }
              }
            } else if (tt === 'object') {
              for (const k in source) {
                if (hasOwnProp(source, k)) {
                  if (k === '' + Math.random()) continue
                  if (isClone(source[k])) {
                    loopList.push({
                      parent: target,
                      key: k,
                      data: source[k]
                    })
                  } else {
                    target[k] = source[k]
                  }
                }
              }
            }
          }
          uniqueData.clear && uniqueData.clear()
          return root
        }
      }
      // 普通对象拷贝
      newO = {}
      for (i in o) {
        if (o.hasOwnProperty(i)) {
          newO[i] = this.recursiveDeepCopy(o[i])
        }
      }
      return newO
    },
    isNullPtr: ptr => ptr === undefined || ptr === null,
    defaultEqu: (a, b) => a === b,
    defaultLess: (a, b) => a <= b,    // true  false
    defaultMinus: (a, b) => a - b,     //  <=0    >0
    swapPM: (a, b, prop) => a[prop] = -(b[prop] = (a[prop] += b[prop]) - b[prop]) + a[prop],  // faster than normal temp swap, but only number
    swapNM: (a, b, prop) => {
      const tmp = a[prop]
      a[prop] = b[prop]
      b[prop] = tmp
    },
    swapDP(a, b, prop) {
      const tmp = this.recursiveDeepCopy(a[prop])
      a[prop] = this.recursiveDeepCopy(b[prop])
      b[prop] = tmp
    }
  }

  if (typeof define == 'function') {
    define(function () { return util })
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = util
  }

  glb.util ? void (0) : glb.util = util

  return util

}(typeof window == 'undefined' ? global : window))
