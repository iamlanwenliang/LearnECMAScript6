在ES6中加强了对Unicode的支持,并对字符串对象进行了扩展.
平时的开发中对这种使用的较少这里就不介绍了,主要学习一些常用操作.
1.codePointAt()
	JavaScript内部，字符以UTF-16的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode码点大于0xFFFF的字符），JavaScript会认为它们是两个字符。
	var s = "“”";

	s.length // 2
	s.charAt(0) // ''
	s.charAt(1) // ''
	s.charCodeAt(0) // 55362
	s.charCodeAt(1) // 57271
	上面代码中，汉字“”（注意，这个字不是”吉祥“的”吉“）的码点是0x20BB7，UTF-16编码为0xD842 0xDFB7（十进制为55362 57271），需要4个字节储存。对于这种4个字节的字符，JavaScript不能正确处理，字符串长度会误判为2，而且charAt方法无法读取整个字符，charCodeAt方法只能分别返回前两个字节和后两个字节的值。
	ES6提供了codePointAt方法，能够正确处理4个字节储存的字符，返回一个字符的码点.
	var s = 'a';
	
	s.codePointAt(0) // 134071
	s.codePointAt(1) // 57271
	
	s.codePointAt(2) // 97
	codePointAt方法的参数，是字符在字符串中的位置（从0开始）。上面代码中，JavaScript将“a”视为三个字符，codePointAt方法在第一个字符上，正确地识别了“”，返回了它的十进制码点134071（即十六进制的20BB7）。在第二个字符（即“”的后两个字节）和第三个字符“a”上，codePointAt方法的结果与charCodeAt方法相同。
	总之，codePointAt方法会正确返回32位的UTF-16字符的码点。对于那些两个字节储存的常规字符，它的返回结果与charCodeAt方法相同。
	
	codePointAt方法返回的是码点的十进制值，如果想要十六进制的值，可以使用toString方法转换一下。
	
	var s = 'a';
	
	s.codePointAt(0).toString(16) // "20bb7"
	s.codePointAt(2).toString(16) // "61"
	你可能注意到了，codePointAt方法的参数，仍然是不正确的。比如，上面代码中，字符a在字符串s的正确位置序号应该是1，但是必须向codePointAt方法传入2。解决这个问题的一个办法是使用for...of循环，因为它会正确识别32位的UTF-16字符。
	
	var s = 'a';
	for (let ch of s) {
	  console.log(ch.codePointAt(0).toString(16));
	}
	// 20bb7
	// 61
	codePointAt方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。
	
	function is32Bit(c) {
	  return c.codePointAt(0) > 0xFFFF;
	}
	
	is32Bit("") // true
	is32Bit("a") // false
2.字符串的遍历器接口.
	ES6为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被for...of循环遍历。

	for (let codePoint of 'foo') {
	  console.log(codePoint)
	}
	// "f"
	// "o"
	// "o"
	除了遍历字符串，这个遍历器最大的优点是可以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点。
	
	var text = String.fromCodePoint(0x20BB7);
	
	for (let i = 0; i < text.length; i++) {
	  console.log(text[i]);
	}
	// " "
	// " "
	
	for (let i of text) {
	  console.log(i);
	}
	// ""
	上面代码中，字符串text只有一个字符，但是for循环会认为它包含两个字符（都不可打印），而for...of循环会正确识别出这一个字符。

3.at().
	ES5对字符串对象提供charAt方法，返回字符串给定位置的字符。该方法不能识别码点大于0xFFFF的字符。

	'abc'.charAt(0) // "a"
	''.charAt(0) // "\uD842"
	上面代码中，charAt方法返回的是UTF-16编码的第一个字节，实际上是无法显示的。
	
	目前，有一个提案，提出字符串实例的at方法，可以识别Unicode编号大于0xFFFF的字符，返回正确的字符。
	
	'abc'.at(0) // "a"
	''.at(0) // ""
4.includes(), startsWith(), endsWith().
	传统上，JavaScript只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6又提供了三种新方法。

	includes()：返回布尔值，表示是否找到了参数字符串。
	startsWith()：返回布尔值，表示参数字符串是否在源字符串的头部。
	endsWith()：返回布尔值，表示参数字符串是否在源字符串的尾部。
	var s = 'Hello world!';
	
	s.startsWith('Hello') // true
	s.endsWith('!') // true
	s.includes('o') // true
	这三个方法都支持第二个参数，表示开始搜索的位置。
	
	var s = 'Hello world!';
	
	s.startsWith('world', 6) // true
	s.endsWith('Hello', 5) // true
	s.includes('Hello', 6) // false
	上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。
