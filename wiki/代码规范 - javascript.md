# javascript 小程序代码规范


> A quality conscious and organic JavaScript quality guide
> 一个质量意识和有机 JavaScript 质量指南

This style guide aims to provide the ground rules for an application's
JavaScript code, such that it's highly readable and consistent across different
developers on a team. The focus is put on quality and coherence across
the different pieces of your application.
>这种风格指南的目的是提供一个应用程序的 JavaScript 代码的规则，
使得它具有很强的可读性和一致性在不同的开发团队。重点放在质量和连贯性在不同的应用程序块。

## Goal 目标

These suggestions aren't set in stone, they aim to provide a baseline you
can use in order to write more consistent codebases. To maximize effectiveness,
share the styleguide among your co-workers and attempt to enforce it.
Don't become obsessed about code style, as it'd be fruitless and
counterproductive. Try and find the sweet spot that makes everyone in the team
comfortable developing for your codebase, while not feeling frustrated
that their code always fails automated style checking because they added
a single space where they weren't supposed to. It's a thin line,
but since it's a very personal line I'll leave it to you to do the drawing.

> 这些建议并不是一成不变的，他们的目标是提供一个基线可以使用为了写出更一致的代码库。
发挥最大的效益，分享你的同事试图执行它在风格。不要迷恋代码风格，因为它会毫无结果和适得其反。
试着找到甜蜜点，使你的代码库开发团队舒适每个人，而不是感到沮丧，他们的代码总是不能自动化的
方式检查因为他们加入了一个空间，他们不应该。


## Modules 模块

This style guide assumes you're using a module system such as CommonJS, AMD,
ES6 Modules, or any other kind of module system.
Modules systems provide individual scoping, avoid leaks to the global object,
and improve code base organization by automating dependency graph generation,
instead of having to resort to manually creating multiple
**script** tags.

> 这种风格指南假设你使用一个模块系统如 CommonJS、AMD、ES6 模块，或任何其他类型的模块系统。
模块系统提供个人的范围，避免泄漏的全局对象，并通过自动化依赖图的生成提高代码的基地组织，
而不是采取手动创建多个<脚本>标签。


Module systems also provide us with dependency injection patterns, which are
crucial when it comes to testing individual components in isolation.
>模块系统还为我们提供了依赖注入模式，这是至关重要的，当涉及到测试单个组件的隔离。

## Strict Mode 严格模式
Always put 'use strict'; at the top of your modules. Strict mode allows you to
catch nonsensical behavior, discourages poor practices, and is faster because
it allows compilers to make certain assumptions about your code.
>总是把 "use strict"，在你的模块的顶部。严格的模式允许你抓的荒谬行为，抑制不良行为，
是因为它允许编译器更快的使你的代码的某些假设。

## Spacing 空格
Spacing must be consistent across every file in the application. To this end,
using something like .editorconfig configuration files is highly encouraged.
Here are the defaults I suggest to get started with JavaScript indentation.
>间隔必须在应用程序中的每个文件一致.。为此，使用类似editorconfig配置文件是高度鼓励。
这是默认我建议开始使用 JavaScript 的压痕。


```
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

```

Settling for either tabs or spaces is up to the particularities of a project,
but I recommend using 2 spaces for indentation. The .editorconfig file can
take care of that for us and everyone would be able to create the correct
spacing by pressing the tab key.
> 无论是制表符或空格的解决是项目的特殊性，但我建议使用 2 空格缩进. **.editorconfig**
文件可以为我们每个人照顾，可以通过按 Tab 键创建正确的间距。


Spacing doesn't just entail tabbing, but also the spaces before, after,
and in between arguments of a function declaration. This kind of spacing is
typically highly irrelevant to get right, and it'll be hard for most teams to
even arrive at a scheme that will satisfy everyone.

> 间隔不只是需要标志，也是空间之前，之后，在一个函数声明的参数之间的关系。
这种间距通常是高度无关的，以获得正确的，这将是很难对大多数球队甚至到达一个计划，
将满足每个人。

