const __debug = false
const __log = (info) => __debug ? console.log(info) : void(0)
const __warn = (warn) => console.warn(warn)
const deepCopy = source => JSON.parse(JSON.stringify(source))
const isNullPtr = ptr => ptr === undefined || ptr === null
const defaultEqu = (a, b) => a === b
const defaultLess = (a, b) => a < b

class Node {
  //_data
  //forwardPtr
  //nextPtr

  constructor(elem, frontElem, nextElem) {
    this._data = elem
    this.forwardPtr = frontElem
    this.nextPtr = nextElem
  }
}

class list {
  //HeadNode
  //TailNode
  //_length

  constructor(elem) {
    // 空构造函数
    if (isNullPtr(elem)) {
      __log('empty constructor')
      this.HeadNode = null
      this.TailNode = null
      this._length = 0
    } else {
      if (elem instanceof list) { // 复制构造函数
        __log('copy constructor')
        this.HeadNode = null
        this.TailNode = null
        this._length = 0
        elem.itr((index, node) => {
          this.pushBack(deepCopy(node._data))
        })
      } else if (elem instanceof Array) { // 数组复制构造函数
        __log('array copy constructor')
        this.HeadNode = null
        this.TailNode = null
        this._length = 0
        for (let e of elem) {
          this.pushBack(e)
        }
      } else {  // 常规构造函数
        __log('default constructor')
        const node = new Node(elem, null, null)
        this.HeadNode = node
        this.TailNode = node
        this._length = 1
      }
    }
  }

