// 
// Copyright (C) 2017 Roy Shen. All rights reserved.
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

const __debug = false
const swap = (a, b) => {
  const t = a
  a = b
  b = t
}
const __log = info => __debug ? console.log(info) : void(0)
const __warn = warn => console.warn(warn)
const inRange = (target, rangeS, rangeE) => target > rangeS && target < rangeE
const inRangeL = (target, rangeS, rangeE) => target >= rangeS && target < rangeE
const inRangeR = (target, rangeS, rangeE) => target > rangeS && target <= rangeE
const inRangeLR = (target, rangeS, rangeE) => target >= rangeS && target <= rangeE
const deepCopy = source => JSON.parse(JSON.stringify(source))
const isNullPtr = ptr => ptr === undefined || ptr === null
const defaultEqu = (a, b) => a === b
const defaultLess = (a, b) => a < b
/**
 * @desc the node structure to composite a list
 * @private {any} _data - element of the node
 * @private {Node} previousPtr - previous node
 * @private {Node} nextPtr - next node
 */
class Node {
  constructor(elem, frontElem, nextElem) {
    this._data = elem
    this.previousPtr = frontElem
    this.nextPtr = nextElem
  }
}
/**
 * @desc the list container
 * @private {Node} HeadNode - first node | null
 * @private {Node} TailNode - last node | null
 * @private {Number} _length - size of list 
 */
class list {
  constructor(elem) {
    if (isNullPtr(elem)) { // empty constructor
      __log('empty constructor')
      this.HeadNode = null
      this.TailNode = null
      this._length = 0
    } else {
      if (elem instanceof list) { // copy constructor
        __log('copy constructor')
        this.HeadNode = null
        this.TailNode = null
        this._length = 0
        elem.itr((index, node) => {
          this.pushBack(deepCopy(node._data))
        })
      } else if (elem instanceof Array) { // copy from array constructor
        __log('array copy constructor')
        this.HeadNode = null
        this.TailNode = null
        this._length = 0
        for (let e of elem) {
          this.pushBack(e)
        }
      } else { // single element pushing constructor
        __log('default constructor')
        const node = new Node(elem, null, null)
        this.HeadNode = node
        this.TailNode = node
        this._length = 1
      }
    }
  }

  // get element reference by index
  at(rInd) {
    const __size = this.size()
    let res = undefined
    if (typeof (rInd) !== 'number' || !inRangeLR(rInd, 0, __size)) {
      __warn('error index')
      return undefined
    }
    rInd = ~~rInd
    if (rInd < __size / 2) {
      this.itr((index, node) => {
        if (index === rInd) {
          res = node._data
          return -1
        }
      })
    } else {
      this.reverse_itr((index, node) => {
        if (index === rInd) {
          res = node._data
          return -1
        }
      })
    }
    return res
  }
  // get element copy by index
  const_at(rInd) {
    const __size = this.size()
    let res = undefined
    if (typeof (rInd) !== 'number' || !inRangeLR(rInd, 0, __size)) {
      __warn('error index')
      return undefined
    }
    rInd = ~~rInd
    if (rInd < __size / 2) {
      this.itr((index, node) => {
        if (index === rInd) {
          res = deepCopy(node._data)
          return -1
        }
      })
    } else {
      this.reverse_itr((index, node) => {
        if (index === rInd) {
          res = deepCopy(node._data)
          return -1
        }
      })
    }
    return res
  }
  // fill list with giving element
  fill(elem, start = 0, end = this.size()) {
    this.itr((index, node) => {
      if (inRangeLR(index, start, end))
        node._data = elem
    })
  }

  pushFront(elem) {
    if (isNullPtr(elem)) {
      __log('push front failed with null ptr')
      return
    }
    const node = new Node(elem, null, this.HeadNode)
    if (this.HeadNode !== null) {
      this.HeadNode.previousPtr = node
    }
    this.HeadNode = node
    // if this is empty
    if (this.TailNode === null) {
      this.TailNode = node
    }
    this._length++
      __log('push front: new node:')
    __log(node)
  }

  pushBack(elem) {
    if (isNullPtr(elem)) {
      __warn('push front failed with null ptr')
      return
    }
    const node = new Node(elem, this.TailNode, null)
    if (this.TailNode !== null) {
      this.TailNode.nextPtr = node
    }
    this.TailNode = node
    // if this is empty
    if (this.HeadNode === null) {
      this.HeadNode = node
    }
    this._length++
      __log('push back: new node:')
    __log(node)
  }

