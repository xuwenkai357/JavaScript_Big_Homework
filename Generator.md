Generator
===================

----------

一、Generator简介
-------------
----------

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

> **Generator 函数有多种理解角度**

> - 从语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。
> - 从形式上，Generator 函数是一个普通函数，但是有两个特征。一是，<kbd>function</kbd>关键字与函数名之间有一个星号；二是，函数体内部使用<kbd>yield</kbd>表达式，定义不同的内部状态（<kbd>yield</kbd>在英语里的意思就是“产出”）。

```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```


上面代码定义了一个 Generator 函数<kbd>helloWorldGenerator</kbd>，它内部有两个<kbd>yield</kbd>表达式（<kbd>hello</kbd>和<kbd>world</kbd>），即该函数有三个状态：<kbd>hello</kbd>，<kbd>world</kbd> 和 <kbd>return</kbd> 语句（结束执行）。

下一步，必须调用遍历器对象的<kbd>next</kbd>方法，使得指针移向下一个状态。也就是说，每次调用<kbd>next</kbd>方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个<kbd>yield</kbd>表达式（或<kbd>return</kbd>语句）为止。换言之，Generator 函数是分段执行的，<kbd>yield</kbd>表达式是暂停执行的标记，而<kbd>next</kbd>方法可以恢复执行。

```
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```
上面代码一共调用了四次<kbd>next</kbd>方法。


第一次调用，Generator 函数开始执行，直到遇到第一个<kbd>yield</kbd>表达式为止。<kbd>next</kbd>方法返回一个对象，它的<kbd>value</kbd>属性就是当前<kbd>yield</kbd>表达式的值<kbd>hello</kbd>，<kbd>done</kbd>属性的值<kbd>false</kbd>，表示遍历还没有结束。

第二次调用，Generator 函数从上次<kbd>yield</kbd>表达式停下的地方，一直执行到下一个<kbd>yield</kbd>表达式。<kbd>yield</kbd>方法返回的对象的<kbd>yield</kbd>属性就是当前<kbd>yield</kbd>表达式的值<kbd>world</kbd>，<kbd>done</kbd>属性的值<kbd>false</kbd>，表示遍历还没有结束。

第三次调用，Generator 函数从上次<kbd>yield</kbd>表达式停下的地方，一直执行到<kbd>return</kbd>语句（如果没有<kbd>return</kbd>语句，就执行到函数结束）。<kbd>next</kbd>方法返回的对象的<kbd>value</kbd>属性，就是紧跟在<kbd>return</kbd>语句后面的表达式的值（如果没有<kbd>return</kbd>语句，则<kbd>value</kbd>属性的值为<kbd>undefined</kbd>），<kbd>done</kbd>属性的值<kbd>true</kbd>，表示遍历已经结束。

第四次调用，此时 Generator 函数已经运行完毕，<kbd>next</kbd>方法返回对象的<kbd>value</kbd>属性为<kbd>undefined</kbd>，<kbd>done</kbd>属性为<kbd>true</kbd>。以后再调用<kbd>next</kbd>方法，返回的都是这个值。

总结一下，调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的<kbd>next</kbd>方法，就会返回一个有着<kbd>value</kbd>和<kbd>done</kbd>两个属性的对象。<kbd>value</kbd>属性表示当前的内部状态的值，是<kbd>yield</kbd>表达式后面那个表达式的值；<kbd>done</kbd>属性是一个布尔值，表示是否遍历结束。

<kbd></kbd>
#### yield 表达式
-------
由于 Generator 函数返回的遍历器对象，只有调用<kbd>next</kbd>方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。<kbd>yield</kbd>表达式就是暂停标志。
```
function* gen() {
  yield  123 + 456;
}
```
上面代码中，<kbd>yield</kbd>后面的表达式<kbd>123 + 456</kbd>，不会立即求值，只会在<kbd>next</kbd>方法将指针移到这一句时，才会求值。

另外需要注意，<kbd>yield</kbd>表达式只能用在 Generator 函数里面，用在其他地方都会报错。
```
(function (){
  yield 1;
})()
// SyntaxError: Unexpected number
```
上面代码在一个普通函数中使用<kbd>yield</kbd>表达式，结果产生一个句法错误。

二、Generator方法
-------------
----

### 1.next()方法

Generator函数返回的Iterator执行next()方法以后， 返回值的结构为：
```
{
    value : "value", //value为返回的值
    done : false //done的值为一个布尔值， 如果Interator未遍历完毕， 他会返回false， 否则返回true；
}
```
例子：
```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```
next()方法会执行generator的代码，然后，每次遇到yield x;就返回一个对象{value: x, done: true/false}，然后“暂停”。返回的value就是yield的返回值， done表示这个generator是否已经执行结束了。如果done为true，则value就是return的返回值。当执行到done为true时，这个generator对象就已经全部执行完毕， 不要再继续调用next()了。

---


### 2.next方法的参数

<kbd>yield</kbd>表达式本身没有返回值，或者说总是返回<kbd>undefined</kbd>。<kbd>next</kbd>方法可以带一个参数，该参数就会被当作上一个<kbd>yield</kbd>表达式的返回值。

