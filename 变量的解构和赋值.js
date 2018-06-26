在ES6中按照一定的模式,从数组和对象中提取值,对变量进行赋值,被称为解构,
我们之前使用的给变量赋值方式是这样:
let a = 1;
let b = [];
在ES6中允许写成这样:
let [a,b] = [1,[]];
这就是说,可以从数组中提取值,按照对应位置,对变量赋值;
这种写法也就是模式匹配,只要等号两边的模式相同,左边的变量就会被赋予对应的值,如果结构不成功的话就是undefined.constructor
let [a, b] = [1];
//b  undefined
如果等号两边的模式不相等(右边的模式不等于左边的模式,就是等号右边不是可遍历的结构,也就是具有Iterator接口),那么就会报错:
let [a] = 0;

1.解构允许设置默认值.
let [a=0,b][,1];
a//0
注意:ES6内部严格使用相等运算符(===),判断一个位置是否有值,所以,如果一个数组成员不严格等于undefined,默认值就不会生效.例如:
let [x = 1] = [null];
x // null
需要提醒的是:默认值可以引用解构赋值的其他变量,前提是被引用的变量必须是已经声明的,例如:
let [x = 1, y = x] = [];     // x=1; y=1
let [x = y, y = 1] = [];     // ReferenceError

2.对象的解构赋值.
解构也可以用于对象.例如:
let { foo, bar } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: "aaa", bar: "bbb" };
baz // undefined
如果变量名和属性名不一致,必须这样使用:
var { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'


3.字符串的解构赋值.
之所以字符串也可以解构赋值,这是因为此时,字符串会被转换成一个类似数组的对象.
例如:
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

4.数值和布尔值的解构赋值.
let {toString: s} = 123;
s === Number.prototype.toString // true


let {toString: s} = true;
s === Boolean.prototype.toString // true

解构赋值的规则是:只要等号右边的值不是数组或者对象,就先将其转换为对象,由于undefined和null无法转换为对象,所以对它们解构赋值的时候就会报错.

5.函数参数的解构赋值.
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]

学习了这么多,上面两种的区别是什么呢?
前者:如果没有传参数,指定默认值是x=0和y=0;如果传了个空的{},就触发了undefined,所以就是默认值,如果传值为空那么也会触发默认值.
后者:如果没有传参数,指定的默认值是{x:0,y:0};如果穿了个空的{},那么x= undefined;y=undefined;如果传值为空,那么触发undefined,使用默认值{x:0,y:0}.



6.一些解构赋值的常规用法:
 (1)交换变量的值.
  let x = 1;
	let y = 2;
	[x, y] = [y, x];
 (2)函数中返回多个值.
	// 返回一个数组
	
	function example() {
	  return [1, 2, 3];
	}
	let [a, b, c] = example();
	
	// 返回一个对象
	
	function example() {
	  return {
	    foo: 1,
	    bar: 2
	  };
	}
	let { foo, bar } = example();
	(3)函数参数的定义.
	    解构赋值可以方便地将一组参数与变量名对应起来。
	
		// 参数是一组有次序的值
		function f([x, y, z]) { ... }
		f([1, 2, 3]);
		
		// 参数是一组无次序的值
		function f({x, y, z}) { ... }
		f({z: 3, y: 2, x: 1});
	(4)提取JSON数据.
		解构赋值对提取JSON对象中的数据，尤其有用。
		let jsonData = {
		  id: 42,
		  status: "OK",
		  data: [867, 5309]
		};
		
		let { id, status, data: number } = jsonData;
		
		console.log(id, status, number);
		// 42, "OK", [867, 5309]
  (5)函数参数的默认值.
     jQuery.ajax = function (url, {
			  async = true,
			  beforeSend = function () {},
			  cache = true,
			  complete = function () {},
			  crossDomain = false,
			  global = true,
			  // ... more config
			}) {
			  // ... do stuff
			};
			指定参数的默认值，就避免了在函数体内部再写var foo = config.foo || 'default foo';这样的语句。
  (6)遍历Map结构.
  		任何部署了Iterator接口的对象，都可以用for...of循环遍历。Map结构原生支持Iterator接口，配合变量的解构赋值，获取键名和键值就非常方便。

			var map = new Map();
			map.set('first', 'hello');
			map.set('second', 'world');
			
			for (let [key, value] of map) {
			  console.log(key + " is " + value);
			}
			// first is hello
			// second is world
			如果只想获取键名，或者只想获取键值，可以写成下面这样。
			
			// 获取键名
			for (let [key] of map) {
			  // ...
			}
			
			// 获取键值
			for (let [,value] of map) {
			  // ...
			}






















































