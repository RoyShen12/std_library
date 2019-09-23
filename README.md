# Get started

## Install

```bash
$ npm install std_library
```

# Introduce

std_library is a JavaScript container library  

completed component: list (Doubly Linked List)

# Basic usage

```js
const { list } = require('std_library')

const list0 = new list()
const list1 = new list([1])
const list2 = new list(list2) // copy
const list3 = list.fromArray(['a', 'b', 'c', 'd', 'e'])

list3.pushBack('1')
list3.pushFront('2')
list3.popFront()
```

# run test

```bash
$ npm i -g istanbul
$ npm run test
```
