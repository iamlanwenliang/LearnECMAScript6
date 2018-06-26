1.二进制和八进制表示法.
	ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示。

	0b111110111 === 503 // true
	0o767 === 503 // true
	从 ES5 开始，在严格模式之中，八进制就不再允许使用前缀0表示，ES6 进一步明确，要使用前缀0o表示。
	
	// 非严格模式
	(function(){
	  console.log(0o11 === 011);
	})() // true
	
	// 严格模式
	(function(){
	  'use strict';
	  console.log(0o11 === 011);
	})() // Uncaught SyntaxError: Octal literals are not allowed in strict mode.
	如果要将0b和0o前缀的字符串数值转为十进制，要使用Number方法。
	
	Number('0b111')  // 7
	Number('0o10')  // 8
2.Number.isFinite(), Number.isNaN().
	ES6在Number对象上，新提供了Number.isFinite()和Number.isNaN()两个方法。

	Number.isFinite()用来检查一个数值是否为有限的（finite）。
	
	Number.isFinite(15); // true
	Number.isFinite(0.8); // true
	Number.isFinite(NaN); // false
	Number.isFinite(Infinity); // false
	Number.isFinite(-Infinity); // false
	Number.isFinite('foo'); // false
	Number.isFinite('15'); // false
	Number.isFinite(true); // false
	ES5可以通过下面的代码，部署Number.isFinite方法。
	
	(function (global) {
	  var global_isFinite = global.isFinite;
	
	  Object.defineProperty(Number, 'isFinite', {
	    value: function isFinite(value) {
	      return typeof value === 'number' && global_isFinite(value);
	    },
	    configurable: true,
	    enumerable: false,
	    writable: true
	  });
	})(this);
	Number.isNaN()用来检查一个值是否为NaN。
	
	Number.isNaN(NaN) // true
	Number.isNaN(15) // false
	Number.isNaN('15') // false
	Number.isNaN(true) // false
	Number.isNaN(9/NaN) // true
	Number.isNaN('true'/0) // true
	Number.isNaN('true'/'true') // true
	ES5通过下面的代码，部署Number.isNaN()。
	
	(function (global) {
	  var global_isNaN = global.isNaN;
	
	  Object.defineProperty(Number, 'isNaN', {
	    value: function isNaN(value) {
	      return typeof value === 'number' && global_isNaN(value);
	    },
	    configurable: true,
	    enumerable: false,
	    writable: true
	  });
	})(this);
	它们与传统的全局方法isFinite()和isNaN()的区别在于，传统方法先调用Number()将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，Number.isFinite()对于非数值一律返回false, Number.isNaN()只有对于NaN才返回true，非NaN一律返回false。
	
	isFinite(25) // true
	isFinite("25") // true
	Number.isFinite(25) // true
	Number.isFinite("25") // false
	
	isNaN(NaN) // true
	isNaN("NaN") // true
	Number.isNaN(NaN) // true
	Number.isNaN("NaN") // false
	Number.isNaN(1) // false
3.Number.parseInt(), Number.parseFloat().
	ES6将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。

	// ES5的写法
	parseInt('12.34') // 12
	parseFloat('123.45#') // 123.45
	
	// ES6的写法
	Number.parseInt('12.34') // 12
	Number.parseFloat('123.45#') // 123.45
	这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。
	
	Number.parseInt === parseInt // true
	Number.parseFloat === parseFloat // true
4.Number.isInteger().
	Number.isInteger()用来判断一个值是否为整数。需要注意的是，在JavaScript内部，整数和浮点数是同样的储存方法，所以3和3.0被视为同一个值。

	Number.isInteger(25) // true
	Number.isInteger(25.0) // true
	Number.isInteger(25.1) // false
	Number.isInteger("15") // false
	Number.isInteger(true) // false
	ES5可以通过下面的代码，部署Number.isInteger()。
	
	(function (global) {
	  var floor = Math.floor,
	    isFinite = global.isFinite;
	
	  Object.defineProperty(Number, 'isInteger', {
	    value: function isInteger(value) {
	      return typeof value === 'number' && isFinite(value) &&
	        value > -9007199254740992 && value < 9007199254740992 &&
	        floor(value) === value;
	    },
	    configurable: true,
	    enumerable: false,
	    writable: true
	  });
	})(this);
