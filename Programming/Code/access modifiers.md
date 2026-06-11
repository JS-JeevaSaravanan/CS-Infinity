

Mostly are compile time and nothing to do with runtime things

https://stackoverflow.com/questions/37506343/private-and-public-in-angular-component/37506946#37506946


access specifiers in ts vs js

https://stackoverflow.com/questions/68287618/what-are-the-differences-between-typescript-access-modifiers-and-javascript-ones?rq=2


modifiers or specifiers

https://stackoverflow.com/questions/2238730/what-is-the-difference-between-access-specifiers-and-access-modifiers



java access modifiers explained

https://stackoverflow.com/questions/16074621/accessibility-scope-of-java-access-modifiers





### 🔐 Access Modifier Summary:

|Modifier|Accessible in class?|Accessible in subclass?|Accessible outside class?|
|---|---|---|---|
|`public`|✅ Yes|✅ Yes|✅ Yes|
|`protected`|✅ Yes|✅ Yes|❌ No|
|`private`|✅ Yes|❌ No|❌ No|

---

### ✅ Syntax in TypeScript:

```ts
public methodName() {}     // accessible everywhere

protected methodName() {}  // accessible only in this class and subclasses

private methodName() {}    // accessible only within this class
```

> In contrast to `#methodName` (which is JavaScript’s **hard private** syntax), TypeScript’s `private` and `protected` are **soft visibility modifiers** — they don’t exist at runtime and can be bypassed with some effort.

---

### 🚫 Don't use `#methodName` for `protected`

You **cannot** write `#methodName` to mean `protected`. The `#` syntax is **true-private** and **incompatible with `protected`**, which requires subclass access.

---

### ✅ Use `protected` like this:

```ts
export class BaseService {
  protected formatLog(message: string): string {
    return `[Service] ${message}`;
  }
}

export class DerivedService extends BaseService {
  logSomething() {
    const msg = this.formatLog('Something happened');
    console.log(msg);
  }
}
```