```javascript
// 写法
function () {}
```
```javascript
function( a, b ){}

```
```javascript
function(a, b) {}

function (a,b) {}


```

Try to keep these differences to a minimum, but don't put much thought to it
 either.
Where possible, improve readability by keeping lines below the 80-character
mark.
> 每行保持80个字符

## Semicolons **;** 分号
The majority of JavaScript programmers prefer using semicolons. This choice
is done to avoid potential issues with Automatic Semicolon Insertion (ASI).
If you decide against using semicolons, make sure you understand the ASI rules.

>JavaScript的大多数程序员喜欢使用分号。这个选择是为了避免自动分号的潜在问题（ASI）。
如果你决定不使用分号，确保你了解ASI规则。
Regardless of your choice, a linter should be used to catch unnecessary or
unintentional semicolons.

> 在小程序里面,在每行结束的时候我们要强制加**;**
```javascript
    // 每行结束要强制加; 小程序官方文档是没有加的.
    var str = '';
    var arr = null;
```

## Linting

用于检测js.这个不是一些规则。在这里需要了解一下。如何才能写好一些js

## Strings 字符串

Strings should always be quoted using the same quotation mark. Use ' or "
consistently throughout your codebase. Ensure the team is using the same
quotation mark in every portion of JavaScript that's authored.
> 字符串应始终引用相同的引号。使用“或”始终贯穿在你的代码库。确保团队使用相同的引号在
JavaScript的每部分的撰写。

### bad 坏
```javascript
var message = 'oh hai ' + name + "!";
```
### Good 好 在小程序里我们使用这种
```javascript
var message = 'oh hai ' + name + '!';
```
### Better 更好
```javascript
var message = util.format('oh hai %s!', name);

function format () {
  var args = [].slice.call(arguments);
  var initial = args.shift();

  function replacer (text, replacement) {
    return text.replace('%s', replacement);
  }
  return args.reduce(replacer, initial);
}
```
 To declare multi-line strings, particularly when talking about HTML
 snippets, it's sometimes best to use an array as a buffer and then join
 its parts. The string concatenating style may be faster but it's also much
 harder to keep track of.
>申报多行字符串，尤其是当谈论HTML片段，有时最好使用一个数组作为缓冲，然后加入部分。
字符串串联方式可能更快也更难追踪。


```javascript
    var html = [
      '<div>',
        format('<span class="monster">%s</span>', name),
      '</div>'
    ].join('');

```

## Variable Declaration 变量声明
Always declare variables in a consistent manner, and at the top of their scope.
Keeping variable declarations to one per line is encouraged. Comma-first,
a single var statement, multiple var statements, it's all fine, just be
consistent across the project, and ensure the team is on the same page.

>始终以一致的方式声明变量，并在其作用域的顶部声明变量.。鼓励变量声明到每行。逗号优先，
一个 var 语句，多个 var 语句，都很好，只是在整个项目中保持一致，并确保团队处于同一页上.


### 不能这样写

```javascript
var foo = 1,
    bar = 2;

var baz;
var pony;

var a
  , b;

```

```javascript
var foo = 1;

if (foo > 1) {
  var bar = 2;
}

```


### 项目中变量命名规则

```javascript
var cityArr = ['上海','北京'];
var city = '上海';

var multiCity = '上海,北京';

// 临时变量
var tmp = '';
var tmpArr = [];
var tmpCity = '';

```



### 这样写才是正确的
Just because they're consistent with each other, not because of the style
> 只是因为他们是一致的，而不是因为风格ls

```javascript
var foo = 1;
var bar = 2;

var baz;
var pony;

var a;
var b;

```
```javascript
var foo = 1;
var bar;

if (foo > 1) {
  bar = 2;
}

```
Variable declarations that aren't immediately assigned a value are acceptable
to share the same line of code.

> 不立即赋值的变量声明可以共享同一行代码.。

Acceptable  可接受的
```javascript
var a = 'a';
var b = 2;
var i, j;

```