5.Number.EPSILON.
	ES6在Number对象上面，新增一个极小的常量Number.EPSILON。

	Number.EPSILON
	// 2.220446049250313e-16
	Number.EPSILON.toFixed(20)
	// '0.00000000000000022204'
	引入一个这么小的量的目的，在于为浮点数计算，设置一个误差范围。我们知道浮点数计算是不精确的。
	
	0.1 + 0.2
	// 0.30000000000000004
	
	0.1 + 0.2 - 0.3
	// 5.551115123125783e-17
	
	5.551115123125783e-17.toFixed(20)
	// '0.00000000000000005551'
	但是如果这个误差能够小于Number.EPSILON，我们就可以认为得到了正确结果。
	
	5.551115123125783e-17 < Number.EPSILON
	// true
	因此，Number.EPSILON的实质是一个可以接受的误差范围。
	
	function withinErrorMargin (left, right) {
	  return Math.abs(left - right) < Number.EPSILON;
	}
	withinErrorMargin(0.1 + 0.2, 0.3)
	// true
	withinErrorMargin(0.2 + 0.2, 0.3)
	// false
	上面的代码为浮点数运算，部署了一个误差检查函数。
6.安全整数和Number.isSafeInteger().
	JavaScript能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。

	Math.pow(2, 53) // 9007199254740992
	
	9007199254740992  // 9007199254740992
	9007199254740993  // 9007199254740992
	
	Math.pow(2, 53) === Math.pow(2, 53) + 1
	// true
	上面代码中，超出2的53次方之后，一个数就不精确了。
	
	ES6引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。
	
	Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
	// true
	Number.MAX_SAFE_INTEGER === 9007199254740991
	// true
	
	Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER
	// true
	Number.MIN_SAFE_INTEGER === -9007199254740991
	// true
	上面代码中，可以看到JavaScript能够精确表示的极限。
	
	Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。
	
	Number.isSafeInteger('a') // false
	Number.isSafeInteger(null) // false
	Number.isSafeInteger(NaN) // false
	Number.isSafeInteger(Infinity) // false
	Number.isSafeInteger(-Infinity) // false
	
	Number.isSafeInteger(3) // true
	Number.isSafeInteger(1.2) // false
	Number.isSafeInteger(9007199254740990) // true
	Number.isSafeInteger(9007199254740992) // false
	
	Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
	Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
	Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
	Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false
	这个函数的实现很简单，就是跟安全整数的两个边界值比较一下。
	
	Number.isSafeInteger = function (n) {
	  return (typeof n === 'number' &&
	    Math.round(n) === n &&
	    Number.MIN_SAFE_INTEGER <= n &&
	    n <= Number.MAX_SAFE_INTEGER);
	}
	实际使用这个函数时，需要注意。验证运算结果是否落在安全整数的范围内，不要只验证运算结果，而要同时验证参与运算的每个值。
	
	Number.isSafeInteger(9007199254740993)
	// false
	Number.isSafeInteger(990)
	// true
	Number.isSafeInteger(9007199254740993 - 990)
	// true
	9007199254740993 - 990
	// 返回结果 9007199254740002
	// 正确答案应该是 9007199254740003