  insert(elem, position) {
    if (typeof (position) !== 'number' || !inRangeLR(position, 0, this.size()) || isNullPtr(elem)) {
      __warn('push front failed with null ptr or null/error position or position range error')
      return
    }
    position=~~position
    if (position === 0) {
      this.pushFront(elem)
    } else if (position === this.size()) {
      this.pushBack(elem)
    } else {
      if (position < this.size() / 2) {
        this.itr((index, p) => {
          if (index === position) {
            const pForward = p.previousPtr
            const pNext = p.nextPtr
            const node = new Node(elem, pForward, pNext)
            pForward.nextPtr = node
            pNext.previousPtr = node
            this._length++
              return -1
          }
        })
      } else {
        this.reverse_itr((index, p) => {
          if (index === position) {
            const pForward = p.previousPtr
            const pNext = p.nextPtr
            const node = new Node(elem, pForward, pNext)
            pForward.nextPtr = node
            pNext.previousPtr = node
            this._length++
              return -1
          }
        })
      }
    }
  }

  popFront() {
    if (this.HeadNode !== null) {
      this.HeadNode.nextPtr.previousPtr = null
      this.HeadNode = this.HeadNode.nextPtr
      this._length--
    }
  }

  popBack() {
    if (this.TailNode !== null) {
      this.TailNode.previousPtr.nextPtr = null
      this.TailNode = this.TailNode.previousPtr
      this._length--
    }
  }

  get begin() {
    return this.HeadNode._data
  }

  get end() {
    return this.TailNode._data
  }

  get const_begin() {
    return deepCopy(this.HeadNode._data)
  }

  get const_end() {
    return deepCopy(this.TailNode._data)
  }
  /**
   * @desc forward iterator
   * @param {Function} callback - callback function to handle the index and node while iterating, return -1 to break the iterator loop
   */
  itr(callback) {
    let p = null
    let index = -1
    do {
      p === null ? p = this.HeadNode : p = p.nextPtr
      index++
      let cmd = callback(index, p)
      if (cmd === -1)
        break
    } while (!isNullPtr(p.nextPtr))
  }
  /**
   * @desc reverse iterator
   * @param {Function} callback - callback function to handle the index and node while iterating, return -1 to break the iterator loop
   */
  reverse_itr(callback) {
    let p = null
    let index = this.size()
    do {
      p === null ? p = this.TailNode : p = p.previousPtr
      index--
      let cmd = callback(index, p)
      if (cmd === -1)
        break
    } while (!isNullPtr(p.previousPtr))
  }
  // specifies the default iterator for list
  // make list able to called by for...of
  // the returns value is const node->_data
  [Symbol.iterator]() {
    if (this.size() === 0) {
      return {
        next() {
          return {
            done: true
          }
        }
      }
    } else {
      let thisIns = this
      let p = null
      return {
        next() {
          p === null ? p = thisIns.HeadNode : p = p.nextPtr
          let f = p === null
          return {
            value: f ? null : p._data,
            done: f ? true : false
          }
        }
      }
    }
  }
  // array of data reference
  get data() {
    let data = []
    this.itr((index, node) => {
      data.push(node._data)
    })
    return data
  }
  // array of reversed data reference
  get reverse_data() {
    let data = []
    this.reverse_itr((index, node) => {
      data.push(node._data)
    })
    return data
  }
  // array of data copy
  get const_data() {
    let data = []
    this.itr((index, node) => {
      data.push(deepCopy(node._data))
    })
    return data
  }
  // array of reversed data copy
  get const_reverse_data() {
    let data = []
    this.reverse_itr((index, node) => {
      data.push(deepCopy(node._data))
    })
    return data
  }
  // do callback(elem) for every node->_data
  // for example x.foreach( (x)=>x=x*x )
  foreach(callback, start = 0, end = this.size() - 1) {
    if (!this.empty()) {
      this.itr((index, node) => {
        if (inRangeLR(index, start, end))
          callback(node._data)
      })
    }
  }
  // The map() method creates a new list
  // with the results of calling callback function on every element in the calling list.
  map(callback) {
    const lp = new list()
    if (!this.empty()) {
      this.itr((index, node) => {
        lp.pushBack(callback(node._data))
      })
    }
    return lp
  }
  // return the size of calling list
  size() {
    let counter
    if (__debug) {
      let node = this.HeadNode
      if (node === null) {
        return 0
      }
      counter = 1
      while (node.nextPtr !== null) {
        counter++
        node = node.nextPtr
      }
      __log('debug size: (counter:_length)->' + counter + ':' + this._length)
    } else {
      counter = this._length
    }
    return counter
  }