## Conditionals 条件句
Brackets are enforced. This, together with a reasonable spacing strategy
will help you avoid mistakes such as Apple's SSL/TLS bug.
> 执行括号。这，连同一个合理间距的策略将帮助你避免错误，如苹果的SSL / TLS的bug。

### Bad  坏
```javascript
if (err) throw err;
```

### Good 好

```javascript
if (err) { throw err; }
```

It's even better if you avoid keeping conditionals on a single line,
for the sake of text comprehension.

> 如果你避免一行的条件更好，对语篇理解的缘故。

### Better  更好

```javascript
if (err) {
  throw err;
}
```
## Equality 平等

Avoid using **==** and **!=** operators, always
favor **===** and **!==** . These operators
are called the "strict equality operators,"
while their counterparts will attempt to cast the
operands into the same value type.

> 避免使用 **==** 和 **!=** 操作符，总是有利于 **==** 和 **!==** 。
这些运算符称为"严格相等运算符"，而它们的运算符则试图将操作数转换为相同的值类型.。

### Bad 坏
```javascript
function isEmptyString (text) {
  return text == '';
}

isEmptyString(0);
// <- true

```
### Good 好的写法
```javascript
function isEmptyString (text) {
  return text === '';
}

isEmptyString(0);
// <- false
```

## Ternary Operators 三目运算符号

Ternary operators are fine for clear-cut conditionals, but unacceptable for
confusing choices. As a rule, if you can't eye-parse it as fast as your brain
can interpret the text that declares the ternary operator, chances are it's
probably too complicated for its own good.
> 三元算子的明确的条件是好的，但不能接受混乱的选择。作为一个规则，
如果你不能眼睛解析它的速度快，你的大脑可以解释声明三元运算符的文本，很可能是它本身太复杂。

## Bad 坏的写法
```javascript
function calculate (a, b) {
  return a && b ? 11 : a ? 10 : b ? 1 : 0;
}

```

## Good 好的写法
```javascript
function getName (mobile) {
  return mobile ? mobile.name : 'Generic Player';
}
```
In cases that may prove confusing just use if and else statements instead.
> 在可能被证明混淆的情况下，只是使用if和其他语句代替。

## Functions 方法

When declaring a function, always use the function declaration form instead of
function expressions. Because hoisting.
> 声明函数时，总是使用函数声明形式，而不是函数表达式.。因为吊装。

### bad 坏的写法
```javascript
var sum = function (x, y) {
  return x + y;
};
```
### Good 好的写法
```javascript
function sum (x, y) {
  return x + y;
}
```
That being said, there's nothing wrong with function expressions that are
just currying another function.

> 也就是说，里面的函数表达式，只是讨好的另一个功能没有错。

### Good
```javascript
var plusThree = sum.bind(null, 3);

```
Keep in mind that function declarations will be hoisted to the top of
the scope so it doesn't matter the order they are declared in. That being said,
you should always keep functions at the top level in a scope, and avoid
placing them inside conditional statements.
> 请记住，函数声明将被提升到范围的顶部，所以它们声明的顺序无关紧要.。也就是说，
您应该始终保持函数在一个作用域的顶层，并且避免将它们置于条件语句中.。

### Bad 坏的写法
```javascript
if (Math.random() > 0.5) {
  sum(1, 3);

  function sum (x, y) {
    return x + y;
  }
}

```
### Good 好的写法

第一种
```javascript
if (Math.random() > 0.5) {
  sum(1, 3);
}

function sum (x, y) {
  return x + y;
}
```
第二种
```javascript
function sum (x, y) {
  return x + y;
}

if (Math.random() > 0.5) {
  sum(1, 3);
}
```

If you need a "no-op" method you can use either **Function.prototype**,
or **function noop () {}**. Ideally a single reference to **noop** is
used throughout the application.
Whenever you have to manipulate an array-like object, cast it to an array.

