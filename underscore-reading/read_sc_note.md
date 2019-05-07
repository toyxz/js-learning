### reduce
```js
// Create a reducing function iterating left or right.
var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
        console.log('eee')
        memo = obj[keys ? keys[index] : index];
        index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
    };

    return function(obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
};

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
_.reduce = _.foldl = _.inject = createReduce(1);
```
解析：
aka（又名）

“perf hit” 是 “performance hit” 的缩写，直译是 **“性能打击”**


```js
// 返回对象的某个属性
var shallowProperty = function(key) {
    return function(obj) {
    return obj == null ? void 0 : obj[key];
    };
};
// ....
var getLength = shallowProperty('length');
var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
// ...
_.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
};

// Is a given variable an object?
_.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};
```
为什么js中要用void 0 代替undefined？
```除了防止被重写外，还可以减少字节。void 0代替undefined省3个字节。```

number类型： 不为0 就，!!num 等于true;

string类型： 不为"" (空字符串)，!!str 等于true;

!!null 等于false

!!undefined 等于false

!!{} 等于 true  //注意：对象就算为空都会被转为true

!!function(){} 等于 true   //注意：这样写function 并不会执行function，所以就算function里面写任何东西都会返回true

```js
// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
        return func.call(context, value);
    };
    // The 2-argument case is omitted because we’re not using it.
    case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
    };
    }
    return function() {
    return func.apply(context, arguments);
    };
};
```

reduce 这个API用到了几个中间函数
* isArrayLike——获取传入参数的length，如果length是number类型且在合理范围内则返回true，说明传入该函数的collection是数组或者类数组
* keys——如果参数不是对象，那么返回空数组，否则获取对象的keys并全部返回；如果没有全局函数，则遍历
* optimizeCb：这是一个在其他函数中反复会用到的函数，主要是返回传入的参数的一个新版本；接受三个参数,这个函数主要供其他函数调用，主要是通过提供的参数的个数来返回不同参数数量的函数
* isObject：判断是不是function或者对象
* nativeKeys：这是一个Object.keys函数的引用
* collectNonEnumProps：当ie9之前的版本不支持for...of遍历，所以采用这种hack，用普通的循环完成

reduce 的基本思路
* 判断是否是对象，不是的话则是数组
* 通过循环遍历数组（按照一定的索引）然后每次都会对一个memo赋值，最后函数返回的就是这个memo的值（通过传入的函数计算）

模拟一个reduce(不考虑反向，且不考虑对象)
```js
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
}
// 测试
// yxz.reduce([1,2],(prev,next)=>{return prev+1})   // 3
// yxz.reduce([1,2],(prev,next)=>{return prev+1},2)  // 4

// 源码中用 createReduce 的好处在于他可以在外层判断参数的个数，在里层写reduce的时候就比较优雅一些，同时源代码判断了是否是对象。为了不增加复杂性
```
------------------------------------
### isEqual
```js
var eq, deepEq;
eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
};

// Internal recursive comparison function for `isEqual`.
deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case '[object RegExp]':
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
    case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;

        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                                    _.isFunction(bCtor) && bCtor instanceof bCtor)
                            && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
   }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
    } else {
        // Deep compare objects.
        var keys = _.keys(a), key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (_.keys(b).length !== length) return false;
        while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
};
_.isEqual = function(a, b) {
    return eq(a, b);
};
```
```

                ----eq(浅层比较)
isEqual比较-----
                ----deepEq（深比较）
```
#### eq
* a===b 不能比较```+0(0)和-0```, 1/a=>Infinity ,1/b=>-Infinity
* a===b 不能比较```null和undefined```,因为严格比较下null和undefined不相等，所以两者只要有一个是null说明上一步肯定不满足，也就是说另一个数肯定也不是null，那么这两个值就是不一样的
* 比较NAN，由于 ```NAN!==NAN ```,```if (a !== a) return b !== b```很绝妙
* 判断是否不是引用类型，typeof 值是function和object就说明是引用类型，那么就是基本类型，而前面都不满足就说明a和b不相等

