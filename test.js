// utilities
const tDiv = document.getElementById('test')
const newP = line => {
  const p = document.createElement('p')
  p.innerHTML = line
  return p
}
const out = any => tDiv.appendChild(newP(any))
const assert = (desc, ast) => ast instanceof Function ?
  ast() ? '#  ' + desc + ' <font color="blue">ok</font>' : '#  ' + desc + ' <font color="red">fail</font>' :
  ast ? '#  ' + desc + ' <font color="blue">ok</font>' : '#  ' + desc + ' <font color="red">fail</font>'
// test
const $gnar = (n) => {
  const p = []
  for (let i = 0; i < n; i++)
    p.push(i)
  return p
}
const $gen = (n) => {
  return {
    a: n,
    b: n * n,
    c: {
      d: '' + n,
      e: n + '' + n
    }
  }
}
const a = new list()
const b = new list()
const c = new list($gnar(20))
const emptyInst = new list()
const boolInst = new list()
a.pushBack($gen(0))
a.pushBack($gen(1))
a.pushBack($gen(2))
a.pushBack($gen(3))
a.pushBack($gen(4))
a.pushBack($gen(5))
a.pushBack($gen(6))
a.pushBack($gen(7))
a.pushBack($gen(8))
a.pushBack($gen(9))
b.pushBack(1)
b.pushBack(2)
b.pushBack(3)
b.pushBack(4)
b.pushBack(5)
b.pushBack(6)
b.pushBack(7)
b.pushBack(8)
b.pushBack(9)
b.pushBack(10)
boolInst.pushBack(true)
boolInst.pushBack(true)
boolInst.pushBack(false)
boolInst.pushBack(true)
boolInst.pushBack(false)
boolInst.pushBack(false)
boolInst.pushBack(true)
boolInst.pushBack(true)
boolInst.pushBack(true)
boolInst.pushBack(false)
out('---list::at() test:')
out(assert('b.at(0)', b.at(0) === 1))
out(assert('a.at(4)', a.at(4).a === 4 && a.at(4).b === 16))
out('---copy constructo test:')
out(assert('copy_constructor1', () => {
  let t = new list(a)
  return t.at(7).a === 7
}))
out(assert('copy_constructor2', () => {
  let t = new list(a)
  t.at(7).a = 1
  return a.at(7).a === 7
}))
out(assert('array copy constructor', c.at(1)===1))
out('---swap test:')
out(assert('a.swap(b)', () => {
  a.swap(b)
  return a.at(1) === 2 && b.at(3).a === 3
}))