> 如果你需要一个你可以使用 **function.prototype no-op** 方法或函数
 **NOOP（）{ }** 。理想情况下，空单参考是在整个应用程序中使用。
每当你要处理一个数组对象时，把它丢到一个数组中.。


### Bad  不好的写法
```javascript
var divs = document.querySelectorAll('div');

for (i = 0; i < divs.length; i++) {
  console.log(divs[i].innerHTML);
}
```
### Good 好的写法
```javascript
var divs = document.querySelectorAll('div');

[].slice.call(divs).forEach(function (div) {
  console.log(div.innerHTML);
});
```
However, be aware that there is a substantial performance hit in V8
environments when using this approach on arguments. If performance is a
major concern, avoid casting arguments with slice and instead use a for loop.

> 然而，要知道有一个显着的性能达到V8环境中使用这种方法时对参数。如果性能是一个主要问题，
避免用切片转换参数，而是使用for循环.。

### Bad

```javascript
var args = [].slice.call(arguments);
```
### Good
```javascript
var i;
var args = new Array(arguments.length);
for (i = 0; i < args.length; i++) {
    args[i] = arguments[i];
}

```
Don't declare functions inside of loops.
不要在循环内声明函数。

### Bad
```javascript
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function () {
    console.log(values[i]);
  }, 1000 * i);
}

```

```javascript
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function (i) {
    return function () {
      console.log(values[i]);
    };
  }(i), 1000 * i);
}

```

### Good
```javascript
<!--没有看明白-->
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function (i) {
    console.log(values[i]);
  }, 1000 * i, i);
}
```

```javascript
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  wait(i);
}

function wait (i) {
  setTimeout(function () {
    console.log(values[i]);
  }, 1000 * i);
}
```

Or even better, just use .forEach which doesn't have the same caveats as
declaring functions in for loops.

甚至更好，只是使用foreach，没有相同的警告声明函数在循环。

### Better 更好
```javascript
[1, 2, 3].forEach(function (value, i) {
  setTimeout(function () {
    console.log(value);
  }, 1000 * i);
});

```

Whenever a method is non-trivial, make the effort to use a named function
declaration rather than an anonymous function. This will make it easier to
pinpoint the root cause of an exception when analyzing stack traces.

> 每当方法非平凡时，努力使用命名函数声明而不是匿名函数.。这将使得在分析堆栈跟踪时更容易
找出异常的根本原因.。


### bad
```javascript
function once (fn) {
  var ran = false;
  return function () {
    if (ran) { return };
    ran = true;
    fn.apply(this, arguments);
  };
}
```
### Good
```javascript
function once (fn) {
  var ran = false;
  return function run () {
    if (ran) { return };
    ran = true;
    fn.apply(this, arguments);
  };
}

```

Avoid keeping indentation levels from raising more than necessary by using
guard clauses instead of flowing ifstatements.

> 避免通过使用保护子句而不是语句流来保持缩进级别以提高超过必要的水平.。

### Bad
```javascript
if (car) {
  if (black) {
    if (turbine) {
      return 'batman!';
    }
  }
}
```
```javascript
if (condition) {
  // 10+ lines of code
}

```

### Good

```javascript
if (!car) {
  return;
}
if (!black) {
  return;
}
if (!turbine) {
  return;
}
return 'batman!';
```

```javascript
if (!condition) {
  return;
}
// 10+ lines of code

```

## Prototypes 原型链

Hacking native prototypes should be avoided at all costs, use a method
instead. If you must extend the functionality in a native type, try using
something like poser instead.

> 黑客原生原型应避免不惜一切代价，用一种方法代替。如果你必须在原生型扩展功能，
尝试使用类似的难题而。

### Bad
```javascript
String.prototype.half = function () {
  return this.substr(0, this.length / 2);
};
```

### Good

```javascript
function half (text) {
  return text.substr(0, text.length / 2);
}
```
### Avoid prototypical inheritance models unless you have a very good
performance reason to justify yourself.

