Async
===================

----------

一、Async简介
-------------
----------
async 函数是什么？

一句话，它就是 Generator 函数的语法糖。

现在有一个 Generator 函数，依次读取两个文件。

```
var fs = require('fs');

var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

```

写成<kbd>async</kbd>函数，就是下面这样。

```
var asyncReadFile = async function () {
  var f1 = await readFile('/etc/fstab');
  var f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

一比较就会发现，<kbd>async</kbd>函数就是将 Generator 函数的星号（<kbd>* </kbd>）替换成<kbd>async</kbd>，将<kbd>yield</kbd>替换成<kbd>await</kbd>，仅此而已。

---

### 优点

async函数对 Generator 函数的改进，体现在以下四点。

> - 1.内置执行器。

Generator 函数的执行必须靠执行器，所以才有了<kbd>co</kbd>模块，而<kbd>async</kbd>函数自带执行器。也就是说，<kbd>async</kbd>函数的执行，与普通函数一模一样，只要一行。

```
var result = asyncReadFile();
```

上面的代码调用了<kbd>asyncReadFile</kbd>函数，然后它就会自动执行，输出最后结果。这完全不像 Generator 函数，需要调用<kbd>next</kbd>t方法，或者用<kbd>co</kbd>模块，才能真正执行，得到最后结果。

> - 2.更好的语义。

<kbd>async</kbd>和<kbd>await</kbd>，比起<kbd>(* )星号</kbd>和<kbd>yield</kbd>，语义更清楚了。<kbd>async</kbd>表示函数里有异步操作，<kbd>await</kbd>表示紧跟在后面的表达式需要等待结果。


> - 3.更广的适用性。

<kbd>co</kbd>模块约定，<kbd>yield</kbd>命令后面只能是 Thunk 函数或 Promise 对象，而<kbd>async</kbd>函数的<kbd>await</kbd>命令后面，可以是<kbd>Promise</kbd> 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

> - 4.返回值是 Promise。

<kbd>async</kbd>函数的返回值是 Promise 对象，这比 <kbd>Promise</kbd> 函数的返回值是 <kbd>Iterator</kbd> 对象方便多了。你可以用then方法指定下一步的操作。

---

二、Async基本用法
-------------

<kbd>async</kbd>函数返回一个 <kbd>Promise</kbd> 对象，可以使用<kbd>then</kbd>方法添加回调函数。当函数执行的时候，一旦遇到<kbd>await</kbd>就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

下面是一个例子。

```
async function getStockPriceByName(name) {
  var symbol = await getStockSymbol(name);
  var stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});

```

上面代码是一个获取股票报价的函数，函数前面的<kbd>async</kbd>关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个<kbd>Promise</kbd>对象。

下面是另一个例子，指定多少毫秒后输出一个值。

```
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 50);

```

上面代码指定50毫秒以后，输出<kbd>hello world</kbd>。

---

三、Async使用注意点
-------------

<kbd>await</kbd>命令后面的<kbd>Promise</kbd>对象，运行结果可能是<kbd>rejected</kbd>，所以最好把<kbd>await</kbd>命令放在<kbd>try...catch</kbd>代码块中。

```
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  };
}
```

<kbd>await</kbd>命令只能用在<kbd>async</kbd>函数之中，如果用在普通函数，就会报错。

```
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  // 报错
  docs.forEach(function (doc) {
    await db.post(doc);
  });
}
```

----

四、Async函数的实现原理
-------------

<kbd>async</kbd> 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

所有的<kbd>async</kbd>函数都可以写成上面的第二种形式，其中的<kbd>spawn</kbd>函数就是自动执行器。

----
