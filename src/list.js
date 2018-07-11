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

// I don't like the foolish and bumptious eslint, so
/* eslint-disable */

// the debug flag
const __debug = false
// reference swap function
const swap = (a, b) => {
    const t = a
    a = b
    b = t
}
const __log = (...info) => __debug && console ? console.log(...info) : void (0)
const __warn = (...warn) => console ? console.warn(...warn) : void (0)
const __error = (...err) => console ? console.error(...err) : void(0)
const _isnan = (...num) => num.some(Number.isNaN(num))
const inRange = (target, rangeS, rangeE) => target > rangeS && target < rangeE
const inRangeL = (target, rangeS, rangeE) => target >= rangeS && target < rangeE
const inRangeR = (target, rangeS, rangeE) => target > rangeS && target <= rangeE
const inRangeLR = (target, rangeS, rangeE) => target >= rangeS && target <= rangeE
const deepCopy = source => JSON.parse(JSON.stringify(source))
const isNullPtr = ptr => ptr === undefined || ptr === null
const defaultEqu = (a, b) => a === b
const defaultLess = (a, b) => a < b    // true  false
const defaultMinus = (a, b) => a - b   //  <0    >0
/**
 * - the node structure to composite a list
 * 
 *  <--[previousPtr]-- ( Node: ( _data ) ) --[nextPtr]-->
 * 
 * @private {any} _data - element of the node
 * @private {Node} previousPtr - previous node
 * @private {Node} nextPtr - next node
 */
class Node {
    static isNode(objToTest) {
        return (
            objToTest instanceof Node &&
            objToTest.hasOwnProperty('_data') &&
            objToTest.hasOwnProperty('previousPtr') &&
            objToTest.hasOwnProperty('nextPtr')
        )
    }
    constructor(elem, frontElem, nextElem) {
        this._data = elem
        this.previousPtr = frontElem
        this.nextPtr = nextElem
    }
    // escape this node, illegal while has no pre or next node
    escape() {
        if (!Node.isNode(this.previousPtr) || !Node.isNode(this.nextPtr)) {
            __warn('[Node.escape] bad call, expect previousPtr and nextPtr exists')
            return
        }
        this.previousPtr.nextPtr = this.nextPtr
        this.nextPtr.previousPtr = this.previousPtr
        this.previousPtr = null
        this.nextPtr = null
        return this._data
    }
    // just like a deconstructor
    destory() {
        this._data = null
        this.previousPtr = null
        this.nextPtr = null
    }
}
/**
 * - the list container
 * 
 * - list structure is like this:
 * 
 *  ( null )
 *      Λ
 *      |
 * [previousPtr]
 *      |
 *  ( HeadNode: (_data) ) --[nextPtr]--> ( *Node: (_data) ) --[nextPtr]--> ...... --[nextPtr]--> ( TailNode: (_data) ) --[nextPtr]--> ( null )
 *                       <--[previousPtr]--                <--[previousPtr]--    <--[previousPtr]--
 * 
 *                                                         [<-     _length      ->]
 * 
 * - * in List, methods with a prefix 'const', like { const_at },{ const_begin }, has indicated that
 *   these methods will return a copy not the reference of the elements' '_data' property.
 * 
 * @private {Node} HeadNode - first node | null
 * @private {Node} TailNode - last node | null
 * @private {Number} _length - size of list 
 */
class list {
    // static method

    // List.isList  just like Array.isArray
    static isList(objToTest) {
        return (
            objToTest instanceof list &&
            objToTest.hasOwnProperty('HeadNode') &&
            objToTest.hasOwnProperty('TailNode') &&
            objToTest.hasOwnProperty('_length')
        )
    }
    // returns a new list by a given array
    static fromArray(sourceArray) {
        if (!Array.isArray(sourceArray)) {
            __warn('[list.fromArray] unexpected parameter 0 token, expected Array type')
            return undefined
        }
        return new list(sourceArray)
    }
    // clone list
    static clone(listR) {
        return new list(listR)
    }
    
