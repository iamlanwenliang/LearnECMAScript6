
在 ES6里面新增了let命令，用法类似于var,但是作用域与var不同，值在所声明代码块内部有效。
    
  举个栗子：
  for(var i=0;i<10;i++){
  	console.log(i);
  }
  console.log(i)//输出10   ReferenceError: i is not defined
  
  for(let i=0;i<10;i++){
  	console.log(i);
  }
  console.log(i)//  ReferenceError: i is not defined
  
let和var的区别主要有这几个:
1.let 不会发生变量提升,var会.
2.let 会存在暂时性死区,var不会.(也就是说,只要在块级作用域内存在let命令,它所声明的变量就被绑定到这个区域,不再受外部影响了)
举个栗子:
var a = 123;
if (true) {
  a = 'abc'; // ReferenceError
  let a;
}
上面代码中,a是全局变量,但是块级作用域内又声明了一个局部变量a,这就会导致后面的这个a被绑定到这个块级作用域,所以在let声明变量前,对于a的赋值就会报错,在SE6中明确规定,如果存在let和const命令,这个区块对这些命令声明的变量,从开始就会形成封闭的作用域,凡是在声明之前使用就会报错.也就是说,在代码块内,使用let命令声明变量之前,该变量都是不可用的,这在语法上称为"暂时性死区"(temporal dead zone,简称TDZ).
3.let声明的变量不允许重复声明,举个栗子:
let不允许在相同作用域内，重复声明同一个变量。

// 报错
function () {
  let a = 10;
  var a = 1;
}

// 报错
function () {
  let a = 10;
  let a = 1;
}
function func(arg) {
  let arg; // 报错
}

function func(arg) {
  {
    let arg; // 不报错
  }
}

const命令和var的使用也类似,不过const的声明必须初始化,并且不能修改,也就是说一旦声明,常量的值就不能改变.
举个栗子:
const a = 1;
a = 2;//TypeError: Assignment to constant variable.
const b;
// SyntaxError: Missing initializer in const declaration

const 的作用域和let相同,只在声明所在的块级作用域内部有效.不会有变量提升,存在暂时性死区,只能在声明之后使用.

const保证的实际上是变量指向的那个内存地址不得改动,并不是变量的值不变,对于简单的数据类型来说,值就会保存在变量指向的那个内存地址,所以等同于常量,对于复合类型的数据结构来说,变量指向的内存地址,保存的只是一个指针,const能保证这个指针是固定的,至于它指向的数据结构是不是可变的就完全不能控制了,所以在声明的时候注意使用场景,例如:
const foo = {};
// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
如果需要对象不变,则可以使用对象API Object.freeze将其冻结,具体使用后面会介绍到.
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