> 避免典型的继承模式，除非你有一个很好的表现理由来证明自己。

	•	Prototypical inheritance boosts puts need for this through the roof
	•	It's way more verbose than using plain objects
	•	It causes headaches when creating new objects
	•	Needs a closure to hide valuable private state of instances
	•	Just use plain objects instead

>  	* 原型继承提高了需要通过屋顶
	 	* 这比使用普通的物体更详细
		* 创建新对象时会导致头痛
		* 需要关闭隐藏宝贵的私有状态的实例
		* 只使用普通的对象



## Regular Expressions  正则表达式
Keep regular expressions in variables, don't use them inline. This will
vastly improve readability.
> 在变量中保持正则表达式，不要内联。这将大大提高可读性。

### Bad
```javascript
if (/\d+/.test(text)) {
  console.log('so many numbers!');
}
```
### Good
```javascript
var numeric = /\d+/;
if (numeric.test(text)) {
  console.log('so many numbers!');
}
```
[正则学习网站](https://ponyfoo.com/articles/learn-regular-expressions)

## console statements 控制台的报表

Preferably bake console statements into a service that can easily be
disabled in production. Alternatively, don't ship any console.log printing
statements to production distributions.

>最好将控制台语句复制到可在生产中容易禁用的服务中.。另外，不运送任何console.log打印报表
生产分布。



## Comments 注释

Comments aren't meant to explain what the code does. Good code is supposed to
be self-explanatory. If you're thinking of writing a comment to explain what
 a piece of code does, chances are you need to change the code itself.
 The exception to that rule is explaining what a regular expression does.
 Good comments are supposed to explain why code does something that may not
 seem to have a clear-cut purpose.

> 注释不是用来解释代码是什么。好的代码应该是自我解释的。如果你想写一个注释来解释一段代码
是什么，那么你需要改变代码本身。该规则的例外是解释正则表达式是什么。好的评论应该解释
为什么代码做的事情似乎没有一个明确的目的。

### Bad
```javascript
// create the centered container
var p = $('<p/>');
p.center(div);
p.text('foo');
```
### Good
```javascript
var container = $('<p/>');
var contents = 'foo';
container.center(parent);
container.text(contents);
megaphone.on('data', function (value) {
  container.text(value); // the megaphone periodically emits updates for container
});

```

```javascript
var numeric = /\d+/; // one or more digits somewhere in the string
if (numeric.test(text)) {
  console.log('so many numbers!');
}

```

## Variable Naming 变量命名
Variables must have meaningful names so that you don't have to resort to
commenting what a piece of functionality does. Instead, try to be expressive
while succinct, and use meaningful variable names.

### Bad
```javascript
function a (x, y, z) {
  return z * y / x;
}
a(4, 2, 6);
// <- 3
```

### Good
```javascript
function ruleOfThree (had, got, have) {
  return have * got / had;
}
ruleOfThree(4, 2, 6);
// <- 3

```
## Everyday Tricks

Use || to define a default value. If the left-hand value is falsy then the
right-hand value will be used. Be advised, that because of loose type
comparison, inputs like false, 0, null or '' will be evaluated as falsy,
and converted to default value. For strict type checking use
**if (value === void 0) { value = defaultValue }**.

> 使用| |定义默认值。如果左边的值是falsy然后右边的值将被使用。注意，由于松散型的比较，
如输入错误，0，null或'将被评估为falsy
，并转换为默认值。如果使用了严格的类型检查（价值= = =无效0）{价值=默认值}。

```javascript
function a (value) {
  var defaultValue = 33;
  var used = value || defaultValue;
}
```

Use .bind to partially-apply functions.

> 绑定到部分应用函数。

```javascript
function sum (a, b) {
  return a + b;
}

var addSeven = sum.bind(null, 7);

addSeven(6);
// <- 13

```

Use Array.prototype.slice.call to cast array-like objects to true arrays.

```javascript
var args = Array.prototype.slice.call(arguments);
```

Use event emitters on all the things!
使用 **event emitters**
```javascript
var emitter = contra.emitter();

body.addEventListener('click', function () {
  emitter.emit('click', e.target);
});

emitter.on('click', function (elem) {
  console.log(elem);
});

// simulate click
emitter.emit('click', document.body);

```
Use Function() as a "no-op".
```javascript
function (cb) {
  setTimeout(cb || Function(), 2000);
}

```

## 各种情况下代码对比

 > 不同情况下对于代码质量的一种比对

### Performance 性能

Favor readability, correctness and expressiveness over performance.
JavaScript will basically never be your performance bottleneck.
Optimize things like image compression, network access and DOM reflows instead.
If you remember just one guideline from this document, choose this one.

> 有利于可读性、正确性和表现力。JavaScript 将永远是你的性能瓶颈。优化如图像压缩、
网络接入和 DOM 的回流而。如果你只记得一个指导方针从这个文件，选择这一个。

```javascript
// bad (albeit way faster)
const arr = [1, 2, 3, 4];
const len = arr.length;
var i = -1;
var result = [];
while (++i < len) {
  var n = arr[i];
  if (n % 2 > 0) continue;
  result.push(n * n);
}
```


```javascript

// good
const arr = [1, 2, 3, 4];
const isEven = n => n % 2 == 0;
const square = n => n * n;

const result = arr.filter(isEven).map(square);
```

### Statelessness

Try to keep your functions pure. All functions should ideally produce no
side-effects, use no outside data and return new objects instead of mutating
existing ones.


```javascript
// bad
const merge = (target, ...sources) => Object.assign(target, ...sources);
merge({ foo: "foo" }, { bar: "bar" }); // => { foo: "foo", bar: "bar" }

// good
const merge = (...sources) => Object.assign({}, ...sources);
merge({ foo: "foo" }, { bar: "bar" }); // => { foo: "foo", bar: "bar" }
```

### Natives 本地的

Rely on native methods as much as possible.
>尽可能依赖本土方法。

```javascript
// bad
const toArray = obj => [].slice.call(obj);

// good
const toArray = (() =>
  Array.from ? Array.from : obj => [].slice.call(obj)
)();
```

### 条件 (补充上面的条件的不足)

```javascript
// bad
var grade;
if (result < 50)
  grade = "bad";
else if (result < 90)
  grade = "good";
else
  grade = "excellent";

// good
const grade = (() => {
  if (result < 50)
    return "bad";
  if (result < 90)
    return "good";
  return "excellent";
})();
```


### Arguments 参数

```javascript
// bad
const sortNumbers = () =>
  Array.prototype.slice.call(arguments).sort();

// good
const sortNumbers = (...numbers) => numbers.sort();
```

### Apply 应用

```javascript
const greet = (first, last) => `Hi ${first} ${last}`;
const person = ["John", "Doe"];

// bad
greet.apply(null, person);

// good
greet(...person);

```

### Bind 绑定


```javascript
// bad
["foo", "bar"].forEach(func.bind(this));

// good
["foo", "bar"].forEach(func, this);
```

```javascript
// bad
const person = {
  first: "John",
  last: "Doe",
  greet() {
    const full = function() {
      return `${this.first} ${this.last}`;
    }.bind(this);
    return `Hello ${full()}`;
  }
}

// good
const person = {
  first: "John",
  last: "Doe",
  greet() {
    const full = () => `${this.first} ${this.last}`;
    return `Hello ${full()}`;
  }
}
```

### Readability  可读性

```javascript
// bad
foo || doSomething();

// good
if (!foo) doSomething();
```

```javascript
// bad
void function() { /* IIFE */ }();

// good
(function() { /* IIFE */ }());
```

```javascript
// bad
const n = ~~3.14;

// good
const n = Math.floor(3.14);
```


### Code reuse 代码重用

Don't be afraid of creating lots of small, highly composable and reusable
functions.

> 不要害怕创建很多小，高度的可组合性和可重用性的功能。

```javascript
// bad
arr[arr.length - 1];

// good
const first = arr => arr[0];
const last = arr => first(arr.slice(-1));
last(arr);
```

```javascript
// bad
const product = (a, b) => a * b;
const triple = n => n * 3;

// good
const product = (a, b) => a * b;
const triple = product.bind(null, 3);
```


### Dependencies 依赖

```javascript
// bad
var _ = require("underscore");
_.compact(["foo", 0]));
_.unique(["foo", "foo"]);
_.union(["foo"], ["bar"], ["foo"]);

// good
const compact = arr => arr.filter(el => el);
const unique = arr => [...Set(arr)];
const union = (...arr) => unique([].concat(...arr));

compact(["foo", 0]);
unique(["foo", "foo"]);
union(["foo"], ["bar"], ["foo"]);
```


### Objects as Maps 对象

While objects have legitimate use cases, maps are usually a better, more
powerful choice. When in doubt, use a Map.

> 虽然对象有合法的用例，地图通常是一个更好，更强大的选择。当在怀疑时，使用一个地图。

```javascript
// bad
const me = {
  name: "Ben",
  age: 30
};
var meSize = Object.keys(me).length;
meSize; // => 2
me.country = "Belgium";
meSize++;
meSize; // => 3

// good
const me = new Map();
me.set("name", "Ben");
me.set("age", 30);
me.size; // => 2
me.set("country", "Belgium");
me.size; // => 3
```


### Object iteration 对象数组

Avoid **for...in** when you can.

> 避免使用 **for...in**

```javascript
const shared = { foo: "foo" };
const obj = Object.create(shared, {
  bar: {
    value: "bar",
    enumerable: true
  }
});

// bad
for (var prop in obj) {
  if (obj.hasOwnProperty(prop))
    console.log(prop);
}

// good
Object.keys(obj).forEach(prop => console.log(prop));
```

### const 和 let 和 var

Favor **const** over **let** and **let** over **var**.

```javascript
// bad
var me = new Map();
me.set("name", "Ben").set("country", "Belgium");

// good
const me = new Map();
me.set("name", "Ben").set("country", "Belgium");

```

### Coercion 强制

Embrace implicit coercion when it makes sense. Avoid it otherwise.
Don't cargo-cult.

> 拥抱隐含的强制时，它有道理。避免它，否则。不崇拜邪教。

```javascript
// bad
if (x === undefined || x === null) { // dosomething }

// good
if (x == undefined) { // dosomthing }
```

## 命名方法

> 小驼峰式命名法  首字母小写 eg：studentInfo、userInfo、productInfo

## 在做长方法链时使用缩进

```javascript
// bad
$('#items').find('.selected').highlight().end().find('.open').updateCount();

// good
$('#items')
  .find('.selected')
    .highlight()
    .end()
  .find('.open')
    .updateCount();

// bad
var leds = stage.selectAll('.led').data(data).enter().append('svg:svg').class('led', true)
    .attr('width',  (radius + margin) * 2).append('svg:g')
    .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
    .call(tron.led);

// good
var leds = stage.selectAll('.led')
    .data(data)
  .enter().append('svg:svg')
    .class('led', true)
    .attr('width',  (radius + margin) * 2)
  .append('svg:g')
    .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
    .call(tron.led);
```





## 参考文档

* https://github.com/bevacqua/js 主要参考
* https://github.com/bendc/frontend-guidelines 参考
* http://www.codeceo.com/article/javascript-guide.html 参考
* http://www.cnblogs.com/polk6/p/4660195.html 参考
* https://github.com/felixge/node-style-guide 对照
* http://stackoverflow.com/documentation/javascript/topics 对照
* http://es6.ruanyifeng.com/#docs/module 查看
* http://es6.ruanyifeng.com es6入门




参照以上的 git 文档书写的规则,以上的翻译源自百度翻译. 原文请
[查看原文](https://github.com/bevacqua/js)

注: 我们在网上看到很多 javascript 规范,这个时候以上文书写为主,其他说法为辅助.