  get length() {
    return this.size()
  }

  empty() {
    return this.size() === 0
  }
  // remove a node by specifying it's index
  remove(position) {
    if (typeof (position) !== 'number') {
      __warn('push front failed with null/error position')
      return
    }
    position=~~position
    if (position < 0 || position >= this.size()) {
      __warn('position range exceed')
      return
    }
    if (position === 0) {
      if (this.size() === 1) {
        this.HeadNode = null
        this.TailNode = null
        this._length--
      } else {
        this.HeadNode.nextPtr.previousPtr = null
        this.HeadNode = this.HeadNode.nextPtr
        this._length--
      }
    } else if (position === this.size() - 1) {
      this.TailNode.previousPtr.nextPtr = null
      this.TailNode = this.TailNode.previousPtr
      this._length--
    } else {
      if (position < this.size() / 2) {
        this.itr((index, p) => {
          if (index === position) {
            const pForward = p.previousPtr
            const pNext = p.nextPtr
            pForward.nextPtr = pNext
            pNext.previousPtr = pForward
            this._length--
              return -1
          }
        })
      } else {
        this.reverse_itr((index, p) => {
          if (index === position) {
            const pForward = p.previousPtr
            const pNext = p.nextPtr
            pForward.nextPtr = pNext
            pNext.previousPtr = pForward
            this._length--
              return -1
          }
        })
      }
    }
  }
  /**
   * @desc remove a segment of nodes and replace with given elements
   * @param {Number} index - index at which to start changing the list (with origin 0)
   * @param {Number} [deleteCount] - An integer indicating the number of old list elements to remove
   * @param {any[]} [elems] - the elements to add to the list, beginning at the start index, 
   * if you don't specify any elements, splice() will only remove elements from the array
   * @returns {any[]} a list containing the deleted elements, if no elements are removed, an empty list is returned
   */
  splice(index = 0, deleteCount = this.size(), ...elems){
    // to do
  }
  // remove all nodes
  clear() {
    this._length = 0
    this.HeadNode = null
    this.TailNode = null
    __log('clear over')
  }

  reverse() {
    if (this.size() < 2) {
      return
    }
    let nodeArr = []
    this.itr((index, node) => {
      nodeArr.push({
        i: index,
        node: node
      })
    })
    for (let _n of nodeArr) {
      if (_n.i === 0) {
        _n.node.previousPtr = _n.node.nextPtr
        _n.node.nextPtr = null
      } else if (_n.i === this.size() - 1) {
        _n.node.nextPtr = _n.node.previousPtr
        _n.node.previousPtr = null
      } else {
        swap(_n.node.previousPtr, _n.node.nextPtr)
      }
    }
    swap(this.HeadNode, this.TailNode)
  }
  // quick sorting, may be unstable
  sort(cmpFunc = defaultLess) {
    // define partion and qsort function
    const partion = (pHead, pLow, pHigh) => {
      const pivot = pLow._data
      while (pLow !== pHigh) {
        while (pLow !== pHigh && !cmpFunc(pHigh._data, pivot))
          pHigh = pHigh.previousPtr
        let temp = pLow._data
        pLow._data = pHigh._data
        pHigh._data = temp
        while (pLow !== pHigh && cmpFunc(pLow._data, pivot))
          pLow = pLow.nextPtr
        temp = pLow._data
        pLow._data = pHigh._data
        pHigh._data = temp
      }
      return pLow
    }
    const quick_sort = (pstHead, pstLow, pstHigh) => {
      let pstTmp = null
      pstTmp = partion(pstHead, pstLow, pstHigh)
      if (pstLow !== pstTmp) {
        quick_sort(pstHead, pstLow, pstTmp.previousPtr)
      }
      if (pstHigh !== pstTmp) {
        quick_sort(pstHead, pstTmp.nextPtr, pstHigh)
      }
    }

    if (isNullPtr(this.HeadNode) || this.size() < 2) {
      __log('empty or only one element list')
    }
    quick_sort(this.HeadNode, this.HeadNode, this.TailNode)
  }
  // equFunc: callback function, @param node->_data, return true while finded the target node
  find(equFunc) {
    if (!(equFunc instanceof Function)) {
      return undefined
    }
    let res = undefined
    this.itr((index, node) => {
      if (equFunc(node._data)) {
        res = node._data
        return -1
      }
    })
    return res
  }

