let arr = [1, 2, [4, 5, [6], [7, 8, [9, 10, 11]]]];

function flatten(arr) {
  if(Array.isArray(arr)) {
    return arr.reduce((prev, next) => {
       // 如果遍历的当前项是数组，再迭代展平
      return Array.isArray(next) ? prev.concat(flatten(next)) : prev.concat(next)
    }, [])
  } else {
    throw new Error(arr + ' is not array')
  }
}
console.log(flatten(arr));