7.Math对象的扩展.
	(1)Math.trunc()

		Math.trunc方法用于去除一个数的小数部分，返回整数部分。
		
		Math.trunc(4.1) // 4
		Math.trunc(4.9) // 4
		Math.trunc(-4.1) // -4
		Math.trunc(-4.9) // -4
		Math.trunc(-0.1234) // -0
		对于非数值，Math.trunc内部使用Number方法将其先转为数值。
		
		Math.trunc('123.456')
		// 123
		对于空值和无法截取整数的值，返回NaN。
		
		Math.trunc(NaN);      // NaN
		Math.trunc('foo');    // NaN
		Math.trunc();         // NaN
		对于没有部署这个方法的环境，可以用下面的代码模拟。
		
		Math.trunc = Math.trunc || function(x) {
		  return x < 0 ? Math.ceil(x) : Math.floor(x);
		};
	(2).Math.sign()
	 	Math.sign方法用来判断一个数到底是正数、负数、还是零。

		它会返回五种值。
		
		参数为正数，返回+1；
		参数为负数，返回-1；
		参数为0，返回0；
		参数为-0，返回-0;
		其他值，返回NaN。
		Math.sign(-5) // -1
		Math.sign(5) // +1
		Math.sign(0) // +0
		Math.sign(-0) // -0
		Math.sign(NaN) // NaN
		Math.sign('foo'); // NaN
		Math.sign();      // NaN
		对于没有部署这个方法的环境，可以用下面的代码模拟。
		
		Math.sign = Math.sign || function(x) {
		  x = +x; // convert to a number
		  if (x === 0 || isNaN(x)) {
		    return x;
		  }
		  return x > 0 ? 1 : -1;
		};
	(3)Math.cbrt()
		Math.cbrt方法用于计算一个数的立方根。

		Math.cbrt(-1) // -1
		Math.cbrt(0)  // 0
		Math.cbrt(1)  // 1
		Math.cbrt(2)  // 1.2599210498948734
		对于非数值，Math.cbrt方法内部也是先使用Number方法将其转为数值。
		
		Math.cbrt('8') // 2
		Math.cbrt('hello') // NaN
		对于没有部署这个方法的环境，可以用下面的代码模拟。
		
		Math.cbrt = Math.cbrt || function(x) {
		  var y = Math.pow(Math.abs(x), 1/3);
		  return x < 0 ? -y : y;
		};
	(4)Math.clz32()

			JavaScript的整数使用32位二进制形式表示，Math.clz32方法返回一个数的32位无符号整数形式有多少个前导0。
			
			Math.clz32(0) // 32
			Math.clz32(1) // 31
			Math.clz32(1000) // 22
			Math.clz32(0b01000000000000000000000000000000) // 1
			Math.clz32(0b00100000000000000000000000000000) // 2
			上面代码中，0的二进制形式全为0，所以有32个前导0；1的二进制形式是0b1，只占1位，所以32位之中有31个前导0；1000的二进制形式是0b1111101000，一共有10位，所以32位之中有22个前导0。
			
			clz32这个函数名就来自”count leading zero bits in 32-bit binary representations of a number“（计算32位整数的前导0）的缩写。
			
			左移运算符（<<）与Math.clz32方法直接相关。
			
			Math.clz32(0) // 32
			Math.clz32(1) // 31
			Math.clz32(1 << 1) // 30
			Math.clz32(1 << 2) // 29
			Math.clz32(1 << 29) // 2
			对于小数，Math.clz32方法只考虑整数部分。
			
			Math.clz32(3.2) // 30
			Math.clz32(3.9) // 30
			对于空值或其他类型的值，Math.clz32方法会将它们先转为数值，然后再计算。
			
			Math.clz32() // 32
			Math.clz32(NaN) // 32
			Math.clz32(Infinity) // 32
			Math.clz32(null) // 32
			Math.clz32('foo') // 32
			Math.clz32([]) // 32
			Math.clz32({}) // 32
			Math.clz32(true) // 31	
	(5)	Math.imul()
		Math.imul方法返回两个数以32位带符号整数形式相乘的结果，返回的也是一个32位的带符号整数。

		Math.imul(2, 4)   // 8
		Math.imul(-1, 8)  // -8
		Math.imul(-2, -2) // 4
		如果只考虑最后32位，大多数情况下，Math.imul(a, b)与a * b的结果是相同的，即该方法等同于(a * b)|0的效果（超过32位的部分溢出）。之所以需要部署这个方法，是因为JavaScript有精度限制，超过2的53次方的值无法精确表示。这就是说，对于那些很大的数的乘法，低位数值往往都是不精确的，Math.imul方法可以返回正确的低位数值。
		
		(0x7fffffff * 0x7fffffff)|0 // 0
		上面这个乘法算式，返回结果为0。但是由于这两个二进制数的最低位都是1，所以这个结果肯定是不正确的，因为根据二进制乘法，计算结果的二进制最低位应该也是1。这个错误就是因为它们的乘积超过了2的53次方，JavaScript无法保存额外的精度，就把低位的值都变成了0。Math.imul方法可以返回正确的值1。
		
		Math.imul(0x7fffffff, 0x7fffffff) // 1
	(6)Math.fround()
		Math.fround方法返回一个数的单精度浮点数形式。

		Math.fround(0)     // 0
		Math.fround(1)     // 1
		Math.fround(1.337) // 1.3370000123977661
		Math.fround(1.5)   // 1.5
		Math.fround(NaN)   // NaN
		对于整数来说，Math.fround方法返回结果不会有任何不同，区别主要是那些无法用64个二进制位精确表示的小数。这时，Math.fround方法会返回最接近这个小数的单精度浮点数。
		
		对于没有部署这个方法的环境，可以用下面的代码模拟。
		
		Math.fround = Math.fround || function(x) {
		  return new Float32Array([x])[0];
		};
	(7)Math.hypot()
		Math.hypot方法返回所有参数的平方和的平方根。

		Math.hypot(3, 4);        // 5
		Math.hypot(3, 4, 5);     // 7.0710678118654755
		Math.hypot();            // 0
		Math.hypot(NaN);         // NaN
		Math.hypot(3, 4, 'foo'); // NaN
		Math.hypot(3, 4, '5');   // 7.0710678118654755
		Math.hypot(-3);          // 3
		上面代码中，3的平方加上4的平方，等于5的平方。
		
		如果参数不是数值，Math.hypot方法会将其转为数值。只要有一个参数无法转为数值，就会返回NaN。
