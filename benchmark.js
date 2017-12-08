//// init
var left = new Array()
var right = new list()
var any = [-1, 0, 1, 141.215, 0.000151, {}, {
    a: 1,
    b: 2
},
[1, 2, 4], [], '1314', ''
]
///////////////////////////////////////////////////////////////////////////
//// list
console.time('list-pushBack-random-number')
for (let i = 0; i < 100000; i++) {
    right.pushBack(Math.random())
}
console.timeEnd('list-pushBack-random-number')
//// array
console.time('array-pushBack-random-number')
for (let i = 0; i < 100000; i++) {
    left.push(Math.random())
}
console.timeEnd('array-pushBack-random-number')
///////////////////////////////////////////////////////////////////////////
//// list
console.time('list-pushBack-random-string')
for (let i = 0; i < 100000; i++) {
    right.pushBack(10000 * Math.random() + '' + 10000 * Math.random())
}
console.timeEnd('list-pushBack-random-string')
//// array
console.time('array-pushBack-random-string')
for (let i = 0; i < 100000; i++) {
    left.push(10000 * Math.random() + '' + 10000 * Math.random())
}
console.timeEnd('array-pushBack-random-string')
///////////////////////////////////////////////////////////////////////////
//// list
console.time('list-pushBack-random-any')
for (let i = 0; i < 100000; i++) {
    right.pushBack(any[i % 11])
}
console.timeEnd('list-pushBack-random-any')
//for...of
console.time('list<any>-for...of')
for (let c of right) {

}
console.timeEnd('list<any>-for...of')
//// array
console.time('array-pushBack-random-any')
for (let i = 0; i < 100000; i++) {
    left.push(any[i % 11])
}
console.timeEnd('array-pushBack-random-any')
//for...of
console.time('array<any>-for...of')
for (let c of left) {

}
console.timeEnd('array<any>-for...of')
///////////////////////////////////////////////////////////////////////////