5.repeat().

	repeat方法返回一个新字符串，表示将原字符串重复n次。

	'x'.repeat(3) // "xxx"
	'hello'.repeat(2) // "hellohello"
	'na'.repeat(0) // ""
	参数如果是小数，会被取整。
	
	'na'.repeat(2.9) // "nana"
	如果repeat的参数是负数或者Infinity，会报错。
	
	'na'.repeat(Infinity)
	// RangeError
	'na'.repeat(-1)
	// RangeError
	但是，如果参数是0到-1之间的小数，则等同于0，这是因为会先进行取整运算。0到-1之间的小数，取整以后等于-0，repeat视同为0。
	
	'na'.repeat(-0.9) // ""
	参数NaN等同于0。
	
	'na'.repeat(NaN) // ""
	如果repeat的参数是字符串，则会先转换成数字。
	
	'na'.repeat('na') // ""
	'na'.repeat('3') // "nanana"
6.padStart()，padEnd().
	ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
	
	'x'.padStart(5, 'ab') // 'ababx'
	'x'.padStart(4, 'ab') // 'abax'
	
	'x'.padEnd(5, 'ab') // 'xabab'
	'x'.padEnd(4, 'ab') // 'xaba'
	上面代码中，padStart和padEnd一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。
	
	如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串。
	
	'xxx'.padStart(2, 'ab') // 'xxx'
	'xxx'.padEnd(2, 'ab') // 'xxx'
	如果用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串。
	
	'abc'.padStart(10, '0123456789')
	// '0123456abc'
	如果省略第二个参数，默认使用空格补全长度。
	
	'x'.padStart(4) // '   x'
	'x'.padEnd(4) // 'x   '
	padStart的常见用途是为数值补全指定位数。下面代码生成10位的数值字符串。
	
	'1'.padStart(10, '0') // "0000000001"
	'12'.padStart(10, '0') // "0000000012"
	'123456'.padStart(10, '0') // "0000123456"
	另一个用途是提示字符串格式。
	
	'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
	'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
	
7.模板字符串(个人觉得在开发中应该是很常用的).
	传统的JavaScript语言，输出模板通常是这样写的。

	$('#result').append(
	  'There are <b>' + basket.count + '</b> ' +
	  'items in your basket, ' +
	  '<em>' + basket.onSale +
	  '</em> are on sale!'
	);
	上面这种写法相当繁琐不方便，ES6引入了模板字符串解决这个问题。
	
	$('#result').append(`
	  There are <b>${basket.count}</b> items
	   in your basket, <em>${basket.onSale}</em>
	  are on sale!
	`);
	模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。
	
	// 普通字符串
	`In JavaScript '\n' is a line-feed.`
	
	// 多行字符串
	`In JavaScript this is
	 not legal.`
	
	console.log(`string text line 1
	string text line 2`);
	
	// 字符串中嵌入变量
	var name = "Bob", time = "today";
	`Hello ${name}, how are you ${time}?`
	上面代码中的模板字符串，都是用反引号表示。如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。
	
	var greeting = `\`Yo\` World!`;
	如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。
	
	$('#list').html(`
	<ul>
	  <li>first</li>
	  <li>second</li>
	</ul>
	`);
	上面代码中，所有模板字符串的空格和换行，都是被保留的，比如<ul>标签前面会有一个换行。如果你不想要这个换行，可以使用trim方法消除它。
	
	$('#list').html(`
	<ul>
	  <li>first</li>
	  <li>second</li>
	</ul>
	`.trim());
	模板字符串中嵌入变量，需要将变量名写在${}之中。
	
	function authorize(user, action) {
	  if (!user.hasPrivilege(action)) {
	    throw new Error(
	      // 传统写法为
	      // 'User '
	      // + user.name
	      // + ' is not authorized to do '
	      // + action
	      // + '.'
	      `User ${user.name} is not authorized to do ${action}.`);
	  }
	}
	大括号内部可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性。
	
	var x = 1;
	var y = 2;
	
	`${x} + ${y} = ${x + y}`
	// "1 + 2 = 3"
	
	`${x} + ${y * 2} = ${x + y * 2}`
	// "1 + 4 = 5"
	
	var obj = {x: 1, y: 2};
	`${obj.x + obj.y}`
	// 3
	模板字符串之中还能调用函数。
	
	function fn() {
	  return "Hello World";
	}
	
	`foo ${fn()} bar`
	// foo Hello World bar
	如果大括号中的值不是字符串，将按照一般的规则转为字符串。比如，大括号中是一个对象，将默认调用对象的toString方法。
	
	如果模板字符串中的变量没有声明，将报错。
	
	// 变量place没有声明
	var msg = `Hello, ${place}`;
	// 报错
	由于模板字符串的大括号内部，就是执行JavaScript代码，因此如果大括号内部是一个字符串，将会原样输出。
	
	`Hello ${'World'}`
	// "Hello World"
	模板字符串甚至还能嵌套。
	
	const tmpl = addrs => `
	  <table>
	  ${addrs.map(addr => `
	    <tr><td>${addr.first}</td></tr>
	    <tr><td>${addr.last}</td></tr>
	  `).join('')}
	  </table>
	`;
	上面代码中，模板字符串的变量之中，又嵌入了另一个模板字符串，使用方法如下。
	
	const data = [
	    { first: '<Jane>', last: 'Bond' },
	    { first: 'Lars', last: '<Croft>' },
	];
	
	console.log(tmpl(data));
	// <table>
	//
	//   <tr><td><Jane></td></tr>
	//   <tr><td>Bond</td></tr>
	//
	//   <tr><td>Lars</td></tr>
	//   <tr><td><Croft></td></tr>
	//
	// </table>
	如果需要引用模板字符串本身，在需要时执行，可以像下面这样写。
	
	// 写法一
	let str = 'return ' + '`Hello ${name}!`';
	let func = new Function('name', str);
	func('Jack') // "Hello Jack!"
	
	// 写法二
	let str = '(name) => `Hello ${name}!`';
	let func = eval.call(null, str);
	func('Jack') // "Hello Jack!"
