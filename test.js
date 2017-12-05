// utilities
const tDiv = document.getElementById("test")
const newP = line => { const p = document.createElement('p');p.innerText = line;return p }
const out = any => { tDiv.appendChild(newP(any)) }
const assert = (desc, ast) => ast ? '#  ' + desc + ' ok' : '#  ' + desc + ' fail'
// test
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
out('list::at() test:')
out(assert('b.at(0)', eval('b.at(0)===1')))
out(assert('a.at(4)', eval('a.at(4).a===4&&a.at(4).b===16')))