8.三角函数方法

	ES6新增了6个三角函数方法。
	
	Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
	Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
	Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
	Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
	Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
	Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）
9.Math.signbit()
	Math.sign()用来判断一个值的正负，但是如果参数是-0，它会返回-0。

	Math.sign(-0) // -0
	这导致对于判断符号位的正负，Math.sign()不是很有用。JavaScript 内部使用64位浮点数（国际标准IEEE 754）表示数值，IEEE 754规定第一位是符号位，0表示正数，1表示负数。所以会有两种零，+0是符号位为0时的零值，-0是符号位为1时的零值。实际编程中，判断一个值是+0还是-0非常麻烦，因为它们是相等的。
	
	+0 === -0 // true
	目前，有一个提案，引入了Math.signbit()方法判断一个数的符号位是否设置了。
	
	Math.signbit(2) //false
	Math.signbit(-2) //true
	Math.signbit(0) //false
	Math.signbit(-0) //true
	可以看到，该方法正确返回了-0的符号位是设置了的。
	
	该方法的算法如下。
	
	如果参数是NaN，返回false
	如果参数是-0，返回true
	如果参数是负值，返回true
	其他情况返回false
10.指数运算符

	ES2016 新增了一个指数运算符（**）。

	2 ** 2 // 4
	2 ** 3 // 8
	指数运算符可以与等号结合，形成一个新的赋值运算符（**=）。
	
	let a = 1.5;
	a **= 2;
	// 等同于 a = a * a;
	
	let b = 4;
	b **= 3;
	// 等同于 b = b * b * b;
	注意，在 V8 引擎中，指数运算符与Math.pow的实现不相同，对于特别大的运算结果，两者会有细微的差异。
	
	Math.pow(99, 99)
	// 3.697296376497263e+197
	
	99 ** 99
	// 3.697296376497268e+197
	上面代码中，两个运算结果的最后一位有效数字是有差异的。