看个例子：
```
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```
上面代码中，第二次运行<kbd>next</kbd>方法的时候不带参数，导致y的值等于<kbd>2 * undefined</kbd>（即<kbd>NaN</kbd>），除以3以后还是<kbd>NaN</kbd>，因此返回对象的value属性也等于<kbd>NaN</kbd>。第三次运行<kbd>next</kbd>方法的时候不带参数，所以z等于<kbd>undefined</kbd>，返回对象的value属性等于<kbd>5 + NaN + undefined</kbd>，即<kbd>NaN</kbd>。

如果向<kbd>next</kbd>方法提供参数，返回结果就完全不一样了。上面代码第一次调用b的<kbd>next</kbd>方法时，返回<kbd>x+1</kbd>的值<kbd>6</kbd>；第二次调用<kbd>next</kbd>方法，将上一次<kbd>yield</kbd>表达式的值设为<kbd>12</kbd>，因此<kbd>y</kbd>等于<kbd>24</kbd>，返回<kbd>y /3</kbd>的值<kbd>8</kbd>；第三次调用<kbd>next</kbd>方法，将上一次<kbd>yield</kbd>表达式的值设为<kbd>13</kbd>，因此<kbd>z</kbd>等于<kbd>13</kbd>，这时<kbd>x</kbd>等于<kbd>5</kbd>，<kbd>y</kbd>等于<kbd>24</kbd>，所以<kbd>return</kbd>语句的值等于<kbd>42</kbd>。

注意，由于<kbd>next</kbd>方法的参数表示上一个<kbd>yield</kbd>表达式的返回值，所以第一次使用<kbd>next</kbd>方法时，不能带有参数。V8 引擎直接忽略第一次使用<kbd>next</kbd>方法时的参数，只有从第二次使用<kbd>next</kbd>方法开始，参数才是有效的。从语义上讲，第一个<kbd>next</kbd>方法用来启动遍历器对象，所以不用带有参数。

----

### 3.for...of 循环

<kbd>for...of</kbd>循环可以自动遍历 Generator 函数时生成的<kbd>Iterator</kbd>对象，且此时不再需要调用<kbd>next</kbd>方法。

```
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```
上面代码使用<kbd>for...of</kbd>循环，依次显示5个<kbd>yield</kbd>表达式的值。这里需要注意，一旦<kbd>next</kbd>方法的返回对象的<kbd>done</kbd>属性为<kbd>true</kbd>，<kbd>for...of</kbd>循环就会中止，且不包含该返回对象，所以上面代码的<kbd>return</kbd>语句返回的<kbd>6</kbd>，不包括在<kbd>for...of</kbd>循环之中。

从上面代码可见，使用<kbd>for...of</kbd>语句时不需要使用<kbd>next</kbd>方法。

---

### 4.throw方法()

Generator 函数返回的遍历器对象，都有一个<kbd>throw</kbd>方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

上面代码中，遍历器对象<kbd>i</kbd>连续抛出两个错误。第一个错误被 Generator 函数体内的<kbd>catch</kbd>语句捕获。i第二次抛出错误，由于 Generator 函数内部的<kbd>catch</kbd>语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的<kbd>catch</kbd>语句捕获。

<kbd>throw</kbd>方法可以接受一个参数，该参数会被<kbd>catch</kbd>语句接收，建议抛出Error对象的实例。

```
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error('出错了！'));
// Error: 出错了！(…)
```

如果 Generator 函数内部和外部，都没有部署<kbd>try...catch</kbd>代码块，那么程序将报错，直接中断执行。
```
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined
```  

上面代码中，<kbd>g.throw</kbd>抛出错误以后，没有任何<kbd>try...catch</kbd>代码块可以捕获这个错误，导致程序报错，中断执行。

<kbd>throw</kbd>方法被捕获以后，会附带执行下一条<kbd>yield</kbd>表达式。也就是说，会附带执行一次<kbd>next</kbd>方法。

```
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // b
g.next() // c
```

上面代码中，<kbd>g.throw</kbd>方法被捕获以后，自动执行了一次<kbd>next</kbd>方法，所以会打印<kbd>b</kbd>。另外，也可以看到，只要 Generator 函数内部部署了<kbd>try...catch</kbd>代码块，那么遍历器的<kbd>throw</kbd>方法抛出的错误，不影响下一次遍历。

---

### 5.return()方法

Generator函数返回的遍历器对象，还有一个<kbd>return</kbd>方法，可以返回给定的值，并且终结遍历Generator函数。

```
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

上面代码中，遍历器对象<kbd>g</kbd>调用<kbd>return</kbd>方法后，返回值的<kbd>value</kbd>属性就是<kbd>return</kbd>方法的参数<kbd>foo</kbd>。并且，Generator函数的遍历就终止了，返回值的<kbd>done</kbd>属性为<kbd>true</kbd>，以后再调用<kbd>next</kbd>方法，<kbd>done</kbd>属性总是返回<kbd>true</kbd>。

如果<kbd>return</kbd>方法调用时，不提供参数，则返回值的<kbd>value</kbd>属性为<kbd>undefined</kbd>。

```
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return() // { value: undefined, done: true }
```