eq如果是引用类型的话就进行深比较
#### deepEq
* 先比较[[class]],主要就比较两种引用类型是否相等，比如 object==>[object Object]，[]==>[object Array]
* 若是同一种类型的话就比较值。
    * 比较[object RegExp]和[object String]，主要是转为字符串形式
    *  比较[object Number]，先比较NAN再比较是不是0
    * 比较[object Date]，[object Boolean]，就是将日期和布尔值强制转换为数值基元值。（+a === +b）
    * 比较[object Symbol]
* 比较对象
    * 先判断keys的长度，长度相等才有继续比较的必要，长度相等，则判断另一个对象是否有这个属性，有的话eq每一个值
* 比较数组
    * 判断两者的构造函数是否相等
    * 比较数组长度并wq每个值


模拟isEqual(有点长)
```js
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
```
-------------
### uniq
```js
// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
// Aliased as `unique`.
_.uniq = _.unique = function(array, isSorted, iteratee, context) {
if (!_.isBoolean(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
}
if (iteratee != null) iteratee = cb(iteratee, context);
var result = [];
var seen = [];
for (var i = 0, length = getLength(array); i < length; i++) {
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
            seen = computed;
    } else if (iteratee) {
        if (!_.contains(seen, computed)) {
            seen.push(computed);
            result.push(value);
        }
    } else if (!_.contains(result, value)) {
        result.push(value);
    }
}
return result;
};
```
```js
// Is a given value a boolean?
_.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};
// Determine if the array or object contains a given item (using `===`).
// Aliased as `includes` and `include`.
_.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
};
_.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
// Generator function to create the indexOf and lastIndexOf functions.
var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
    var i = 0, length = getLength(array);
    if (typeof idx == 'number') {
        if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
    } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
    }
    return -1;
    };
};
```
uniq中有四个参数
* array 等待处理的数组
* isSorted 传入的数组是否已经排序，如果已经排序，会使得算法有比较高的效率
* iteratee表示要处理的函数，这个函数返回的值会被存储起来，如果有另一个值的计算结果也和该值一样，那么，该值不会被加入结果队列
* context

uniq中比较重要的两个函数：
* isBoolean:判断是否是布尔值
* contains：接受两个参数，判断数组中是否有这个值存在

uniq的基本思路
* 判断第二个参数是不是布尔值，如果不是的说明用户并没有传入这个值，也就是说这个值是可选的，那么后面的iteratee和context就应该依次往前设置值
* 如果计算的函数存在，那么需要根据设置再cb一次（这个应该是全局的回调函数都需要的）
* 设置两个数组，一个是seen，一个是result。
* 循环遍历数组，先取第一个值。如果有计算函数就计算完就返回，如果没有的话就还是返回原来的值
* 遍历中走三个循环
    * 如果已经排序而且```没有函数```，如果是第一个数，则直接放进result数组里面，然后seen就是此次操作的值，下一次比较就喝这个值比较
    * 如果存在iteratee这个计算函数，判断seen数组里面有没有这个computed的值，如果有那么放进seen数组里面。value放进result里面
    * 如果都没有前面那些假设，那就是普普通通的判断一个值是否在一个数组里面，不存在的话就放进result这样


模拟uniq:
```js
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
```
------------
### flatten
underscore的flatten如果传入第二个参数，则只会压扁一级。
```js
// Internal implementation of a recursive `flatten` function.
var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
        var value = input[i];
        if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
            // Flatten current level of array or arguments object.
            if (shallow) {
                var j = 0, len = value.length;
                while (j < len) output[idx++] = value[j++];
            } else {
                flatten(value, shallow, strict, output);
                idx = output.length;
            }
        } else if (!strict) {
            output[idx++] = value;
        }
    }
    return output;
};

// Flatten out an array, either recursively (by default), or just one level.
_.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
};

_.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
};
var nativeIsArray = Array.isArray;
// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
    return has(obj, 'callee');
    };
}
```
flatten思路：
主要是递归
* 循环数组中的每一个元素，判断该元素是否是拥有length的数组或者对象,同时它应该是一个类数组或者数组
    * 如果是（类）数组的话，再判断有没有第二个参数是不是为true。如果为true的话就只展开一层，否则的话就递归，这里有个小tip就是将计算完的output的长度计算在idx中
* 如果不是数组，那么直接装入即可


flatten模拟：
```js
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
```

接下来
### 防抖节流




> 顺便学一下underscore是怎么测试的，话说node的断言我还木有、学习