  findFrom(pos, equFunc) {
    if (typeof (pos) !== 'number' || !inRangeLR(pos, 0, this.size())) {
      __warn('wrong param error: "position", should be an integer between 0 and length-1')
      return undefined
    }
    if (!(equFunc instanceof Function)) {
      return undefined
    }
    pos=~~pos
    let res = undefined
    this.itr((index, node) => {
      if (equFunc(node._data) && index >= pos) {
        res = node._data
        return -1
      }
    })
    return res
  }

  findIndex(equFunc) {
    if (!(equFunc instanceof Function)) {
      return -1
    }
    let res = -1
    this.itr((index, node) => {
      if (equFunc(node._data)) {
        res = index
        return -1
      }
    })
    return res
  }

  findIndexFrom(pos, equFunc) {
    if (typeof (pos) !== 'number' || !inRangeLR(pos, 0, this.size())) {
      __warn('wrong param error: "position", should be an integer between 0 and length-1')
      return -1
    }
    if (!(equFunc instanceof Function)) {
      return -1
    }
    pos=~~pos
    let res = -1
    this.itr((index, node) => {
      if (equFunc(node._data) && index >= pos) {
        res = index
        return -1
      }
    })
    return res
  }

  back_concat(anotherListRef) {
    if (anotherListRef instanceof list) {
      if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
        __warn('bad concat target')
        return
      }
      this.TailNode.nextPtr = anotherListRef.HeadNode
      anotherListRef.HeadNode.previousPtr = this.TailNode
      this.TailNode = anotherListRef.TailNode
      this._length += anotherListRef._length
    }
  }

  front_concat(anotherListRef) {
    if (anotherListRef instanceof list) {
      if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
        __warn('bad concat target')
        return
      }
      this.HeadNode.previousPtr = anotherListRef.TailNode
      anotherListRef.TailNode.nextPtr = this.HeadNode
      this.HeadNode = anotherListRef.HeadNode
      this._length += anotherListRef._length
    }
  }

  concat(anotherListRef, position) {
    if (anotherListRef instanceof list) {
      if (anotherListRef === this) {
        __warn('self concating is not allowed, use "front_concat" or "back_concat" to instead')
        return
      }
      if (position === undefined) {
        this.back_concat(anotherListRef)
      }
      if (typeof (position) !== 'number' || !inRangeLR(position, 0, this.size())) {
        __warn('push front failed with null/error position or position range error')
        return
      }
      position=~~position
      if (position === 0) {
        this.front_concat(anotherListRef)
      } else if (position === this.size()) {
        this.back_concat(anotherListRef)
      } else {
        if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
          __warn('bad concat target')
          return
        }
        if (position < this.size() / 2) {
          this.itr((index, p) => {
            if (index === position) {
              const pForward = p
              const pNext = p.nextPtr
              pForward.nextPtr = anotherListRef.HeadNode
              pNext.previousPtr = anotherListRef.TailNode
              anotherListRef.HeadNode.previousPtr = pForward
              anotherListRef.TailNode.nextPtr = pNext
              this._length += anotherListRef._length
              return -1
            }
          })
        } else {
          this.reverse_itr((index, p) => {
            if (index === position) {
              const pForward = p
              const pNext = p.nextPtr
              pForward.nextPtr = anotherListRef.HeadNode
              pNext.previousPtr = anotherListRef.TailNode
              anotherListRef.HeadNode.previousPtr = pForward
              anotherListRef.TailNode.nextPtr = pNext
              this._length += anotherListRef._length
              return -1
            }
          })
        }
      }
    }
  }

  swap(anotherListRef) {
    if (anotherListRef instanceof list) {
      const pHead = this.HeadNode
      const pTail = this.TailNode
      const pLength = this._length
      this.HeadNode = anotherListRef.HeadNode
      this.TailNode = anotherListRef.TailNode
      this._length = anotherListRef._length
      anotherListRef.HeadNode = pHead
      anotherListRef.TailNode = pTail
      anotherListRef._length = pLength
    }
  }
}

// uncomment next line when in webpack environment
// export default list