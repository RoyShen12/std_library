# Get started

## Install

```bash
$ npm install --save std_library
```

# Introduce

std_library is a JavaScript container library.  

completed component: list (Doubly Linked List).  

component on the way: queue, stack, tree, binary tree, quadtree.

# Basic usage

## <inner>_Node

the basic element of each container is the inner class `_Node`.

```ts
class _Node<T> {
  constructor: (e: T, front: _Node, next: _Node) => this

  public _data: T = null
  public previousPtr: _Node
  public nextPtr: _Node
}
```

## list

```ts
const { list } = require('std_library')

new list()                                       // empty list
const _list = new list([1])                      // copy from Array
list.clone(_list)                                // clone
new list(_list)                                  // copy
list.fromArray(['a', 'b', 'c', 'd', 'e'])        // copy from Array

// push
_list.pushBack('1')
_list.pushFront('2')

// pop
_list.popFront() // '2'
_list.popBack()  // '1'

// fill   list.fill(elem: any, start?: number, end?: number, couldExeed?: boolean): this
_list.fill({ value: 666 }, 0, 100, true)

// visit
_list.at(33)          // visit by reference
_list.const_at(33)    // visit by copy
_list.node_at(33)     // visit raw _Node
_list[33]             // visit as Array, returns reference

// getter
list<T>.begin: T
list<T>.end: T
list<T>.const_begin: T
list<T>.const_end: T

list.length: number // alias of list.size(): number

list<T>.data: T[]
list<T>.reverse_data: T[]
list<T>.const_data: T[]
list<T>.const_reverse_data: T[]

// loop methods
list<T>.itr(callback: (index: number, p: _Node<T>) => number): void
list<T>.reverse_itr(callback: (index: number, p: _Node<T>) => number): void

for (const v of list<T>) {
  // v: T
}

list<T>.forEach(callback: (itemData: T, index: number, thisList: list<T>) => void, start?: number, end?: number): void
list<T>.forEachTween(callback: (itemDataFirst: T, itemDataSecond: T, indexFirst: number, indexSecond: number, thisList: list<T>) => void, start?: number, end?: number): void

// checking & finding methods
list<T>.indexOf(tElem: T): number
list<T>.find(equFunc: (item: T) => boolean): T
list<T>.findIndex(equFunc: (item: T) => boolean): number
list<T>.findFrom(pos: number, equFunc: (item: T) => boolean): T
list<T>.findIndexFrom(pos: number, equFunc: (item: T) => boolean): number

list.every<T>(callback: (itemData: T, index: number, thisList: list) => boolean): boolean
list.some<T>(callback: (itemData: T, index: number, thisList: list) => boolean): boolean
list.includes<T>(searchElement: T, fromIndex?: number): boolean

// methods creates a new list
list.map<T>(callback: (itemData: T, index: number, thisList: list) => any): list<any>
list.filter<T>(callback: (itemData: T, index: number, thisList: list) => boolean): list<T>
list.sub_list(startIndex: number, subListLength: number): list

// other manipulating methods
list<T>.sort(cmpFunc?: (a: T, b: T) => number): this

list<T>.insert(elem: T, position: number): this

list.drop(n?: number): list
list.dropRight(n?: number): list

list<T>.splice(index?: number, deleteCount?: number, ...elems?: T[]): T[]

list.remove(position: number): this
list.clear(): this
list.reverse(): this

// other const methods
list.empty(): boolean

// operation with other list
list.back_concat(anotherListRef: list): this
list.front_concat(anotherListRef: list): this
list.concat(anotherListRef: list, position?: number): this
list.swap(anotherListRef: list): void

```

# run test

```bash
$ npm i
$ npm run test
```