  // 通过位置获取元素引用
  at(rInd) {
    const __size = this.size()
    let res = undefined
    if (typeof (rInd) !== 'number' || rInd < 0 || rInd > __size - 1 || !Number.isInteger(rInd)) {
      __warn('error index')
      return undefined
    }
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
  // 通过位置获取元素拷贝
  const_at(rInd) {
    const __size = this.size()
    let res = undefined
    if (typeof (rInd) !== 'number' || rInd < 0 || rInd > __size - 1 || !Number.isInteger(rInd)) {
      __warn('error index')
      return undefined
    }
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
  // 以给定值为容器填充
  fill(elem) {
    this.itr((index, node) => {
      node._data = elem
    })
  }
  // 插入元素到最前
  pushFront(elem) {
    if (isNullPtr(elem)) {
      __log('push front failed with null ptr')
      return
    }
    const node = new Node(elem, null, this.HeadNode)
    if (this.HeadNode !== null) {
      this.HeadNode.forwardPtr = node
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
  // 插入元素到最后
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
  // 任意位置插入元素
  insert(elem, position) {
    if (typeof (position) !== 'number' || position < 0 || position > this.size() || isNullPtr(elem)) {
      __warn('push front failed with null ptr or null/error position or position range error')
      return
    }
    if (!Number.isInteger(position)) {
      __warn('ensure position is an integer')
      return
    }
    if (position === 0) {
      this.pushFront(elem)
    } else if (position === this.size()) {
      this.pushBack(elem)
    } else {
      if (position < this.size() / 2) {
        this.itr((index, p) => {
          if (index === position) {
            const pForward = p.forwardPtr
            const pNext = p.nextPtr
            const node = new Node(elem, pForward, pNext)
            pForward.nextPtr = node
            pNext.forwardPtr = node
            this._length++
              return -1
          }
        })
      } else {
        this.reverse_itr((index, p) => {
          if (index === position) {
            const pForward = p.forwardPtr
            const pNext = p.nextPtr
            const node = new Node(elem, pForward, pNext)
            pForward.nextPtr = node
            pNext.forwardPtr = node
            this._length++
              return -1
          }
        })
      }
    }
  }
  // 丢弃前端一个元素
  popFront() {
    if (this.HeadNode !== null) {
      this.HeadNode.nextPtr.forwardPtr = null
      this.HeadNode = this.HeadNode.nextPtr
      this._length--
    }
  }
  // 丢弃后端一个元素
  popBack() {
    if (this.TailNode !== null) {
      this.TailNode.forwardPtr.nextPtr = null
      this.TailNode = this.TailNode.forwardPtr
      this._length--
    }
  }
  // 获得头部元素的引用
  get begin() {
    return this.HeadNode._data
  }
  // 获得尾部元素的引用
  get end() {
    return this.TailNode._data
  }
  // 获得头部元素的拷贝
  get const_begin() {
    return deepCopy(this.HeadNode._data)
  }
  // 获得尾部元素的拷贝
  get const_end() {
    return deepCopy(this.TailNode._data)
  }
  // 正向迭代器
  // callback: param index, param node, return -1 to stop looping
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
  // 反向迭代器
  // callback: param index, param node, return -1 to stop looping
  reverse_itr(callback) {
    let p = null
    let index = this.size()
    do {
      p === null ? p = this.TailNode : p = p.forwardPtr
      index--
      let cmd = callback(index, p)
      if (cmd === -1)
        break
    } while (!isNullPtr(p.forwardPtr))
  }
  // 正序全部元素的引用（数组）
  get data() {
    let data = []
    this.itr((index, node) => {
      data.push(node._data)
    })
    return data
  }
  // 逆序全部元素的引用（数组）
  get reverse_data() {
    let data = []
    this.reverse_itr((index, node) => {
      data.push(node._data)
    })
    return data
  }
  // 正序全部元素的拷贝（数组）
  get const_data() {
    let data = []
    this.itr((index, node) => {
      data.push(deepCopy(node._data))
    })
    return data
  }
  // 逆序全部元素的拷贝（数组）
  get const_reverse_data() {
    let data = []
    this.reverse_itr((index, node) => {
      data.push(deepCopy(node._data))
    })
    return data
  }
  // 获取容器元素个数
  size() {
    let counter
    // #ifdef __DEBUG
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
  // 获取容器元素个数
  get length() {
    return this.size()
  }
  // 返回容器是否为空
  empty() {
    return this.size() === 0
  }
  // 移除指定位置元素
  remove(position) {
    if (typeof (position) !== 'number') {
      __warn('push front failed with null/error position')
      return
    }
    if (!Number.isInteger(position)) {
      __warn('ensure position is an integer')
      return
    }
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
        this.HeadNode.nextPtr.forwardPtr = null
        this.HeadNode = this.HeadNode.nextPtr
        this._length--
      }
    } else if (position === this.size() - 1) {
      this.TailNode.forwardPtr.nextPtr = null
      this.TailNode = this.TailNode.forwardPtr
      this._length--
    } else {
      if (position < this.size() / 2) {
        this.itr((index, p) => {
          if (index === position) {
            const pForward = p.forwardPtr
            const pNext = p.nextPtr
            pForward.nextPtr = pNext
            pNext.forwardPtr = pForward
            this._length--
              return -1
          }
        })
      } else {
        this.reverse_itr((index, p) => {
          if (index === position) {
            const pForward = p.forwardPtr
            const pNext = p.nextPtr
            pForward.nextPtr = pNext
            pNext.forwardPtr = pForward
            this._length--
              return -1
          }
        })
      }
    }
  }
  // 移除全部元素
  clear() {
    this._length = 0
    this.HeadNode = null
    this.TailNode = null
    __log('clear over')
  }
  // 颠倒所有元素
  reverse() {
    let tmp = null
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
        _n.node.forwardPtr = _n.node.nextPtr
        _n.node.nextPtr = null
      } else if (_n.i === this.size() - 1) {
        _n.node.nextPtr = _n.node.forwardPtr
        _n.node.forwardPtr = null
      } else {
        tmp = _n.node.forwardPtr
        _n.node.forwardPtr = _n.node.nextPtr
        _n.node.nextPtr = tmp
      }
    }
    tmp = this.HeadNode
    this.HeadNode = this.TailNode
    this.TailNode = tmp
  }
  // 排序 cmpFunc为比较函数
  sort(cmpFunc = defaultLess) {
    // define partion and qsort function
    const partion = (pHead, pLow, pHigh) => {
      const pivot = pLow._data
      while (pLow !== pHigh) {
        while (pLow !== pHigh && !cmpFunc(pHigh._data, pivot))
          pHigh = pHigh.forwardPtr
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
        quick_sort(pstHead, pstLow, pstTmp.forwardPtr)
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
  // 查找目标元素 equFunc为相等回调函数
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
  // 从指定位置开始查找目标元素 equFunc为相等回调函数
  findFrom(pos, equFunc) {
    if (typeof (pos) !== 'number' || pos < 0 || pos > this.size() - 1 || !Number.isInteger(pos)) {
      __warn('wrong param error: "position", should be an integer between 0 and length-1')
      return undefined
    }
    if (!(equFunc instanceof Function)) {
      return undefined
    }
    let res = undefined
    this.itr((index, node) => {
      if (equFunc(node._data) && index >= pos) {
        res = node._data
        return -1
      }
    })
    return res
  }
  // 查找目标元素位置 equFunc为相等回调函数
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
  // 从指定位置开始查找目标元素位置 equFunc为相等回调函数
  findIndexFrom(pos, equFunc) {
    if (typeof (pos) !== 'number' || pos < 0 || pos > this.size() - 1 || !Number.isInteger(pos)) {
      __warn('wrong param error: "position", should be an integer between 0 and length-1')
      return -1
    }
    if (!(equFunc instanceof Function)) {
      return -1
    }
    let res = -1
    this.itr((index, node) => {
      if (equFunc(node._data) && index >= pos) {
        res = index
        return -1
      }
    })
    return res
  }
  // 与目标容器在尾部拼接
  back_concat(anotherListRef) {
    if (anotherListRef instanceof list) {
      if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
        __warn('bad concat target')
        return
      }
      this.TailNode.nextPtr = anotherListRef.HeadNode
      anotherListRef.HeadNode.forwardPtr = this.TailNode
      this.TailNode = anotherListRef.TailNode
      this._length += anotherListRef._length
    }
  }
  // 与目标容器在头部拼接
  front_concat(anotherListRef) {
    if (anotherListRef instanceof list) {
      if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
        __warn('bad concat target')
        return
      }
      this.HeadNode.forwardPtr = anotherListRef.TailNode
      anotherListRef.TailNode.nextPtr = this.HeadNode
      this.HeadNode = anotherListRef.HeadNode
      this._length += anotherListRef._length
    }
  }
  // 与目标容器在指定位置拼接
  concat(anotherListRef, position) {
    if (anotherListRef instanceof list) {
      if (anotherListRef === this) {
        __warn('self concating is not allowed, use "front_concat" or "back_concat" to instead')
        return
      }
      if (position === undefined) {
        this.back_concat(anotherListRef)
      }
      if (typeof (position) !== 'number' || position < 0 || position > this.size()) {
        __warn('push front failed with null/error position or position range error')
        return
      }
      if (!Number.isInteger(position)) {
        __warn('ensure position is an integer')
        return
      }
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
              pNext.forwardPtr = anotherListRef.TailNode
              anotherListRef.HeadNode.forwardPtr = pForward
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
              pNext.forwardPtr = anotherListRef.TailNode
              anotherListRef.HeadNode.forwardPtr = pForward
              anotherListRef.TailNode.nextPtr = pNext
              this._length += anotherListRef._length
              return -1
            }
          })
        }
      }
    }
  }
  // 两个容器交换
  swap(anotherListRef) {
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
