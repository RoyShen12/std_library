// mocha unit test
const expect = chai.expect
const insertSeperator = ' ------------------------------ '
// test util
const repeat = (n, func, ...args) => {
    for (let i = 1; i <= n; i++) {
        func(...args)
    }
}
const indexedRepeat = (n, func) => {
    for (let i = 0; i < n; i++) {
        func(i)
    }
}
const anyArr = [-1, 0, 1, 141.215, 0.000151, {}, {
    a: 1,
    b: 2
},
[1, 2, 4], '1314', ''
]
const $seirNA = (n) => {
    const p = []
    for (let i = 0; i < n; i++)
        p.push(i)
    return p
}
const $seirOBJ = (n) => {
    return {
        a: n,
        b: n * n,
        c: {
            d: '' + n,
            e: n + '' + n
        }
    }
}
const $randStr = () => 10000 * Math.random() + '' + 10000 * Math.random()
const $randBol = () => Math.random() < 0.500000 ? true : false
const instA = new list()
const instB = new list()
const instC = new list($seirNA(20))
const emptyInst = new list()
window._emptyInst_ = emptyInst
const emptyInst2 = new list()
const emptyInst3 = new list()
const emptyInst4 = new list()
const boolInst = new list()
const strInst = new list()

describe('class list test: ', () => {
    it('list::constructor(integer)' + insertSeperator + 'works correctly', () => {
        let i = 0
        instB.pushBack(1)
        instB.pushBack(2)
        instB.pushBack(3)
        instB.pushBack(4)
        instB.pushBack(5)
        instB.pushBack(6)
        instB.pushBack(7)
        instB.pushBack(8)
        instB.pushBack(9)
        instB.pushBack(10)
        while (i < instB.size())
            expect(instB.at(i++)).to.equal(i)
    })
    it('list::constructor(object)' + insertSeperator + 'works correctly', () => {
        let i = 0
        instA.pushBack($seirOBJ(0))
        instA.pushBack($seirOBJ(1))
        instA.pushBack($seirOBJ(2))
        instA.pushBack($seirOBJ(3))
        instA.pushBack($seirOBJ(4))
        instA.pushBack($seirOBJ(5))
        instA.pushBack($seirOBJ(6))
        instA.pushBack($seirOBJ(7))
        instA.pushBack($seirOBJ(8))
        instA.pushBack($seirOBJ(9))
        while (i < instA.size())
            expect(instA.at(i++).a).to.equal(i - 1)
    })
    it('list::constructor(bool)' + insertSeperator + 'works correctly', () => {
        let i = 0
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
        expect(boolInst.at(i++)).to.be.true
        expect(boolInst.at(i++)).to.be.true
        expect(boolInst.at(i++)).to.be.false
        expect(boolInst.at(i++)).to.be.true
        expect(boolInst.at(i++)).to.be.false
        expect(boolInst.at(i++)).to.be.false
        expect(boolInst.at(i++)).to.be.true
        expect(boolInst.at(i++)).to.be.true
        expect(boolInst.at(i++)).to.be.true
        expect(boolInst.at(i++)).to.be.false
    })
    it('list::constructor(string)' + insertSeperator + 'works correctly', () => {
        let i = 7
        let rec = []
        while (i-- > 0) {
            let tmp = $randStr()
            rec.push(tmp)
            strInst.pushBack(tmp)
        }
        while (i++ < 7)
            expect(strInst.at(i)).to.equal(rec[i])
    })
    it('list::constructor(null)' + insertSeperator + 'works correctly', () => {
        expect(emptyInst.size()).to.equal(0)
        expect(emptyInst.HeadNode).to.equal(null)
        expect(emptyInst.TailNode).to.equal(null)
    })
    it('list::constructor(list<any>&)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        let i = 5
        while (i-- > 0)
            expect(cpi.at(i)).to.deep.equal(instA.at(i))
    })
    it('list::constructor(array<any>&)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(anyArr)
        let i = anyArr.length - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.deep.equal(anyArr[i])
    })
    it('list::at(index) out_of_range test ::at(-N*)' + insertSeperator + 'check correctly', () => {
        expect(instB.at(-1)).to.equal(undefined)
    })
    it('list::at(index) out_of_range test ::at(N* exceed this._length)' + insertSeperator + 'check correctly', () => {
        expect(instB.at(10000)).to.equal(undefined)
    })
    it('list::at(index) is not integer test ::at(float R)' + insertSeperator + 'floor correctly', () => {
        expect(instB.at(1.25125)).to.deep.equal(instB.at(1))
        expect(instB.at(1.95125)).to.deep.equal(instB.at(1))
    })
    it('list::at(<type error>) test ::at(undefined)' + insertSeperator + 'check correctly', () => {
        expect(instB.at()).to.equal(undefined)
        expect(instB.at()).to.equal(undefined)
    })
    it('list<object>::const_at(index)' + insertSeperator + 'returns const copies correctly', () => {
        instA.at(2).a = 100
        instA.const_at(1).a = 100
        expect(instA.at(1).a).to.not.equal(100)
        expect(instA.at(2).a).to.equal(100)
    })
    it('list::fill(number)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        cpi.fill(Math.random())
        let i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.be.a('number')
    })
    it('list::fill(object)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        cpi.fill($seirOBJ())
        let i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.be.an('object')
    })
    it('list::fill(object&)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        const objr = {
            a: 111,
            b: 222
        }
        cpi.fill(objr)
        let i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.be.an('object')
    })
    it('list::fill(string)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        cpi.fill($randStr())
        let i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.be.a('string')
    })
    it('list::fill(bool)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        cpi.fill($randBol())
        let i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.be.a('boolean')
    })
    it('list::fill(any, start)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        cpi.fill(deepCopy(anyArr), 2)
        expect(cpi.at(0)).to.deep.equal(instA.at(0))
        expect(cpi.at(1)).to.deep.equal(instA.at(1))
        let i = cpi.size() - 1
        while (i-- > 2)
            expect(cpi.at(i)).to.deep.equal(anyArr)
    })
    it('list::fill(any, start, end)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        cpi.fill(deepCopy(anyArr), 2, 4)
        expect(cpi.at(0)).to.deep.equal(instA.at(0))
        expect(cpi.at(1)).to.deep.equal(instA.at(1))
        expect(cpi.at(5)).to.deep.equal(instA.at(5))
        expect(cpi.at(7)).to.deep.equal(instA.at(7))
        expect(cpi.at(2)).to.deep.equal(anyArr)
        expect(cpi.at(3)).to.deep.equal(anyArr)
        expect(cpi.at(4)).to.deep.equal(anyArr)
    })
    it('list::pushFront(number)' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        const testNA = []
        let i = 0
        repeat(1000, (n) => testNA.push(n), Math.random())
        repeat(1000, (n) => {
            emptyInst.pushFront(n)
            expect(emptyInst.at(0)).to.equal(n)
        }, testNA[i++])
        i = emptyInst.size() - 1
        while (i-- > 0)
            expect(emptyInst.at(i)).to.equal(testNA[i])
    })
    it('list::pushFront(object)' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        repeat(1000, (obj) => {
            emptyInst.pushFront(obj)
            expect(emptyInst.at(0)).to.deep.equal(obj)
        }, $seirOBJ(Math.random()))
        const testRF = new list()
        testRF.pushFront({ a: 1, b: 2 })
        testRF.pushFront({ a: 1, b: 2 })
        expect(testRF.at(0) === testRF.at(1)).to.be.false
    })
    it('list::pushFront(object&)' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        const objr = {
            a: 111,
            b: 222
        }
        repeat(1001, () => {
            emptyInst.pushFront(objr)
        })
        expect(emptyInst.at(0)).to.deep.equal(objr)
        repeat(100, () => {
            const n1 = ~~(1000 * Math.random())
            const n2 = ~~(1000 * Math.random())
            emptyInst.at(n1) === emptyInst.at(n2) ? void (0) : console.log(n1, n2, emptyInst.at(n1), emptyInst.at(n2))
            expect(emptyInst.at(n1) === emptyInst.at(n2)).to.be.true
        })
    })
    it('list::splice all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        repeat(1000, () => {
            emptyInst.pushFront($randStr())
        })
        expect(emptyInst.size()).to.equal(1000)
        // default splice
        const a1 = emptyInst.splice()
        expect(a1).to.be.an('array')
        expect(a1.length).to.equal(1)
        expect(a1[0]).to.be.a('string')
        expect(emptyInst.size()).to.equal(999)
        let cot = 0
        emptyInst.itr((idx, p) => {
            cot++
        })
        expect(cot).to.equal(999)
        const targ = $seirNA(1200)
        // replace all
        emptyInst.splice(0, 999, ...targ)
        for (let ix = 0; ix < emptyInst.size() - 1; ix++) {
            expect(emptyInst.at(ix)).to.equal(ix)
        }
        emptyInst.clear()
        expect(emptyInst.size()).to.equal(0)
        repeat(1000, () => {
            emptyInst.pushFront($randStr())
        })
        // bad index
        emptyInst.splice(-20)
        expect(emptyInst.size()).to.equal(1000)
        // bad delcount
        emptyInst.splice(0, 1001)
        expect(emptyInst.size()).to.equal(1000)
        // splice from head
        emptyInst.splice(0, 2, 'abc', 'def')
        expect(emptyInst.at(0)).to.equal('abc')
        expect(emptyInst.at(1)).to.equal('def')
        // splice to end
        emptyInst.splice(998, 2, 'abcd', 'defg')
        expect(emptyInst.at(998)).to.equal('abcd')
        expect(emptyInst.at(999)).to.equal('defg')
        // splice to mid
        emptyInst.splice(400, 3, '1234', '5678', '9101')
        expect(emptyInst.at(400)).to.equal('1234')
        expect(emptyInst.at(401)).to.equal('5678')
        expect(emptyInst.at(402)).to.equal('9101')
        // clear
        emptyInst.splice(0, 1000)
        expect(emptyInst.size()).to.equal(0)
        emptyInst.pushBack('12').pushBack('34').pushBack('56').pushBack('78').pushBack('910').pushBack('1011').pushBack('1213')
        // splice returning from start by 1
        const a2 = emptyInst.splice()
        expect(a2).to.deep.equal(['12'])
        // splice returning from end by 1
        const a3 = emptyInst.splice(5)
        expect(a3).to.deep.equal(['1213'])
        // splice returning from mid by 1
        const a4 = emptyInst.splice(2)
        expect(a4).to.deep.equal(['78'])
        emptyInst.pushBack('1415').pushBack('1617').pushBack('1819').pushBack('2021')
        // splice returning from mid by 2
        const a5 = emptyInst.splice(4, 2)
        expect(a5).to.deep.equal(['1415', '1617'])
        // clear
        const ar = emptyInst.toArray()
        const a6 = emptyInst.splice(0, emptyInst.size())
        expect(ar).to.deep.equal(a6)
        indexedRepeat(10000, i => emptyInst.pushBack(i))
        indexedRepeat(100, i => {
            const ix = i * 2 + Math.random() * 30
            const lx = Math.random() * 30
            const ans = emptyInst.toArray().splice(ix, lx)
            const tmp = emptyInst.splice(ix, lx)
            expect(tmp).to.deep.equal(ans)
        })
    })
    it('list::concat/list::front_concat/list::back_concat' + insertSeperator + 'works correctly', () => {
        const list1 = list.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9])
        const list2 = list.fromArray([-1, -2, -3, -4, -5, -6, -7, -8, -9])
        const list3 = list.fromArray(['a', 'b', 'c', 'd', 'e'])
        const list4 = list.fromArray([{ a: 1, b: 2 }, { c: 3, d: 4 }])
        list1.front_concat(list2)
        expect(list1).to.be.deep.equal(list.fromArray([-1, -2, -3, -4, -5, -6, -7, -8, -9, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
        expect(list2.TailNode.nextPtr).to.equal(null)
        list3.back_concat(list4)
        expect(list3).to.be.deep.equal(list.fromArray(['a', 'b', 'c', 'd', 'e', { a: 1, b: 2 }, { c: 3, d: 4 }]))
        expect(list4.HeadNode.previousPtr).to.equal(null)
        console.log(list1)
        console.log(list2)
        console.log(list3)
        console.log(list4)
        const list5 = list.fromArray([1, 2, 3, 4])
        const list6 = list.fromArray([6, 7, 8, 9])
        list5.concat(list6, 0)
        expect(list5).to.deep.equal(list.fromArray([6, 7, 8, 9, 1, 2, 3, 4]))
        list5.concat(list6, 9)
        expect(list5).to.deep.equal(list.fromArray([6, 7, 8, 9, 1, 2, 3, 4]))
        list5.concat(list6, 7)
        expect(list5).to.deep.equal(list.fromArray([6, 7, 8, 9, 1, 2, 3, 4, 6, 7, 8, 9]))
        // mid concat
        list5.concat(list6, 4)
        expect(list5).to.deep.equal(list.fromArray([6, 7, 8, 9, 1, 6, 7, 8, 9, 2, 3, 4, 6, 7, 8, 9]))
    })
})