8.标签模板.
	模板字符串的功能，不仅仅是上面这些。它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。这被称为“标签模板”功能（tagged template）。

	alert`123`
	// 等同于
	alert(123)
	标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的就是函数，紧跟在后面的模板字符串就是它的参数。
	
	但是，如果模板字符里面有变量，就不是简单的调用了，而是会将模板字符串先处理成多个参数，再调用函数。
	
	var a = 5;
	var b = 10;
	
	tag`Hello ${ a + b } world ${ a * b }`;
	// 等同于
	tag(['Hello ', ' world ', ''], 15, 50);
	上面代码中，模板字符串前面有一个标识名tag，它是一个函数。整个表达式的返回值，就是tag函数处理模板字符串后的返回值。
	
	函数tag依次会接收到多个参数。
	
	function tag(stringArr, value1, value2){
	  // ...
	}
	// 等同于

	function tag(stringArr, ...values){
	  // ...
	}
	tag函数的第一个参数是一个数组，该数组的成员是模板字符串中那些没有变量替换的部分，也就是说，变量替换只发生在数组的第一个成员与第二个成员之间、第二个成员与第三个成员之间，以此类推。
	
	tag函数的其他参数，都是模板字符串各个变量被替换后的值。由于本例中，模板字符串含有两个变量，因此tag会接受到value1和value2两个参数。
	
	tag函数所有参数的实际值如下。
	
	第一个参数：['Hello ', ' world ', '']
	第二个参数: 15
	第三个参数：50
	也就是说，tag函数实际上以下面的形式调用。
	
	tag(['Hello ', ' world ', ''], 15, 50)
	我们可以按照需要编写tag函数的代码。下面是tag函数的一种写法，以及运行结果。
	
	var a = 5;
	var b = 10;
	
	function tag(s, v1, v2) {
	  console.log(s[0]);
	  console.log(s[1]);
	  console.log(s[2]);
	  console.log(v1);
	  console.log(v2);
	
	  return "OK";
	}
	
	tag`Hello ${ a + b } world ${ a * b}`;
	// "Hello "
	// " world "
	// ""
	// 15
	// 50
	// "OK"
9.String.raw().
	ES6还为原生的String对象，提供了一个raw方法。

	String.raw方法，往往用来充当模板字符串的处理函数，返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，对应于替换变量后的模板字符串。
	
	String.raw`Hi\n${2+3}!`;
	// "Hi\\n5!"
	
	String.raw`Hi\u000A!`;
	// 'Hi\\u000A!'
	如果原字符串的斜杠已经转义，那么String.raw不会做任何处理。
	
	String.raw`Hi\\n`
	// "Hi\\n"
	String.raw的代码基本如下。
	
	String.raw = function (strings, ...values) {
	  var output = "";
	  for (var index = 0; index < values.length; index++) {
	    output += strings.raw[index] + values[index];
	  }
	
	  output += strings.raw[index]
	  return output;
	}
	String.raw方法可以作为处理模板字符串的基本方法，它会将所有变量替换，而且对斜杠进行转义，方便下一步作为字符串来使用。
	
	String.raw方法也可以作为正常的函数使用。这时，它的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该是一个数组。
	
	String.raw({ raw: 'test' }, 0, 1, 2);
	// 't0e1s2t'
	
	// 等同于
	String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);































