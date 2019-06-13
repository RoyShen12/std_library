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

(function (glb) {
    const util = require('./util')

    // I don't like the foolish and bumptious eslint, so
    /* eslint-disable */

    /**
     * - the node structure to composite a list
     * 
     *  <--[previousPtr]-- ( _Node: ( _data ) ) --[nextPtr]-->
     * 
     * @private {any} _data - element of the node
     * @private {_Node} previousPtr - previous node
     * @private {_Node} nextPtr - next node
     */
    class _Node {
        static isNode(objToTest) {
            util.__verbose('[_Node.isNode] Enter')
            return (
                objToTest instanceof _Node &&
                objToTest.hasOwnProperty('_data') &&
                objToTest.hasOwnProperty('previousPtr') &&
                objToTest.hasOwnProperty('nextPtr')
            )
        }
        constructor(elem, frontElem, nextElem) {
            this._data = elem
            this.previousPtr = frontElem
            this.nextPtr = nextElem
            util.__verbose('new _Node created')
        }
        // escape this node, illegal while has no pre or next node
        escape() {
            if (!_Node.isNode(this.previousPtr) || !_Node.isNode(this.nextPtr)) {
                util.__warn('[_Node.escape] bad call, expect previousPtr and nextPtr exists')
                return
            }
            this.previousPtr.nextPtr = this.nextPtr
            this.nextPtr.previousPtr = this.previousPtr
            this.previousPtr = null
            this.nextPtr = null
            util.__verbose('_Node escaped')
            return this._data
        }
        // just like a deconstructor
        destory() {
            this._data = null
            this.previousPtr = null
            this.nextPtr = null
            util.__verbose('_Node destoryed')
        }
    }
    /**
     * - the list container
     * 
     * - list structure is like this:
     * 
     *  ( null )
     *      Î
     *      |
     * [previousPtr]
     *      |
     *  ( HeadNode: (_data) ) --[nextPtr]--> ( *_Node: (_data) ) --[nextPtr]--> ...... --[nextPtr]--> ( TailNode: (_data) ) --[nextPtr]--> ( null )
     *                       <--[previousPtr]--                <--[previousPtr]--    <--[previousPtr]--
     * 
     *                                                         [<-     _length      ->]
     * 
     * - * in List, methods with a prefix 'const', like { const_at },{ const_begin }, has indicated that
     *   these methods will return a copy not the reference of the elements' '_data' property.
     * 
     * @private {_Node} HeadNode - first node | null
     * @private {_Node} TailNode - last node | null
     * @private {Number} _length - size of list 
     */
    class list {
        // static method

        // List.isList  just like Array.isArray
        static isList(objToTest) {
            util.__verbose('[list.islist] Enter')
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
                util.__warn('[list.fromArray] unexpected parameter 0 token, expected Array type')
                return undefined
            }
            util.__verbose('[list.fromArray] Enter')
            return new list(sourceArray)
        }
        // clone list
        static clone(listR) {
            util.__verbose('[list.clone] Enter')
            return new list(listR)
        }

        /**
         *  iterator from a given node
         */
        static itr_from(node, callback) {
            if (!_Node.isNode(node)) return
            let p = node
            let index = 0
            do {
                if (callback(index++, p) == -1) break
                p = p.nextPtr
            } while (p.nextPtr)
            return -1
        }

        constructor(elem) {
            if (util.isNullPtr(elem)) { // empty constructor
                util.__verbose('empty constructor')
                this.HeadNode = null
                this.TailNode = null
                this._length = 0
            } else {
                if (list.isList(elem)) { // copy constructor
                    util.__verbose('copy constructor')
                    this.HeadNode = null
                    this.TailNode = null
                    this._length = 0
                    elem.itr((index, node) => {
                        this.pushBack(util.recursiveDeepCopy(node._data))
                    })
                } else if (Array.isArray(elem)) { // copy from array constructor
                    util.__verbose('array copy constructor')
                    this.HeadNode = null
                    this.TailNode = null
                    this._length = 0
                    for (let e of elem) {
                        this.pushBack(e)
                    }
                } else { // single element pushing constructor
                    util.__verbose('default constructor')
                    const node = new _Node(elem, null, null)
                    this.HeadNode = node
                    this.TailNode = node
                    this._length = 1
                }
            }

            //this[Symbol.isConcatSpreadable] = true


            // after each constructor function,
            // make a Proxy to intercept list's default [get],
            // just to make list has the behavior like Array:
            // const a = [1]; a[0] = 1; const b = new list(1); b[0] = 1
            return new Proxy(this, {
                get: function (target, key, recv) {
                    // key is of numbers
                    if (typeof key !== 'symbol' && !isNaN(key)) {
                        return target.at(Math.round(key))
                    } else {
                        return Reflect.get(target, key, recv)
                    }
                }
            })
        }
        // get element reference by index
        at(rInd) {
            const __size = this.size()
            if (typeof (rInd) !== 'number' || !util.inRangeLR(rInd, 0, __size - 1)) {
                util.__warn('[list.at] bad parameter 0 given: ', rInd)
                throw new RangeError('bad parameter 0 given: ' + rInd)
            }
            let res = undefined
            rInd = Math.round(rInd)
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
            util.__verbose('[list.at] at ', rInd)
            return res
        }
        // get node reference by index
        node_at(rInd) {
            const __size = this.size()
            if (typeof (rInd) !== 'number' || !util.inRangeLR(rInd, 0, __size - 1)) {
                util.__warn('[list.node_at] bad parameter 0 given: ', rInd)
                throw new RangeError('bad parameter 0 given')
            }
            let res = undefined
            rInd = Math.round(rInd)
            if (rInd < __size / 2) {
                this.itr((index, node) => {
                    if (index === rInd) {
                        res = node
                        return -1
                    }
                })
            } else {
                this.reverse_itr((index, node) => {
                    if (index === rInd) {
                        res = node
                        return -1
                    }
                })
            }
            util.__verbose('[list.node_at] at ', rInd)
            return res
        }
        // get element copy by index
        const_at(rInd) {
            const __size = this.size()
            if (typeof (rInd) !== 'number' || !util.inRangeLR(rInd, 0, __size - 1)) {
                util.__warn('[list.const_at] bad parameter 0 given: ', rInd)
                throw new RangeError('bad parameter 0 given')
            }
            let res = undefined
            rInd = Math.round(rInd)
            if (rInd < __size / 2) {
                this.itr((index, node) => {
                    if (index === rInd) {
                        res = util.recursiveDeepCopy(node._data)
                        return -1
                    }
                })
            } else {
                this.reverse_itr((index, node) => {
                    if (index === rInd) {
                        res = util.recursiveDeepCopy(node._data)
                        return -1
                    }
                })
            }
            util.__verbose('[list.const_at] at ', rInd)
            return res
        }

        // fill list with giving element from start index to end index
        // alternative option { couldExeed } can 
        // return this
        fill(elem, start = 0, end = this.size() - 1, couldExeed = false) {
            // check elem
            if (util.isNullPtr(elem)) {
                util.__warn('[list.fill] cannot fill with the given parameter 0 as NullPtr')
                throw new TypeError('cannot fill with the given parameter 0 as NullPtr')
            }
            // check start end
            if (typeof start !== 'number' || start < 0 || (!this.empty() && start > this.size() - 1) || (this.empty() && start !== 0)) {
                util.__warn('[list.fill] cannot fill with bad parameter 1 : not a number or range error')
                throw new RangeError('cannot fill with bad parameter 1 : not a number or range error')
            }
            if (typeof end !== 'number' || end < 0 || end < start) {
                util.__warn('[list.fill] cannot fill with bad parameter 2 : not a number or range error')
                throw new RangeError('cannot fill with bad parameter 2 : not a number or range error')
            }
            if (this.empty()) {
                if (couldExeed) {
                    util.__log('[list.fill] exeed.')
                    for (let i_ = 0; i_ < end; i_++) {
                        this.pushBack(elem)
                    }
                    return this
                } else {
                    util.__warn('[list.fill] can only fill an empty list with parameter 3 as true')
                    throw TypeError('can only fill an empty list when parameter 3 {couldExeed} is true')
                }
            }
            this.itr((index, node) => {
                if (util.inRangeLR(index, start, end))
                    node._data = elem
            })
            // pushing to tail
            if (end > this.size() - 1 && couldExeed) {
                util.__log('[fill:couldExeed], adding count: ', end - (this.size() - 1))
                for (let _idx = 0; _idx < end - (this.size() - 1); _idx++) {
                    this.pushBack(elem)
                }
            }
            couldExeed ? util.__log('after fill _length is ', this._length) : void (0)
            return this
        }

        toArray() {
            util.__verbose('[list.toArray] Enter')
            const ret = []
            this.itr((index, node) => {
                ret.push(util.recursiveDeepCopy(node._data))
            })
            return ret
        }

        toArrayRef() {
            util.__verbose('[list.toArrayRef] Enter')
            const ret = []
            this.itr((index, node) => {
                ret.push(node._data)
            })
            return ret
        }

        pushFront(elem) {
            if (util.isNullPtr(elem)) {
                util.__warn('[list.pushFront] cannot push parameter 0 which is null or undefined')
                throw new TypeError('cannot push parameter 0 which is null or undefined')
            }
            const node = new _Node(elem, null, this.HeadNode)
            if (this.HeadNode) {
                this.HeadNode.previousPtr = node
            }
            this.HeadNode = node
            // if this is an empty list
            if (!this.TailNode) {
                this.TailNode = node
            }
            this._length++
            util.__log('push front: a new node: ')
            return this
        }

        pushBack(elem) {
            if (util.isNullPtr(elem)) {
                util.__warn('[list.pushBack] cannot push parameter 0 which is null or undefined')
                throw new TypeError('cannot push parameter 0 which is null or undefined')
            }
            const node = new _Node(elem, this.TailNode, null)
            if (this.TailNode) {
                this.TailNode.nextPtr = node
            }
            this.TailNode = node
            // if this is empty
            if (!this.HeadNode) {
                this.HeadNode = node
            }
            this._length++
            util.__log('push back: a new node:')
            return this
        }

        // insert elem after index { position }, range is [0, length - 1]
        insert(elem, position) {
            util.__verbose('[list.insert] Enter')
            if (typeof (position) !== 'number' || !util.inRangeLR(position, 0, this.size() - 1) || util.isNullPtr(elem)) {
                util.__warn('[list.insert] failed with parameter 0 NullPtr or parameter 1 missing/range error')
                throw new TypeError('failed with parameter 0 NullPtr or parameter 1 missing/range error')
            }
            position = Math.round(position)
            if (position === 0) {
                const node = new _Node(elem, this.HeadNode, this.HeadNode.nextPtr)
                this.HeadNode.nextPtr.previousPtr = node
                this.HeadNode.nextPtr = node
                this._length++
            } else if (position == this.size() - 1) {
                this.pushBack(elem)
            } else {
                if (position < this.size() / 2) {
                    this.itr((index, p) => {
                        if (index === position) {
                            const pNext = p.nextPtr
                            const node = new _Node(elem, p, pNext)
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
                            const node = new _Node(elem, p, pNext)
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
            util.__verbose('[list.popFront] Enter')
            let ans = this.HeadNode ? this.HeadNode._data : null
            if (this.HeadNode === this.TailNode && !util.isNullPtr(this.HeadNode)) {
                this.HeadNode = this.TailNode = null
                this._length--
            } else if (this.HeadNode) {
                this.HeadNode.nextPtr.previousPtr = null
                this.HeadNode = this.HeadNode.nextPtr
                this._length--
            }
            return ans
        }

        popBack() {
            util.__verbose('[list.popBack] Enter')
            let ans = this.TailNode ? this.TailNode._data : null
            if (this.HeadNode === this.TailNode && !util.isNullPtr(this.HeadNode)) {
                this.HeadNode = this.TailNode = null
                this._length--
            } else if (this.TailNode) {
                this.TailNode.previousPtr.nextPtr = null
                this.TailNode = this.TailNode.previousPtr
                this._length--
            }
            return ans
        }

        get begin() {
            util.__verbose('[list.begin(getter)] Enter')
            return this.HeadNode ? this.HeadNode._data : undefined
        }

        get end() {
            util.__verbose('[list.end(getter)] Enter')
            return this.TailNode ? this.TailNode._data : undefined
        }

        get const_begin() {
            util.__verbose('[list.const_begin(getter)] Enter')
            return this.HeadNode ? util.recursiveDeepCopy(this.HeadNode._data) : undefined
        }

        get const_end() {
            util.__verbose('[list.const_end(getter)] Enter')
            return this.TailNode ? util.recursiveDeepCopy(this.TailNode._data) : undefined
        }
        // creates a slice of list with n elements dropped from the beginning
        drop(n = 1) {
            util.__verbose('[list.drop] Enter')
            if (n < 1) {
                return new list()
            }
            n > this.size() ? n = this.size() : void (0)
            n = Math.round(n)
            const lp = list.clone(this)
            lp.splice(0, n)
            return lp
        }
        // creates a slice of list with n elements dropped from the end
        dropRight(n = 1) {
            util.__verbose('[list.dropRight] Enter')
            if (n < 1) {
                return new list()
            }
            n > this.size() ? n = this.size() : void (0)
            n = Math.round(n)
            const lp = list.clone(this)
            lp.reverse().splice(0, n)
            return lp.reverse()
        }
        /**
         * forward iterator
         * @param {handler} callback - callback function to handle the index and node while iterating, return -1 to break the iterator loop
         */
        itr(callback) {
            if (Object.prototype.toString.call(callback) !== '[object Function]') {
                util.__warn('[list.itr] parameter 0 need to be with a type "function"')
                throw new TypeError('parameter 0 need to be with a type "function"')
            }
            if (this.empty()) {
                util.__log('[list.itr] returned with empty list')
                return
            }
            let p = null
            let index = -1
            do {
                !p ? p = this.HeadNode : p = p.nextPtr
                if (callback(++index, p) == -1) break
            } while (p.nextPtr)
        }
        /**
         * reverse iterator
         * @param {Function} callback - callback function to handle the index and node while iterating, return -1 to break the iterator loop
         */
        reverse_itr(callback) {
            if (Object.prototype.toString.call(callback) !== '[object Function]') {
                util.__warn('[list.reverse_itr] parameter 0 need to be with a type "function"')
                throw new TypeError('parameter 0 need to be with a type "function"')
            }
            if (this.empty()) {
                util.__log('[list.reverse_itr] returned with empty list')
                return
            }
            let p = null
            let index = this.size()
            do {
                !p ? p = this.TailNode : p = p.previousPtr
                if (callback(--index, p) == -1) break
            } while (p.previousPtr)
        }
        // specifies the default iterator for list
        // make list able to called by for...of
        // the returns value is const node->_data
        [Symbol.iterator]() {
            if (this.empty()) {
                return {
                    next() {
                        return {
                            done: true
                        }
                    }
                }
            } else {
                const thisH = this.HeadNode
                let p = null
                return {
                    next() {
                        p ? p = p.nextPtr : p = thisH
                        return {
                            value: p ? p._data : undefined,
                            done: !!p
                        }
                    }
                }
            }
        }

        get length() {
            util.__verbose('[list.length(getter)] Enter')
            return this.size()
        }
        // array of data reference
        get data() {
            util.__verbose('[list.data(getter)] Enter')
            let data = []
            this.itr((index, node) => {
                data.push(node._data)
            })
            return data
        }
        // array of reversed data reference
        get reverse_data() {
            util.__verbose('[list.reverse_data(getter)] Enter')
            let data = []
            this.reverse_itr((index, node) => {
                data.push(node._data)
            })
            return data
        }
        // array of data copy
        get const_data() {
            util.__verbose('[list.const_data(getter)] Enter')
            let data = []
            this.itr((index, node) => {
                data.push(util.recursiveDeepCopy(node._data))
            })
            return data
        }
        // array of reversed data copy
        get const_reverse_data() {
            util.__verbose('[list.const_reverse_data(getter)] Enter')
            let data = []
            this.reverse_itr((index, node) => {
                data.push(util.recursiveDeepCopy(node._data))
            })
            return data
        }

        /**
         *  - do callback(elem) for every node->_data
         *  - for example x.forEach( x => x = x**2 )
         */
        forEach(callback, start = 0, end = this.size() - 1) {
            if (Object.prototype.toString.call(callback) !== '[object Function]') {
                util.__warn('[list.forEach] expected a parameter 0 with a type "function"')
                throw new TypeError('expected a parameter 0 with a type "function"')
            }
            if (!this.empty()) {
                this.itr((index, node) => {
                    if (util.inRangeLR(index, start, end))
                        callback(node._data, index, this)
                })
            }
        }
        /**
         *  - do callback(elem) for every two node->_data
         *    for example x.forEach( (x1, x2) => console.log((x1 + x2) * (x1 - x2)) )
         *  - (loop count: callback param): (1: [this.at(0), this.at(1), 0, 1, this]), (2: [this.at(1), this.at(2), 1, 2, this]), ...,
         *    (this.size() - 1: [this.at(this.size() - 2), this.at(this.size() - 1), this.size() - 2, this.size() - 1, this])
         */
        forEachTween(callback, start = 0, end = this.size() - 1) {
            if (this.size() < 2) {
                util.__verbose('[list.forEachTween] exit with no enough elements')
                return
            }
            if (Object.prototype.toString.call(callback) !== '[object Function]') {
                util.__warn('[list.forEachTween] expected a parameter 0 with a type "function"')
                throw new TypeError('expected a parameter 0 with a type "function"')
            }
            this.itr((index, node) => {
                if (index === this.size() - 1) return -1
                if (util.inRangeLR(index, start, end))
                    callback(node._data, node.nextPtr._data, index, index + 1, this)
            })
        }
        // The every method tests every element of this list
        // only returns true while all elements pass through the callback function
        every(callback) {
            if (Object.prototype.toString.call(callback) !== '[object Function]') {
                util.__warn('[list.every] expected a parameter 0 with a type "function"')
                throw new TypeError('expected a parameter 0 with a type "function"')
            }
            if (this.empty()) {
                util.__log('[list.every] returned true but only because of empty list')
                return true
            }
            let ans = true
            this.itr((index, node) => {
                ans = ans && callback(node._data, index, this)
                return ans ? 0 : -1
            })
            return ans
        }
        // The some method tests every element of this list
        // returns true while at least one element pass through the callback function
        some(callback) {
            if (Object.prototype.toString.call(callback) !== '[object Function]') {
                util.__warn('[list.some] expected a parameter 0 with a type "function"')
                throw new TypeError('expected a parameter 0 with a type "function"')
            }
            if (this.empty()) {
                util.__log('[list.some] returned true but only because of empty list')
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
                util.__warn('[list.map] expected a parameter 0 with a type "function"')
                throw new TypeError('expected a parameter 0 with a type "function"')
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
                util.__warn('[list.filter] expected a parameter 0 with a type "function"')
                throw new TypeError('expected a parameter 0 with a type "function"')
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
        // The compact methods creates a list with all falsey values removed
        // The values false, null, 0, "", undefined, and NaN are falsey
        compact() {
            return list.clone(this).filter(data => !(data === false || util.isNullPtr(data) || data === '' || Number.isNaN(data) || data === 0))
        }
        // Creates a duplicate-free version of a list
        // in which only the first occurrence of each element is kept
        // The order of result values is determined by the order they occur in the list
        uniq() {
            const dataSet = new Set()
            this.itr((idx, node) => {
                dataSet.add(node._data)
            })
            this.clear()
            dataSet.forEach(v => this.pushBack(v))
            return this
        }
        // return(calculate) the size of calling list
        size() {
            let counter
            if (util.__debug > 2) {
                let node = this.HeadNode
                if (node === null) {
                    return 0
                }
                counter = 1
                while (node.nextPtr !== null) {
                    counter++
                    node = node.nextPtr
                }
                util.__verbose('debug size: (calculated : _length)->' + counter + ' : ' + this._length)
                counter !== this._length ? util.__error('size() debug error ocurred: counter !== this._length !') : void (0)
            } else {
                counter = this._length
            }
            return counter
        }

        empty() {
            return this.size() === 0
        }
        // remove a node by specifying it's index
        remove(position) {
            if (this.empty()) {
                util.__verbose('[list.remove] on a empty list')
                return this
            }
            if (typeof (position) !== 'number' || Number.isNaN(position)) {
                util.__warn('[list.remove] failed with parameter 0 of NullPtr/errorType/NaN')
                throw new TypeError('failed with parameter 0 of NullPtr/errorType/NaN')
            }
            position = Math.round(position)
            if (position < 0 || position >= this.size()) {
                util.__warn('[list.remove] position range exceed')
                throw new RangeError('position range exceed')
            }
            if (position === 0) {
                if (this.size() === 1) {
                    this.HeadNode = null
                    this.TailNode = null
                    this._length--
                    return this
                } else {
                    this.HeadNode.nextPtr.previousPtr = null
                    this.HeadNode = this.HeadNode.nextPtr
                    this._length--
                    return this
                }
            } else if (position === this.size() - 1) {
                this.TailNode.previousPtr.nextPtr = null
                this.TailNode = this.TailNode.previousPtr
                this._length--
                return this
            } else {
                if (position < this.size() / 2) {
                    this.itr((index, p) => {
                        if (index === position) {
                            p.escape()
                            this._length--
                            return -1
                        }
                    })
                    return this
                } else {
                    this.reverse_itr((index, p) => {
                        if (index === position) {
                            p.escape()
                            this._length--
                            return -1
                        }
                    })
                    return this
                }
            }
        }
        sub_list(startIndex = 0, subListLength) {
            if (this.empty()) {
                return new list()
            }
            if (typeof startIndex !== 'number' || isNaN(startIndex) || !util.inRangeLR(startIndex, 0, this.size() - 1)) {
                util.__warn('[list.sub_list] unexpected parameter 0, need for number which in range of 0 to ' + (this.size() - 1))
                return new list()
            }
            startIndex = Math.round(startIndex)
            if (typeof subListLength !== 'number' || isNaN(subListLength) || !util.inRangeLR(subListLength, 1, this.size() - startIndex)) {
                util.__warn('[list.sub_list] unexpected parameter 1, need for number which in range of 1 to ' + (this.size() - startIndex))
                return new list()
            }
            subListLength = Math.round(subListLength)
            const res = new list()
            if (startIndex < this.size() / 2) {
                this.itr((index, node) => {
                    if (util.inRangeL(index, startIndex, startIndex + subListLength)) res.pushBack(node._data)
                    if (index >= startIndex + subListLength) return -1
                })
                return res
            } else {
                this.reverse_itr((index, node) => {
                    if (index === startIndex) {
                        return list.itr_from(node, (index_clockwise, node_clockwise) => {
                            res.pushBack(node_clockwise._data)
                            if (index_clockwise + 1 >= subListLength) return -1
                        })
                    }
                })
                return res
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
            if (typeof (index) !== 'number' || !util.inRangeLR(index, 0, this.size() - 1)) {
                util.__warn('[list.splice] unexpected parameter 0, need for number which in range 0 to ' + (this.size() - 1))
                return []
            }
            // check deleteCount
            const maxDelAmount = this.size() - index
            if (typeof (deleteCount) !== 'number' || !util.inRangeLR(deleteCount, 1, maxDelAmount)) {
                util.__warn('[list.splice] unexpected parameter 1, need for number which in range 1 to ' + maxDelAmount)
                return []
            }
            let Delnodes = {
                head: null,
                tail: null,
                isApproachEnd: false
            }
            index = parseInt(index)
            deleteCount = parseInt(deleteCount)
            // remove elements

            if (index < this.size() / 2) {
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
            } else {
                this.reverse_itr((itr_idx, p) => {
                    if (itr_idx === index + deleteCount - 1) {
                        Delnodes.tail = p
                        Delnodes.isApproachEnd = itr_idx === this.size() - 1
                    }
                    if (itr_idx === index) {
                        Delnodes.head = p
                        return -1
                    }
                })
            }

            util.__verbose(index, deleteCount, Delnodes)

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
                        arr.push(util.recursiveDeepCopy(p._data))
                        try {
                            p.previousPtr.nextPtr = null
                            p.previousPtr = null
                        } catch (error) { }
                        p = p.nextPtr
                    }
                }

                arr.push(util.recursiveDeepCopy(Delnodes.tail._data))

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
                        arr.push(util.recursiveDeepCopy(p._data))
                        try {
                            p.nextPtr.previousPtr = null
                            p.nextPtr = null
                        } catch (error) { }
                        p = p.previousPtr
                    }
                }

                arr.push(util.recursiveDeepCopy(Delnodes.head._data))

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
                        arr.push(util.recursiveDeepCopy(p._data))
                        try {
                            if (p !== Delnodes.head) {
                                p.previousPtr.nextPtr = null
                                p.previousPtr !== p ? p.previousPtr = null : void (0)
                            }
                        } catch (error) { }
                        p = p.nextPtr
                    }
                }
                arr.push(util.recursiveDeepCopy(Delnodes.tail._data))

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
            util.__log('clear over')
            return this
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
        sort(cmpFunc = util.defaultMinus) {
            if (this.some(D => typeof D === 'object') && cmpFunc === util.defaultMinus) {
                util.__warn('[list.sort] list has some object elements, which requires a specified compare function')
                throw new TypeError('list has some object elements, which requires a specified compare function')
            }
            if (util.isNullPtr(this.HeadNode) || this.size() < 2) {
                util.__verbose('[list.sort] empty or too short list')
                return this
            }
            if (Object.prototype.toString.call(cmpFunc) !== '[object Function]') {
                util.__warn('[list.sort] expected a parameter 0 with a type "function"')
                throw new TypeError('expected a parameter 0 with a type "function"')
            }
            // define partion method of qsort
            function partion(pLow, pHigh) {
                const pivot = pLow._data
                while (pLow !== pHigh) {
                    while (pLow !== pHigh && cmpFunc(pHigh._data, pivot) >= 0) pHigh = pHigh.previousPtr
                    pLow._data = pHigh._data
                    while (pLow !== pHigh && cmpFunc(pLow._data, pivot) <= 0) pLow = pLow.nextPtr
                    pHigh._data = pLow._data
                }
                pLow._data = pivot
                return pLow
            }
            function quick_sort(pl, ph) {
                function quick_sort_inner(pstLow, pstHigh) {
                    let pstTmp = partion(pstLow, pstHigh)
                    return function () {
                        if (pstTmp !== pstLow && pstTmp !== pstHigh) {
                            return [quick_sort_inner(pstLow, pstTmp.previousPtr), quick_sort_inner(pstTmp.nextPtr, pstHigh)]
                        } else if (pstTmp !== pstLow) {
                            return [quick_sort_inner(pstLow, pstTmp.previousPtr)]
                        } else if (pstTmp !== pstHigh) {
                            return [quick_sort_inner(pstTmp.nextPtr, pstHigh)]
                        } else {
                            return
                        }
                    }
                }
                function loopAtValue(value) {
                    const acp = []
                    value = value.map(V => {
                        const tmp = typeof V === 'function' ? V() : undefined
                        if (Array.isArray(tmp)) {
                            acp.push(tmp[1])
                            return tmp[0]
                        } else if (!tmp) {
                            return
                        } else {
                            return tmp
                        }
                    })
                    return value.concat(acp)
                }
                function trampoline(func, arg) {
                    // util.__log('trampoline param: ', func, arg)
                    let value = func.apply(func, arg)()
                    // util.__log('trampoline func.apply(func, arg)->', value)
                    if (Array.isArray(value)) {
                        // util.__verbose('trampoline value is array: ', value)
                        loopAtValue(value)
                        while (value.some(V => typeof V === 'function')) {
                            value = loopAtValue(value)
                        }
                    }
                    return value
                }
                return trampoline.bind(null, quick_sort_inner)([pl, ph])
            }

            quick_sort(this.HeadNode, this.TailNode)
            return this
        }
        indexOf(tElem) {
            if (this.empty()) {
                return -1
            }
            let res = -1
            this.itr((index, node) => {
                if (tElem === node._data) {
                    res = index
                    return -1
                }
            })
            return res
        }
        // equFunc: callback function, @param node->_data, return the target node data or undefined
        find(equFunc) {
            if (Object.prototype.toString.call(equFunc) !== '[object Function]') {
                return undefined
            }
            if (this.empty()) {
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
            if (typeof (pos) !== 'number' || !util.inRangeLR(pos, 0, this.size())) {
                return undefined
            }
            if (Object.prototype.toString.call(equFunc) !== '[object Function]') {
                return undefined
            }
            pos = Math.round(pos)
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
            if (this.empty()) {
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
            if (typeof (pos) !== 'number' || !util.inRangeLR(pos, 0, this.size())) {
                return -1
            }
            if (Object.prototype.toString.call(equFunc) !== '[object Function]') {
                return -1
            }
            pos = Math.round(pos)
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
                    util.__warn('[list.back_concat] bad concat parameter 0')
                    return this
                }
                anotherListRef = list.clone(anotherListRef)
                if (this.TailNode) {
                    this.TailNode.nextPtr = anotherListRef.HeadNode
                    anotherListRef.HeadNode.previousPtr = this.TailNode
                } else {
                    this.HeadNode = anotherListRef.HeadNode
                }
                this.TailNode = anotherListRef.TailNode
                this._length += anotherListRef._length
                return this
            } else if (Array.isArray(anotherListRef) && anotherListRef.length > 0) {
                return this.back_concat(list.fromArray(anotherListRef))
            } else {
                util.__warn('[list.back_concat] bad concat parameter 0, expected list or Array')
                return
            }
        }

        front_concat(anotherListRef) {
            if (list.isList(anotherListRef)) {
                if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
                    util.__warn('[list.front_concat] bad concat parameter 0')
                    return this
                }
                anotherListRef = list.clone(anotherListRef)
                if (this.HeadNode) {
                    this.HeadNode.previousPtr = anotherListRef.TailNode
                    anotherListRef.TailNode.nextPtr = this.HeadNode
                } else {
                    this.TailNode = anotherListRef.TailNode
                }
                this.HeadNode = anotherListRef.HeadNode
                this._length += anotherListRef._length
                return this
            } else if (Array.isArray(anotherListRef) && anotherListRef.length > 0) {
                return this.front_concat(list.fromArray(anotherListRef))
            } else {
                util.__warn('[list.front_concat] bad concat parameter 0, expected list or Array')
                return
            }
        }

        // position: [-1, length-1], concat after position
        concat(anotherListRef, position = this.size() - 1) {
            if (list.isList(anotherListRef)) {
                if (anotherListRef === this) {
                    util.__warn('[list.concat] intend to self concating which is not allowed, use [front_concat] or [back_concat] to instead')
                    return
                }
                if (this.empty()) {
                    util.__log('[list.concat], concat target on the empty this list')
                    anotherListRef = list.clone(anotherListRef)
                    this.HeadNode = anotherListRef.HeadNode
                    this.TailNode = anotherListRef.TailNode
                    this._length = anotherListRef._length
                    return this
                }
                if (typeof (position) !== 'number' || Number.isNaN(position) || !util.inRangeLR(position, -1, this.size() - 1)) {
                    util.__warn('[list.concat] failed with parameter 1 of null/errorRange/errorType')
                    return
                }
                position = Math.round(position)
                if (position === -1) {
                    return this.front_concat(anotherListRef)
                } else if (position === this.size() - 1) {
                    return this.back_concat(anotherListRef)
                } else {
                    if (anotherListRef._length === 0 || anotherListRef.HeadNode === null || anotherListRef.TailNode === null) {
                        util.__warn('bad concat target')
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
            } else if (Array.isArray(anotherListRef) && anotherListRef.length > 0) {
                return this.concat(list.fromArray(anotherListRef), position)
            } else {
                util.__warn('[list.front_concat] bad concat parameter 0, expected list or Array')
                return
            }
        }

        swap(anotherListRef) {
            if (list.isList(anotherListRef)) {
                if (anotherListRef === this) {
                    util.__warn('[list.swap] intend to self swaping which is not allowed')
                    return
                }
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

        toJson() {
            return JSON.stringify(this.toArray())
        }

        toString() {
            return this.toArray().toString()
        }

        consolePrint(needIndex) {
            if (this.empty()) {
                return
            }
            const maxL = this.size() + ''.length + 1
            this.itr((idx, node) => {
                needIndex ? console.log(('index: ' + idx).padEnd(maxL), node._data) : console.log(node._data)
            })
        }

        consolePrintAsTable() {
            this.itr((idx, node) => {
                console.table(node)
            })
        }
    }

    if (typeof define == 'function') {
        define(function () { return list })
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = list
    }

    glb.list ? void (0) : glb.list = list

    return list

}(typeof window == 'undefined' ? global : window))
