const Util = {
  findMultiIndex (array, element) {
    return array.reduce((r, v, i) => r.concat(v === element ? i : []), [])
  },
  difference (arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x))
  },
  removeElement (arr, value) {
    return arr.filter(ele => ele !== value)
  },
  getRandomElement (array) {
    return array[parseInt(Math.random() * array.length)]
  },
  copy (array) {
    return JSON.parse(JSON.stringify(array))
  },
  compare (a, b) {
    return a - b
  }
}

export default Util
