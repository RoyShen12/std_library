const Benchmark = require('benchmark')

const util = require('../src/inner/_util')
const list = require('../src/list')
const _ = require('lodash')
const gro = require('random-object').randomObject

const glo = () => ({
  a: Math.random(),
  b: '' + Math.random(),
  c: { k: Math.random(), v: 2 * Math.random() },
  d: [Math.random() * 10, '' + Math.random(), { k: Math.random(), v: -1 * Math.random() }, undefined]
})
const $strFX = bits => {
  let ret = ''
  for (let index = 0; index < bits; index++) {
    ret += ((Math.random() * 16 | 0) & 0xf).toString(16)
  }
  return ret
}
const $seirNA = n => {
  const p = []
  for (let i = 0; i < n; i++)
    p.push(i)
  return p
}
const indexedRepeat = (n, func, ...args) => {
  for (let i = 0; i < n; i++) {
    func(i, ...args)
  }
}
const RDM = (lower, upper) => Math.floor(lower + Math.floor(Math.random() * (upper - lower + 1)))
const insertSeperator = ' --------------------------------------- '

// new Benchmark.Suite()
//   .add('recursiveDeepCopy light', () => {
//     util.recursiveDeepCopy(glo())
//   })
//   .add('_.cloneDeep light', () => {
//     _.cloneDeep(glo())
//   })
//   .on('cycle', function (event) {
//     console.log(String(event.target))
//   })
//   .run({ 'async': false })
console.log('\n' + insertSeperator + '\n')
// new Benchmark.Suite()
//   .add('recursiveDeepCopy heavy', () => {
//     util.recursiveDeepCopy(gro(50, 50))
//   })
//   .add('_.cloneDeep heavy', () => {
//     _.cloneDeep(gro(50, 50))
//   })
//   .on('cycle', function (event) {
//     console.log(String(event.target))
//   })
//   .run({ 'async': false })
// console.log('\n' + insertSeperator + '\n')
// const a = new Array()
// const b = new list()
// const c = new Array()
// const d = new list()
// const e = new Array()
// const f = new list()
// const g = new Array()
// const h = new list()
// indexedRepeat(10000, i => { e.push(i); f.pushBack(i); g.push(RDM(-1e8, 1e8)); h.pushBack(RDM(-1e8, 1e8)); })
// new Benchmark.Suite()
//   .add('[] push/splice', () => {
//     a.push(0)
//     a.splice(0, a.length - 1)
//   })
//   .add('list push/clear', () => {
//     b.pushBack(0)
//     b.clear()
//   })
//   .add('[] push/pop', () => {
//     a.push(0)
//     a.pop()
//   })
//   .add('list push/pop', () => {
//     b.pushBack(0)
//     b.popBack()
//   })
//   .add('[] push heavy str', () => {
//     c.push($strFX(1e5))
//   })
//   .add('list push heavy str', () => {
//     d.pushBack($strFX(1e5))
//   })
//   .add('[] random splice', () => {
//     e.splice(RDM(0, c.length - 1), RDM(10, 100), ...$seirNA(1000))
//   })
//   .add('list random splice', () => {
//     f.splice(RDM(0, d.length - 1), RDM(10, 100), ...$seirNA(1000))
//   })
//   .add('[] sort', () => {
//     g.sort()
//   })
//   .add('list sort', () => {
//     h.sort()
//   })
//   .on('cycle', function (event) {
//     console.log(String(event.target))
//   })
//   .run({ 'async': false })
new Benchmark.Suite()
  .add('~~', () => {
    ~~(Math.random() * 1357)
  })
  .add('round', () => {
    Math.floor(Math.random() * 1357)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ 'async': false })