    constructor(elem) {
        if (isNullPtr(elem)) { // empty constructor
            __log('empty constructor')
            this.HeadNode = null
            this.TailNode = null
            this._length = 0
        } else {
            if (list.isList(elem)) { // copy constructor
                __log('copy constructor')
                this.HeadNode = null
                this.TailNode = null
                this._length = 0
                elem.itr((index, node) => {
                    this.pushBack(deepCopy(node._data))
                })
            } else if (Array.isArray(elem)) { // copy from array constructor
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
        if (typeof (rInd) !== 'number' || !inRangeLR(rInd, 0, __size - 1)) {
            __warn('[list.at] bad parameter 0 given: ', rInd)
            return undefined
        }
        let res = undefined
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
        if (typeof (rInd) !== 'number' || !inRangeLR(rInd, 0, __size - 1)) {
            __warn('[list.const_at] bad parameter 0 given: ', rInd)
            return undefined
        }
        let res = undefined
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

    // fill list with giving element from start index to end index
    // alternative option { couldExeed } can 
    // return this
    fill(elem, start = 0, end = this.size() - 1, couldExeed = false) {
        // check elem
        if (isNullPtr(elem)) {
            __warn('[list.fill] cannot fill with the given parameter 0 as NullPtr')
            return this
        }
        // check start end
        if (typeof start !== 'number' || start < 0 || (!this.empty() && start > this.size() - 1 ) || (this.empty() && start !== 0)) {
            __warn('[list.fill] cannot fill with bad parameter 1 : not a number or range error')
            return this
        }
        if (typeof end !== 'number' || end < 0 || end < start) {
            __warn('[list.fill] cannot fill with bad parameter 2 : not a number or range error')
            return this
        }
        if (this.empty()) {
            if (couldExeed) {
                __log('list.fill exeed.')
                for (let i_ = 0; i_ < end; i_++) {
                    this.pushBack(elem)
                }
                return this
            } else {
                __warn('[list.fill] can only fill an empty list with parameter 3 as true')
                return this
            }
        }
        this.itr((index, node) => {
            if (inRangeLR(index, start, end))
                node._data = elem
        })
        // pushing to tail
        if (end > this.size() - 1 && couldExeed) {
            __log('fill:couldExeed, adding count: ', end - (this.size() - 1))
            for (let _idx = 0; _idx < end - (this.size() - 1); _idx++) {
                this.pushBack(elem)
            }
        }
        couldExeed ? __log('after fill _length is ', this._length) : void(0)
        return this
    }

    toArray() {
        const ret = []
        this.itr((index, node) => {
            ret.push(deepCopy(node._data))
        })
        return ret
    }

    toArrayRef() {
        const ret = []
        this.itr((index, node) => {
            ret.push(node._data)
        })
        return ret
    }

    pushFront(elem) {
        if (isNullPtr(elem)) {
            __warn('[list.pushFront] cannot push parameter 0 which is null or undefined')
            return
        }
        const node = new Node(elem, null, this.HeadNode)
        if (this.HeadNode !== null) {
            this.HeadNode.previousPtr = node
        }
        this.HeadNode = node
        // if this is an empty list
        if (this.TailNode === null) {
            this.TailNode = node
        }
        this._length++
        __log('push front: a new node: ')
        return this
    }

    pushBack(elem) {
        if (isNullPtr(elem)) {
            __warn('[list.pushBack] cannot push parameter 0 which is null or undefined')
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
        __log('push back: a new node:')
        return this
    }

    // insert elem after index { position }, range is [0, length - 1]
    insert(elem, position) {
        if (typeof (position) !== 'number' || !inRangeLR(position, 0, this.size()) || isNullPtr(elem)) {
            __warn('[list.insert] failed with parameter 0 NullPtr or parameter 1 missing/range error')
            return
        }
        position = ~~position
        if (position === 0) {
            this.pushFront(elem)
        } else if (position === this.size()) {
            this.pushBack(elem)
        } else {
            if (position < this.size() / 2) {
                this.itr((index, p) => {
                    if (index === position) {
                        const pNext = p.nextPtr
                        const node = new Node(elem, p, pNext)
                        p.nextPtr = node
                        pNext.previousPtr = node
                        this._length++
                        return -1
                    }
                })
            } else {
                this.reverse_itr((index, p) => {
                    if (index === position) {
                        const pNext = p.nextPtr
                        const node = new Node(elem, p, pNext)
                        p.nextPtr = node
                        pNext.previousPtr = node
                        this._length++
                        return -1
                    }
                })
            }
        }
        return this
    }

    popFront() {
        let ans = this.HeadNode ? this.HeadNode._data : null
        if (this.HeadNode !== null) {
            this.HeadNode.nextPtr.previousPtr = null
            this.HeadNode = this.HeadNode.nextPtr
            this._length--
        }
        return ans
    }

    popBack() {
        let ans = this.TailNode ? this.TailNode._data : null
        if (this.TailNode !== null) {
            this.TailNode.previousPtr.nextPtr = null
            this.TailNode = this.TailNode.previousPtr
            this._length--
        }
        return ans
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
     * forward iterator
     * @param {handler} callback - callback function to handle the index and node while iterating, return -1 to break the iterator loop
     */
    itr(callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            __warn('[list.itr] parameter 0 need to be with a type "function"')
            return
        }
        if (this.empty()) {
            __log('[list.itr] returned with empty list')
            return
        }
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
     * reverse iterator
     * @param {Function} callback - callback function to handle the index and node while iterating, return -1 to break the iterator loop
     */
    reverse_itr(callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            __warn('[list.reverse_itr] parameter 0 need to be with a type "function"')
            return
        }
        if (this.empty()) {
            __log('[list.reverse_itr] returned with empty list')
            return
        }
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
                    p !== null ? p = p.nextPtr : p = thisIns.HeadNode
                    let f = p !== null
                    return {
                        value: f ? p._data : null,
                        done: !f
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
    // for example x.forEach( x => x = x**2 )
    forEach(callback, start = 0, end = this.size() - 1) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            __warn('[list.forEach] expected a parameter 0 with a type "function"')
            return
        }
        if (!this.empty()) {
            this.itr((index, node) => {
                if (inRangeLR(index, start, end))
                    callback(node._data, index, this)
            })
        }
    }
    // The every method tests every element of this list
    // only returns true while all elements pass through the callback function
    every(callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            __warn('[list.every] expected a parameter 0 with a type "function"')
            return
        }
        if (this.empty()) {
            __log('[list.every] returned true but only because of empty list')
            return true
        }
        let ans = true
        this.itr((index, node) => {
            ans = ans && callback(node._data, index ,this)
        })
        return ans
    }
    // The some method tests every element of this list
    // returns true while at least one element pass through the callback function
    some(callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            __warn('[list.some] expected a parameter 0 with a type "function"')
            return
        }
        if (this.empty()) {
            __log('[list.some] returned true but only because of empty list')
            return true
        }
        let ans = false
        this.itr((index, node) => {
            ans = ans || callback(node._data, index, this)
            // if get ans as true, immediately jump out of the itr loop
            return ans ? -1 : 0
        })
        return ans
    }
    // The map method creates a new list
    // with the results of calling callback function on every element in the calling list.
    map(callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            __warn('[list.map] expected a parameter 0 with a type "function"')
            return
        }
        const lp = new list()
        if (!this.empty()) {
            this.itr((index, node) => {
                lp.pushBack(callback(node._data, index, this))
            })
        }
        return lp
    }
    // The filter method creates a new list with elements pass the callback fucntion
    filter(callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            __warn('[list.filter] expected a parameter 0 with a type "function"')
            return
        }
        const lp = new list()
        if (!this.empty()) {
            this.itr((index, node) => {
                if (callback(node._data, index, this)) {
                    lp.pushBack(node._data)
                }
            })
        }
        return lp
    }
    // The includes method tests every element of this list
    // returns true while at least find out one element equal to a given value
    includes(searchElement, fromIndex) {
        if (this.size() === 0) {
            return false
        }
        const len = this.size() >>> 0
        const n = Number.isNaN(fromIndex) ? 0 : fromIndex | 0
        let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)
        while (k < len) {
            if (this.at(k) === searchElement) {
                return true
            }
            k++
        }
        return false
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
            __log('debug size: (calculated:_length)->' + counter + ':' + this._length)
            counter !== this._length ? __error('size() debug error ocurred: counter !== this._length !') : void(0)
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
        if (typeof (position) !== 'number' || Number.isNaN(position)) {
            __warn('[list.remove] failed with parameter 0 of NullPtr/errorType/NaN')
            return
        }
        position = ~~position
        if (position < 0 || position >= this.size()) {
            __warn('[list.remove] position range exceed')
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
                        // const pForward = p.previousPtr
                        // const pNext = p.nextPtr
                        // pForward.nextPtr = pNext
                        // pNext.previousPtr = pForward
                        p.escape()
                        this._length--
                        return -1
                    }
                })
            } else {
                this.reverse_itr((index, p) => {
                    if (index === position) {
                        // const pForward = p.previousPtr
                        // const pNext = p.nextPtr
                        // pForward.nextPtr = pNext
                        // pNext.previousPtr = pForward
                        p.escape()
                        this._length--
                        return -1
                    }
                })
            }
        }
    }
    /**
     * remove a segment of nodes and replace with given elements
     * @param {Number} index - index at which to start changing the list (with origin 0)
     * @param {Number} [deleteCount] - An integer indicating the number of old list elements to remove (with origin 1)
     * @param {any[]} [elems] - the elements to add to the list, beginning at the start index, 
     * if you don't specify any elements, splice() will only remove elements from the array
     * @returns {any[]} an array containing the deleted elements, if no elements are removed, an empty array is returned
     */
    splice(index = 0, deleteCount = 1, ...elems) {
        if (this.empty()) {
            return []
        }
        // check index
        if (typeof (index) !== 'number' || !inRangeLR(index, 0, this.size() - 1)) {
            __warn('[list.splice] unexpected parameter 0, need for number which in range 0 to ' + (this.size() - 1))
            return []
        }
        // check deleteCount
        const maxDelAmount = this.size() - index
        if (typeof (deleteCount) !== 'number' || !inRangeLR(deleteCount, 1, maxDelAmount)) {
            __warn('[list.splice] unexpected parameter 1, need for number which in range 1 to ' + maxDelAmount)
            return []
        }
        let Delnodes = {
            head: null,
            tail: null,
            isApproachEnd: false
        }
        index = ~~index
        deleteCount = ~~deleteCount
        // remove elements
        this.itr((itr_idx, p) => {
            if (itr_idx === index) {
                Delnodes.head = p
            }
            if (itr_idx === index + deleteCount - 1) {
                Delnodes.tail = p
                Delnodes.isApproachEnd = itr_idx === this.size() - 1
                return -1
            }
        })
        // __log(index, deleteCount, Delnodes)
        if (index === 0 && Delnodes.isApproachEnd) {
            const arr = this.toArray()
            // -> remove all
            this.clear()
            // pushing new elements
            for (const dt of elems) {
                this.pushBack(dt)
            }
            return arr
        } else if (index === 0 && !Delnodes.isApproachEnd) {
            const arr = []
            if (Delnodes.head !== Delnodes.tail) {
                let p = Delnodes.head

                while (p !== Delnodes.tail) {
                    arr.push(deepCopy(p._data))
                    try {
                        p.previousPtr.nextPtr = null
                        p.previousPtr = null
                    } catch (error) { }
                    p = p.nextPtr
                }
            }

            arr.push(deepCopy(Delnodes.tail._data))

            Delnodes.tail.nextPtr.previousPtr = null
            this.HeadNode = Delnodes.tail.nextPtr
            this._length = this._length - deleteCount
            // inserting new elements
            elems.reverse()
            for (const dt of elems) {
                this.pushFront(dt)
            }
            return arr
        } else if (index !== 0 && Delnodes.isApproachEnd) {
            const arr = []
            if (Delnodes.head !== Delnodes.tail) {
                let p = Delnodes.tail

                while (p !== Delnodes.head) {
                    arr.push(deepCopy(p._data))
                    try {
                        p.nextPtr.previousPtr = null
                        p.nextPtr = null
                    } catch (error) { }
                    p = p.previousPtr
                }
            }

            arr.push(deepCopy(Delnodes.head._data))

            Delnodes.head.previousPtr.nextPtr = null
            this.TailNode = Delnodes.head.previousPtr
            this._length = this._length - deleteCount
            // inserting new elements
            for (const dt of elems) {
                this.pushBack(dt)
            }
            return arr
        } else {
            const arr = []
            if (Delnodes.head !== Delnodes.tail) {
                let p = Delnodes.head

                while (p !== Delnodes.tail) {
                    arr.push(deepCopy(p._data))
                    try {
                        if (p !== Delnodes.head) {
                            p.previousPtr.nextPtr = null
                            p.previousPtr !== p ? p.previousPtr = null : void (0)
                        }
                    } catch (error) { }
                    p = p.nextPtr
                }
            }
            arr.push(deepCopy(Delnodes.tail._data))

            Delnodes.head.previousPtr.nextPtr = Delnodes.tail.nextPtr
            Delnodes.tail.nextPtr.previousPtr = Delnodes.head.previousPtr
            this._length = this._length - deleteCount
            // inserting new elements
            elems.reverse()
            for (const dt of elems) {
                this.insert(dt, index - 1)
            }
            return arr
        }
    }
    // remove all nodes
    clear() {
        const arrRef = []
        this.itr((index, node) => {
            arrRef.push(node)
        })
        arrRef.forEach(NodeV => NodeV.destory())
        arrRef.splice(0, arrRef.length)
        this._length = 0
        this.HeadNode = null
        this.TailNode = null
        __log('clear over')
    }

    reverse() {
        if (this.size() < 2) {
            return this
        }
        const nodeArr = this.toArray()
        nodeArr.reverse()
        this.splice(0, this.size(), ...nodeArr)
        return this
    }
    // quick sorting, may be unstable
    sort(cmpFunc = defaultMinus) {
        // to long, using array sorting
        if (this.size() > 5000) {
            const arr = this.toArrayRef()
            arr.sort(cmpFunc)
            this.splice(0, this.size(), ...arr)
            return this
        }
        if (Object.prototype.toString.call(cmpFunc) !== '[object Function]') {
            __warn('[list.sort] expected a parameter 0 with a type "function"')
            return
        }
        // define partion and qsort function
        const partion = (pHead, pLow, pHigh) => {
            const pivot = pLow._data
            while (pLow !== pHigh) {
                while (pLow !== pHigh && cmpFunc(pHigh._data, pivot) < 0)
                    pHigh = pHigh.previousPtr
                let temp = pLow._data
                pLow._data = pHigh._data
                pHigh._data = temp
                while (pLow !== pHigh && cmpFunc(pLow._data, pivot) > 0)
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
            __log('[list.sort] empty or to short list')
            return this
        }
        quick_sort(this.HeadNode, this.HeadNode, this.TailNode)
        return this
    }
    // equFunc: callback function, @param node->_data, return the target node data or undefined
    find(equFunc) {
        if (Object.prototype.toString.call(equFunc) !== '[object Function]') {
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
            return undefined
        }
        if (Object.prototype.toString.call(equFunc) !== '[object Function]') {
            return undefined
        }
        pos = ~~pos
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
        if (Object.prototype.toString.call(equFunc) !== '[object Function]') {
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
            return -1
        }
        if (Object.prototype.toString.call(equFunc) !== '[object Function]') {
            return -1
        }
        pos = ~~pos
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
        if (list.isList(anotherListRef)) {
            if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
                __warn('[list.back_concat] bad concat parameter 0')
                return
            }
            anotherListRef = list.clone(anotherListRef)
            this.TailNode.nextPtr = anotherListRef.HeadNode
            anotherListRef.HeadNode.previousPtr = this.TailNode
            this.TailNode = anotherListRef.TailNode
            this._length += anotherListRef._length
            return this
        } else {
            __warn('[list.back_concat] NullPtr concat parameter 0')
            return
        }
    }

    front_concat(anotherListRef) {
        if (list.isList(anotherListRef)) {
            if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
                __warn('[list.front_concat] bad concat parameter 0')
                return
            }
            anotherListRef = list.clone(anotherListRef)
            this.HeadNode.previousPtr = anotherListRef.TailNode
            anotherListRef.TailNode.nextPtr = this.HeadNode
            this.HeadNode = anotherListRef.HeadNode
            this._length += anotherListRef._length
            return this
        } else {
            __warn('[list.front_concat] NullPtr concat parameter 0')
            return
        }
    }

    concat(anotherListRef, position = this.size() - 1) {
        if (list.isList(anotherListRef)) {
            if (anotherListRef === this) {
                __warn('[list.concat] self concating is not allowed, use [front_concat] or [back_concat] to instead')
                return
            }
            if (typeof (position) !== 'number' || Number.isNaN(position) || !inRangeLR(position, 0, this.size() - 1)) {
                __warn('[list.concat] failed with parameter 1 of null/errorRange/errorType')
                return
            }
            position = ~~position
            if (position === 0) {
                return this.front_concat(anotherListRef)
            } else if (position === this.size() - 1) {
                return this.back_concat(anotherListRef)
            } else {
                if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
                    __warn('bad concat target')
                    return
                }
                anotherListRef = list.clone(anotherListRef)
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
                    return this
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
                    return this
                }
            }
        } else {
            __warn('[list.front_concat] NullPtr concat parameter 0')
            return
        }
    }

    swap(anotherListRef) {
        if (list.isList(anotherListRef)) {
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

    consolePrint(needIndex) {
        if (this.empty()) {
            return
        }
        this.itr((idx, node) => {
            needIndex ? console.log('index: ' + idx, node._data) : console.log(node._data)
        })
    }
}

// uncomment next line when in webpack environment
// export default list