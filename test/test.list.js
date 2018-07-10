// mocha unit test
const expect = chai.expect
const insertSeperator = ' ------------------------------ '
// test
const repeat = (n, func, ...args) => {
    for (let i = 1; i <= n; i++) {
        func(...args)
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
    it('list::fill(undefined | null | NaN)' + insertSeperator + 'works correctly', () => {
        const cpi = new list(instA)
        cpi.fill()
        let i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.equal(undefined)
        cpi.fill(null)
        i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.equal(null)
        cpi.fill(NaN)
        i = cpi.size() - 1
        while (i-- > 0)
            expect(cpi.at(i)).to.deep.equal(NaN)
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
        repeat(1000, () => {
            emptyInst.pushFront(objr)
            expect(emptyInst.at(0)).to.deep.equal(objr)
        })
        repeat(100, () => {
            expect(emptyInst.at(~~(1000 * Math.random())) === emptyInst.at(~~(1000 * Math.random()))).to.be.true
        })
    })
    it('list::splice()', () => {
        emptyInst.clear()
        repeat(1000, () => {
            emptyInst.pushFront($randStr())
        })
        expect(emptyInst.size()).to.equal(1000)
        // default splice
        emptyInst.splice()
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
        // clear
        emptyInst.splice(0, 1000)
        expect(emptyInst.size()).to.equal(0)
    })
    // it('list::pushFront(string)', () => {

    // })
    // it('list::pushFront(bool)', () => {

    // })
    // it('list::pushFront(any)', () => {

    // })
    // it('list::pushFront(undefined | null | NaN)', () => {

    // })
    // it('list::pushBack(number)', () => {

    // })
    // it('list::pushBack(object)', () => {

    // })
    // it('list::pushBack(object&)', () => {

    // })
    // it('list::pushBack(string)', () => {

    // })
    // it('list::pushBack(bool)', () => {

    // })
    // it('list::pushBack(any)', () => {

    // })
    // it('list::pushBack(undefined | null | NaN)', () => {

    // })
})
