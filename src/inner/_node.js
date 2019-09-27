(function () {
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

    /**
     * @param {_Node | any} objToTest
     * @return {objToTest is _Node}
     */
    static isNode(objToTest) {
      util.__verbose('[_Node.isNode] Enter')
      return (
        objToTest instanceof _Node &&
        objToTest.hasOwnProperty('_data') &&
        objToTest.hasOwnProperty('previousPtr') &&
        objToTest.hasOwnProperty('nextPtr')
      )
    }

    /**
     * @param {any} elem
     * @param {_Node} frontElem
     * @param {_Node} nextElem
     */
    constructor(elem, frontElem, nextElem) {
      /**
       * @type {any}
       */
      this._data = elem

      /**
       * @type {_Node}
       */
      this.previousPtr = frontElem

      /**
       * @type {_Node}
       */
      this.nextPtr = nextElem

      util.__verbose('new _Node created')
    }

    /**
     * escape this node
     * illegal while has no pre or next node
     */
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

    /**
     * just like a deconstructor
     */
    destory() {
      this._data = null
      this.previousPtr = null
      this.nextPtr = null
      util.__verbose('_Node destoryed')
    }
  }

  module.exports = _Node
})