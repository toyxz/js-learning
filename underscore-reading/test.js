
//  不要脸写一个yxz库哈哈哈哈
(function() {
    // 这里比较粗略
    var root = self;
    var yxz = {};
    root.yxz = yxz;

    // reduce 
    yxz.reduce = function(obj,fn,memo,initial) {
        if (!Array.isArray(obj)) {  // 强制判断不是数组就返回memo
            return memo;  
        }
        var argsLen = arguments.length;
        var length = obj.length;
        var index = 0;
        if (!(argsLen >= 3)) {         // 说明只有两个参数那就初始化memo，否则说明有memo存在就不能覆盖
            memo = obj[index];
        }
        for (; index < length; ++index) {
            memo = fn(memo,obj[index],index,obj);
        }
        return memo;
    };
    // 测试
    // yxz.reduce([1,2],(prev,next)=>{return prev+1})   // 3
    // yxz.reduce([1,2],(prev,next)=>{return prev+1},2)  // 4

    // 源码中用 createReduce 的好处在于他可以在外层判断参数的个数，在里层写reduce的时候就比较优雅一些，同时源代码判断了是否是对象。为了不增加复杂性

    // isEqual
    yxz.isEqual = function(a,b) {
        // 暂时还没搞懂那两个stack是干嘛的，先简单实现，仍然分为eq和deepEq
        var eq = function (a,b) {
            if (a === b) return a!==0 || 1/a === 1/b;
            if (a == null || b == null) return false;
            if (a != a) return b != b;
            var type = typeof a;
            if (type !== "function" && type !== "object" && typeof b != 'object' ) return false;
            return deepEq(a,b);
        };
        var deepEq = function(a,b) {
            var className = toString.call(a);
            if ( className !== toString.call(b)) return false;
            switch (className) {
                case "[object RegExp]":
                case "[object String]":
                    return  '' + 'a' === '' + b;
                case "[object Number]":
                    if (+a !== +a) return +b !== +b; // + 的目的是 转化为数值
                    return +a === 0 ? 1/+a === 1/+b : +a === +b;
                case "[object Date]":
                case "[object Boolean]":
                    return +a === +b;
                case "[object Symbol]":
                    return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
            }
            var areArrays = className === "[object Array]";
            if (!areArrays) {
                // 如果不是Array那么只有是object才有比较意义，比较function是没有意义的
                if (typeof a != 'object' || typeof b != 'object') return false;
                // object如果没有相同的构造函数，那么说明也是不同的object
                var aCtor = a.constructor,bCtor = b.constructor;
                if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&  _.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
                    return false;
                }
            }
            var length;
            if (areArrays) {
                // 比较数组
                length = a.length;
                if (length != b.length) return false;
                while(length--) {
                    if (!eq(a[length],b[length])) return false;
                }
            } else {
                // 比较对象
                var keys = Object.keys(a);
                length = keys.length;
                if ( Object.keys(b).length !== length) return false;
                while(length--) {
                    key = keys[length];
                    if (!(has(b,key)&&eq(a[key],b[key]))) {
                        return false;
                    }
                }
            }
            return true;
        };
        var has = function(obj, path) {
            return obj != null && hasOwnProperty.call(obj, path);
        };
        return eq(a,b);
    };
    // 测试
    // yxz.isEqual(NaN,NaN)      true
    // yxz.isEqual({'1':2},{'2':4})    false   
    // yxz.isEqual({'1':2},{'1':2})    true

    // context这个参数先不要理它，因为不确定有什么作用，测试没测试，而且自己也调试不出来 这个参数有什么作用
    yxz.uniq = function (array,isSorted,fn,context) {
        // 先把确定isSorted是否存在布尔值
        if (!(isSorted === true || isSorted === false || toString.call(isSorted) === '[object Boolean]')) {
            context = fn;
            fn = isSorted;
            isSorted = false;
        }
        var  seen = [];
        var result = [];
        for (let i = 0,length = array.length;i < length; ++i) {
            var value = array[i];
            var computed  = fn ? fn(value,i,array):value;
            if (isSorted && !fn) {
                if (i == 0 || seen != computed) {
                    result.push(value);
                }
                seen = computed;
            } else if (fn) {
                if (seen.indexOf(computed) < 0) {
                    result.push(value);
                    seen.push(computed);
                }
            } else {
                if (result.indexOf(value) < 0) {
                    result.push(value);
                }
            }
        }
        return result;
    };
    //  测试
    // yxz.uniq([1, 1, 1, 2, 2, 3],true);  [1, 2, 3]
    // yxz.uniq([-2, -1, 0, 1, 2],true,function(x) {return x * x;});	[-2, -1, 0]

    // shallow 如果为true的话，说明只拍平一层
    // output 是最后作为result的数组
    yxz.flatten = function(array,shallow,output) {
        output = output || [];
        var dx = output.length;
        for (let i = 0,length = array ? array.length : 0; i < length; ++i) {
            var value = array[i];
            if (isArraylike(value)) { // 如果是（类）数组的话
                if (shallow) {  // 只是展开一层
                    let j = 0,len = value.length;
                    while(j<len) output[dx++] = value[j++];
                } else {
                    yxz.flatten(value,shallow,output);
                    dx = output.length;
                }
            } else {
                output[dx++] = value;
            }
        } 
        return output;
    };
    var isArraylike = function(array) {
        return Array.isArray(array) || hasOwnProperty.call(array,'callee');
    };
    // 测试
    // yxz.flatten([[], [[]], []]); // []
    // yxz.flatten([[], [[]], []], true); // [[]]
    // yxz.flatten([1, [2], [3, [[[4]]]]]); // [1, 2, 3, 4]
    // yxz.flatten([1, [2], [3, [[[4]]]]], true); //[1, 2, 3, [[[4]]]]
    

}());

