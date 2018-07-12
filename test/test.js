// mocha unit test
const expect = chai.expect
const insertSeperator = ' ------------------------------------------------------------------------------------------ '
// test util
const RDM = (lower, upper) => ~~(lower + Math.floor(Math.random() * (upper - lower + 1)))
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
const $sameObj = () => {
    return {
        a: 1,
        b: {
            c: 2,
            d: {
                e: 3,
                f: {
                    g: 4,
                    h: [{
                        i: 5,
                        j: 6
                    }]
                }
            }
        }
    }
}
const $selfRefObj = () => {
    const obj = {
        a: 1,
        b: {
            c: 2,
            d: {
                e: 3,
                f: {
                    g: 4,
                    h: [{
                        i: 5,
                        j: null
                    }]
                }
            }
        }
    }
    obj.b.d.f.h[1].j = obj
    return obj
}
const $randStr = () => 10000 * Math.random() + '' + 10000 * Math.random()
const $strFX = bits => {
    let ret = ''
    for (let index = 0; index < bits; index++) {
        ret += ((Math.random() * 16 | 0) & 0x3 | 0x8).toString(16)
    }
    return ret
}
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
    it('list::[static]isList with right param' + insertSeperator + 'expected passing through', () => {
        expect(list.isList(new list())).to.be.true
        expect(list.isList(new list(1))).to.be.true
        expect(list.isList(new list(anyArr))).to.be.true
        class list_ extends list { }
        expect(list.isList(new list_())).to.be.true
    })
    it('list::[static]isList with bad param' + insertSeperator + 'expected not passing through', () => {
        expect(list.isList()).to.be.false
        expect(list.isList(null)).to.be.false
        expect(list.isList([])).to.be.false
        expect(list.isList({})).to.be.false
        expect(list.isList({ HeadNode: null, TailNode: null, _length: 0 })).to.be.false
        expect(list.isList(NaN)).to.be.false
        expect(list.isList(1)).to.be.false
        expect(list.isList('1')).to.be.false
        expect(list.isList(true)).to.be.false
        expect(list.isList(() => { })).to.be.false
    })
    it('list::[static]clone' + insertSeperator + 'works correctly', () => {
        const obj1 = { a: 1 }
        const obj2 = { b: 2 }
        const a = new list([obj1, obj2])
        const b = list.clone(a)
        expect(a.at(0)).to.deep.equal(b.at(0))
        expect(a.at(0) === b.at(0)).to.be.false
        expect(a.at(1)).to.deep.equal(b.at(1))
        expect(a.at(1) === b.at(1)).to.be.false
    })
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
        cpi.fill($sameObj())
        let i = cpi.size() - 1
        while (i-- > 0) {
            expect(cpi.at(i)).to.be.an('object')
            i > 2 ? expect(cpi.at(i) === cpi.at(i - 1)).to.be.true : void (0)
        }
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
    it('list::fill(any, start, end, true)' + insertSeperator + 'could extend this list', () => {
        const kk = new list([0, 1, 2, 3, 4, 5, 6, 7])
        kk.fill(-1, 0, 140, true)
        let i = kk.size() - 1
        while (i-- > 0)
            expect(kk.at(i)).to.be.a('number')
    })
    it('list::fill -> this&' + insertSeperator + 'works correctly', () => {
        const kk = new list([0, 1, 2, 3, 4, 5, 6, 7])
        expect(kk.fill(-1, 0, 140, true) === kk).to.be.true
    })
    it('list::pushFront all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        emptyInst.pushFront()
        expect(emptyInst.data).to.deep.equal([])
        const testNA = []
        let i = 0
        repeat(10, n => { const n_ = n(); testNA.push(n_); emptyInst.pushFront(n_) }, Math.random)
        i = emptyInst.size() - 1
        testNA.reverse()
        while (i-- > 0)
            expect(emptyInst.at(i)).to.equal(testNA[i])
        emptyInst.clear()
        emptyInst.pushFront(1)
        expect(emptyInst.at(0)).to.equal(1)
        emptyInst.pushFront(2).pushFront(3)
        // 3 2 1
        expect(emptyInst.at(0)).to.equal(3)
        expect(emptyInst.at(1)).to.equal(2)
        expect(emptyInst.at(2)).to.equal(1)
        expect(emptyInst.pushFront(4) === emptyInst).to.be.true
    })
    it('list::pushBack all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        emptyInst.pushBack()
        expect(emptyInst.data).to.deep.equal([])
        const testNA = []
        let i = 0
        repeat(10, n => { const n_ = n(); testNA.push(n_); emptyInst.pushBack(n_) }, Math.random)
        i = emptyInst.size() - 1
        while (i-- > 0)
            expect(emptyInst.at(i)).to.equal(testNA[i])
        emptyInst.clear()
        emptyInst.pushBack(1)
        expect(emptyInst.at(0)).to.equal(1)
        emptyInst.pushBack(2).pushBack(3)
        // 1 2 3
        expect(emptyInst.at(0)).to.equal(1)
        expect(emptyInst.at(1)).to.equal(2)
        expect(emptyInst.at(2)).to.equal(3)
        expect(emptyInst.pushBack(4) === emptyInst).to.be.true
    })
    it('list::insert all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        emptyInst.insert(0, -1)
        expect(emptyInst.data).to.deep.equal([])
        emptyInst.pushBack(1).pushBack(2).pushBack(3)
        emptyInst.insert(0, 0)
        expect(emptyInst.data).to.deep.equal([1, 0, 2, 3])
        emptyInst.insert(-3, 3)
        expect(emptyInst.data).to.deep.equal([1, 0, 2, 3, -3])
        emptyInst.insert(-4, 2)
        expect(emptyInst.data).to.deep.equal([1, 0, 2, -4, 3, -3])
        expect(emptyInst.insert(-20, 3) === emptyInst).to.be.true
    })
    it('list::popFront all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        expect(emptyInst.popFront()).to.be.null
        emptyInst.pushBack(1).pushBack(2).pushBack(3)
        expect(emptyInst.popFront()).to.equal(1)
        expect(emptyInst.data).to.deep.equal([2, 3])
    })
    it('list::popBack all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        expect(emptyInst.popBack()).to.be.null
        emptyInst.pushBack(1).pushBack(2).pushBack(3)
        expect(emptyInst.popBack()).to.equal(3)
        expect(emptyInst.data).to.deep.equal([1, 2])
    })
    it('list::drop all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        expect(emptyInst.drop().data).to.deep.equal([])
        emptyInst.pushBack(1).pushBack(2).pushBack(3)
        // 1
        expect(emptyInst.drop().data).to.deep.equal([2, 3])
        // 2
        expect(emptyInst.drop(2).data).to.deep.equal([3])
        // >= 3
        expect(emptyInst.drop(3).data).to.deep.equal([])
        expect(emptyInst.drop(4).data).to.deep.equal([])
    })
    it('list::dropRight all func' + insertSeperator + 'works correctly', () => {
        emptyInst.clear()
        expect(emptyInst.dropRight().data).to.deep.equal([])
        emptyInst.pushBack(1).pushBack(2).pushBack(3)
        // 1
        expect(emptyInst.dropRight().data).to.deep.equal([1, 2])
        // 2
        expect(emptyInst.dropRight(2).data).to.deep.equal([1])
        // >= 3
        expect(emptyInst.dropRight(3).data).to.deep.equal([])
        expect(emptyInst.dropRight(4).data).to.deep.equal([])
        //
        emptyInst.clear()
        // 1 2 3 4
        emptyInst.pushBack(1).pushBack(2).pushBack(3).pushBack(4)
        expect(emptyInst.drop()).to.deep.equal(list.fromArray([2, 3, 4]))
        expect(emptyInst.dropRight()).to.deep.equal(list.fromArray([1, 2, 3]))
        expect(emptyInst.drop(2)).to.deep.equal(list.fromArray([3, 4]))
        expect(emptyInst.dropRight(2)).to.deep.equal(list.fromArray([1, 2]))
    })
    it('list::itr all func' + insertSeperator + 'works correctly', () => {
        // emptyInst.clear().back_concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
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
        emptyInst.clear()
        indexedRepeat(10000, i => emptyInst.pushBack(i))
        indexedRepeat(100, i => {
            const ix = 8000 - Math.random() * 1000
            const lx = Math.random() * 20
            const ans = emptyInst.toArray().splice(ix, lx)
            const tmp = emptyInst.splice(ix, lx)
            expect(tmp).to.deep.equal(ans)
        })
    })
    it('list::concat / list::front_concat / list::back_concat' + insertSeperator + 'works correctly', () => {
        const list1 = list.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9])
        const list2 = list.fromArray([-1, -2, -3, -4, -5, -6, -7, -8, -9])
        const list3 = list.fromArray(['a', 'b', 'c', 'd', 'e'])
        const list4 = list.fromArray([{ a: 1, b: 2 }, { c: 3, d: 4 }])
        list1.front_concat(list2)
        expect(list1).to.be.deep.equal(list.fromArray([-1, -2, -3, -4, -5, -6, -7, -8, -9, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
        // input array
        list1.front_concat([-1, -32])
        expect(list1).to.be.deep.equal(list.fromArray([-1, -32, -1, -2, -3, -4, -5, -6, -7, -8, -9, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
        expect(list2.TailNode.nextPtr).to.equal(null)
        list3.back_concat(list4)
        expect(list3).to.be.deep.equal(list.fromArray(['a', 'b', 'c', 'd', 'e', { a: 1, b: 2 }, { c: 3, d: 4 }]))
        // input array
        list3.back_concat([{ p: 1 }, { p: 2 }])
        expect(list3).to.be.deep.equal(list.fromArray(['a', 'b', 'c', 'd', 'e', { a: 1, b: 2 }, { c: 3, d: 4 }, { p: 1 }, { p: 2 }]))
        expect(list4.HeadNode.previousPtr).to.equal(null)
        const list5 = list.fromArray([1, 2, 3, 4])
        const list6 = list.fromArray([6, 7, 8, 9])
        const list7 = list.fromArray([1, 2, 3, 4])
        list7.concat(list6, -1)
        expect(list7).to.deep.equal(list.fromArray([6, 7, 8, 9, 1, 2, 3, 4]))
        list5.concat(list6, 0)
        expect(list5).to.deep.equal(list.fromArray([1, 6, 7, 8, 9, 2, 3, 4]))
        list5.concat(list6, 9)
        expect(list5).to.deep.equal(list.fromArray([1, 6, 7, 8, 9, 2, 3, 4]))
        list5.concat(list6, 7)
        expect(list5).to.deep.equal(list.fromArray([1, 6, 7, 8, 9, 2, 3, 4, 6, 7, 8, 9]))
        // mid concat
        list5.concat(list6, 4)
        expect(list5).to.deep.equal(list.fromArray([1, 6, 7, 8, 9, 6, 7, 8, 9, 2, 3, 4, 6, 7, 8, 9]))
        // input array frt
        list5.concat(['a', 'b'], -1)
        expect(list5).to.deep.equal(list.fromArray(['a', 'b', 1, 6, 7, 8, 9, 6, 7, 8, 9, 2, 3, 4, 6, 7, 8, 9]))
        // input array mid
        list5.concat(['c', 'd'], 5)
        expect(list5).to.deep.equal(list.fromArray(['a', 'b', 1, 6, 7, 8, 'c', 'd', 9, 6, 7, 8, 9, 2, 3, 4, 6, 7, 8, 9]))
        // input array end
        list5.concat(['e', 'f'], 19)
        expect(list5).to.deep.equal(list.fromArray(['a', 'b', 1, 6, 7, 8, 'c', 'd', 9, 6, 7, 8, 9, 2, 3, 4, 6, 7, 8, 9, 'e', 'f']))
        expect(list6.HeadNode.previousPtr).to.be.null
        expect(list6.TailNode.nextPtr).to.be.null
        const list8 = new list()
        expect(list8
            .concat([1, 2, 3], -1)
            .concat(list.fromArray([4, 5]), 2)
            .concat([6, 7, 8], 2).data).to.deep.equal([1, 2, 3, 6, 7, 8, 4, 5])
    })
    it('benchmark push number', () => {
        const a = new Array()
        const b = new list()
        const c = new list()
        console.time('array push 10^6 number')
        repeat(100000, () => a.push(0))
        console.timeEnd('array push 10^6 number')
        //
        console.time('list push 10^6 number')
        repeat(100000, () => b.pushBack(0))
        console.timeEnd('list push 10^6 number')
        //
        console.time('list push front 10^6 number')
        repeat(100000, () => c.pushFront(0))
        console.timeEnd('list push front 10^6 number')
        //
        console.time('array clear')
        a.splice(0, a.length - 1)
        console.timeEnd('array clear')
        //
        console.time('list clear')
        b.clear()
        console.timeEnd('list clear')
    })
    it('benchmark push string easy', () => {
        const a = new Array()
        const b = new list()
        const c = new list()
        console.time('array push 10^6 x 8 bytes string')
        repeat(100000, () => a.push($strFX(8)))
        console.timeEnd('array push 10^6 x 8 bytes string')
        //
        console.time('list push 10^6 x 8 bytes string')
        repeat(100000, () => b.pushBack($strFX(8)))
        console.timeEnd('list push 10^6 x 8 bytes string')
        //
        console.time('list push front 10^6 x 8 bytes string')
        repeat(100000, () => c.pushFront($strFX(8)))
        console.timeEnd('list push front 10^6 x 8 bytes string')
        //
        console.time('array clear')
        a.splice(0, a.length - 1)
        console.timeEnd('array clear')
        //
        console.time('list clear')
        b.clear()
        console.timeEnd('list clear')
    })
    it('benchmark push string heavy', () => {
        const a = new Array()
        const b = new list()
        const c = new list()
        console.time('array push 10^6 x 32 bytes string')
        repeat(100000, () => a.push($strFX(32)))
        console.timeEnd('array push 10^6 x 32 bytes string')
        //
        console.time('list push 10^6 x 32 bytes string')
        repeat(100000, () => b.pushBack($strFX(32)))
        console.timeEnd('list push 10^6 x 32 bytes string')
        //
        console.time('list push front 10^6 x 32 bytes string')
        repeat(100000, () => c.pushFront($strFX(32)))
        console.timeEnd('list push front 10^6 x 32 bytes string')
        //
        console.time('array clear')
        a.splice(0, a.length - 1)
        console.timeEnd('array clear')
        //
        console.time('list clear')
        b.clear()
        console.timeEnd('list clear')
    })
    it('benchmark random splicing on length 10^5', () => {
        const a = new Array()
        const b = new list()
        // prep
        indexedRepeat(10000, i => a.push(i))
        indexedRepeat(10000, i => b.pushBack(i))
        //
        console.time('array random splicing')
        repeat(1000, () => a.splice(RDM(0, a.length), RDM(0, 100)))
        console.timeEnd('array random splicing')
        //
        console.time('list random splicing')
        repeat(1000, () => b.splice(RDM(0, b.length), RDM(0, 100)))
        console.timeEnd('list random splicing')
    })
    it('benchmark random splicing on length 10^5 with adding 10^5', () => {
        const a = new Array()
        const b = new list()
        // prep
        indexedRepeat(10000, i => a.push(i))
        indexedRepeat(10000, i => b.pushBack(i))
        // ...$seirNA(1000)
        console.time('array random splicing with adding 10^5')
        repeat(100, () => a.splice(RDM(0, a.length), RDM(0, 10), ...$seirNA(100)))
        console.timeEnd('array random splicing with adding 10^5')
        //
        console.time('list random splicing with adding 10^5')
        repeat(100, () => b.splice(RDM(0, b.length), RDM(0, 10), ...$seirNA(100)))
        console.timeEnd('list random splicing with adding 10^5')
    })
    it('benchmark loop on length 10^6', () => {
        const a = new Array()
        const b = new list()
        // prep
        indexedRepeat(100000, i => a.push(i))
        indexedRepeat(100000, i => b.pushBack(i))
        //
        console.time('array map1')
        a.map((v, i) => v * i)
        console.timeEnd('array map1')
        //
        console.time('list map1')
        b.map((v, i) => v * i)
        console.timeEnd('list map1')
        //
        console.time('array map2')
        a.map((v, i) => Math.pow(v, 2) * Math.pow(i, 2))
        console.timeEnd('array map2')
        //
        console.time('list map2')
        b.map((v, i) => Math.pow(v, 2) * Math.pow(i, 2))
        console.timeEnd('list map2')
        //
        console.time('array filter')
        a.filter((v, i) => v * i > 10000)
        console.timeEnd('array filter')
        //
        console.time('list filter')
        b.filter((v, i) => v * i > 10000)
        console.timeEnd('list filter')
        //
        let sum1 = 0
        let sum2 = 0
        console.time('array for...of loop1')
        for (const v of a) {
            sum1 += v
        }
        console.timeEnd('array for...of loop1')
        //
        console.time('list for...of loop1')
        for (const v of b) {
            sum2 += v
        }
        console.timeEnd('list for...of loop1')
    })
})