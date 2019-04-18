// // let promise1 = function() {
// //     return new Promise((resolve,reject) => {
// //         setTimeout(() => {
// //             console.log(1)
// //             resolve(1)
// //         },500)
// //     })
// // }
// // let promise2 = function(data) {
// //     return new Promise((resolve,reject) => {
// //         setTimeout(() => {
// //             console.log(data+1)
// //             resolve(data+1)
// //         },500)
// //     })
// // }
// // let promise3 = function(data) {
// //     return new Promise((resolve,reject) => {
// //         setTimeout(() => {
// //             console.log(data+1)
// //             resolve(data+1)
// //         },500)
// //     })
// // }

// // async function getUrl(promises) {
// //     let data = null;
// //     for (let promise of promises) {
// //         data = await promise(data) 
// //     }
// // }
// // getUrl([promise1,promise2,promise3])

// let arr = []
// let num = 0
// function getArr() {
//     if (num == 100) {
//         return
//     } else {
//         arr.push(num)
//         num++
//         getArr()
//     }
// }
// console.log(getArr())

/*
请实现find函数，使下列的代码调用正确。
 
  约定：
 
title数据类型为String
userId为主键，数据类型为Number
*/

var data = [
    {userId: 8, title: 'title1'},
    {userId: 11, title: 'other'},
    {userId: 15, title: null},
    {userId: 19, title: 'title2'}
  ];
  
  
  var find = function(origin) {
    //your code are here...
    let result = origin;
    function sortByArgs(arr,...args) {
      let ways = [...args];
      if (ways[1] == 'desc'){
            sortDesc(result,ways[0]);
      } else if (ways[1] == 'asc'){
            sortAsc(result,ways[0]);
      } else {
          return result;
      }
    }
    function sortDesc(arr,key){
      let len = arr.length;
      for (let i = 0; i < len; ++i) {
          for (let j = 1; j < len - i; ++j){
              if (arr[j-1][key] < arr[j][key]) {
                  swapObj(arr,j,j-1);
              }
          }
      }
    }
    function sortAsc(arr,key){
        let len = arr.length;
        for (let i = 0; i < len; ++i) {
            for (let j = 1; j < len - i; ++j){
                if (arr[j-1][key] > arr[j][key]) {
                    swapObj(arr,j,j-1);
                }
            }
        }
    }
    function swapObj(arr, index1, index2){
      let temp = arr[index1];
      arr[index1] = arr[index2];
      arr[index2] = temp;
    }
  
  
    return {
      where: function(args){
          result = result.filter(function(item,index){
                if (!item.title || !item.title.match(args.title)){
                  return false;
              }
                return true
          })
          return this;
      },
      orderBy: function(...args){
          sortByArgs(result,...args);
          return result;
      }
    }
  
  }
  
  //查找data中，符合条件的数据，并进行排序
  var result = find(data).where({
    "title": /\d$/
  }).orderBy('userId', 'desc');
  console.log(result); // [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];