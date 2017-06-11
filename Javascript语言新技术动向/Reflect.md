Reflect
===================

----------

一、Reflect简介
-------------
----------

Reflect不是构造函数， 要使用的时候直接通过Reflect.method()调用， Reflect有的方法和Proxy差不多， 而且多数Reflect方法原生的Object已经重新实现了。

> **为什么要用 Reflect**

> - 1.更加有用的返回值
> - 2.进行函数操作
> - 3.更加可靠的函数式执行方式
> - 4.可变参数形式的构造函数
> - 5.控制访问器或者读取器的this

二、Reflect方法
-------------

----
<kbd>Reflect</kbd>对象一共有13个静态方法。

Reflect.apply(target,thisArg,args)

Reflect.construct(target,args)

Reflect.get(target,name,receiver)

Reflect.set(target,name,value,receiver)

Reflect.defineProperty(target,name,desc)

Reflect.deleteProperty(target,name)

Reflect.has(target,name)

Reflect.ownKeys(target)

Reflect.isExtensible(target)

Reflect.preventExtensions(target)

Reflect.getOwnPropertyDescriptor(target, name)

Reflect.getPrototypeOf(target)

Reflect.setPrototypeOf(target, prototype)

----
### 简单介绍几个方法

#### 1.Reflect.get(target, name, receiver)

<kbd>Reflect.get</kbd>方法查找并返回<kbd>target</kbd>对象的<kbd>name</kbd>属性，如果没有该属性，则返回<kbd>undefined</kbd>。

```
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
}

console.log(Reflect.get(myObject, 'foo')) ; // 1
Reflect.get(myObject, 'bar') // 2
Reflect.get(myObject, 'baz') // 3
Reflect.get(myObject, 'baa') // undefined
```


如果<kbd>name</kbd>属性部署了读取函数（getter），则读取函数的<kbd>this</kbd>绑定<kbd>receiver</kbd>。

```
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};

Reflect.get(myObject, 'baz', myReceiverObject) // 8
```

如果第一个参数不是对象，<kbd>Reflect.get</kbd>方法会报错。

```
Reflect.get(1, 'foo') // 报错
Reflect.get(false, 'foo') // 报错
```
---

#### 2.Reflect.set(target, name, value, receiver)

<kbd>Reflect.set</kbd>方法设置<kbd>target</kbd>对象的<kbd>name</kbd>属性等于<kbd>value</kbd>。

```
var myObject = {
  foo: 1,
  set bar(value) {
    return this.foo = value;
  },
}

myObject.foo // 1

Reflect.set(myObject, 'foo', 2);
myObject.foo // 2

Reflect.set(myObject, 'bar', 3)
myObject.foo // 3
```

如果<kbd>name</kbd>属性设置了赋值函数，则赋值函数的<kbd>this</kbd>绑定<kbd>receiver</kbd>。

```
var myObject = {
  foo: 4,
  set bar(value) {
    return this.foo = value;
  },
};

var myReceiverObject = {
  foo: 0,
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo // 4
myReceiverObject.foo // 1
```

如果第一个参数不是对象，<kbd>Reflect.set</kbd>方法会报错。

```
Reflect.set(1, 'foo') // 报错
Reflect.set(false, 'foo') // 报错
```
---

#### 3.Reflect.has(obj, name)

<kbd>Reflect.has</kbd>方法对应<kbd>name in obj</kbd>里面的<kbd>in</kbd>运算符。

```
var myObject = {
  foo: 1,
};

// 旧写法
'foo' in myObject // true

// 新写法
Reflect.has(myObject, 'foo') // true
```

如果第一个参数不是对象，<kbd>Reflect.has</kbd>和<kbd>in</kbd>运算符都会报错。

---

#### 4.Reflect.apply(func, thisArg, args)

<kbd>Reflect.apply</kbd>方法等同于<kbd>Function.prototype.apply.call(func, thisArg, args)</kbd>，用于绑定<kbd>this</kbd>对象后执行给定函数。

一般来说，如果要绑定一个函数的<kbd>this</kbd>对象，可以这样写<kbd>fn.apply(obj, args)</kbd>，但是如果函数定义了自己的<kbd>apply</kbd>方法，就只能写成<kbd>Function.prototype.apply.call(func, obj, args)</kbd>，采用<kbd>Reflect</kbd>对象可以简化这种操作。

```
const ages = [11, 33, 12, 54, 18, 96];

// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
```

---

#### 5.Reflect.ownKeys (target)

<kbd>Reflect.ownKeys</kbd>方法用于返回对象的所有属性，基本等同于<kbd>Object.getOwnPropertyNames</kbd>与<kbd>Object.getOwnPropertySymbols</kbd>之和。

```
var myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4,
};

// 旧写法
Object.getOwnPropertyNames(myObject)
// ['foo', 'bar']

Object.getOwnPropertySymbols(myObject)
//[Symbol.for('baz'), Symbol.for('bing')]

// 新写法
Reflect.ownKeys(myObject)
// ['foo', 'bar', Symbol.for('baz'), Symbol.for('bing')]
```

----
