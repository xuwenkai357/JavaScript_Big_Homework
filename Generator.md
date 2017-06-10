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
