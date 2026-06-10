

### 1. **`?` (Optional Chaining)**

- **What it does**: The `?.` operator allows you to **safely** access nested properties of an object without throwing an error if any part of the chain is `null` or `undefined`.
    

#### Example:

```ts
const user = { profile: { name: 'John' } };

console.log(user.profile?.name);  // Output: 'John'
console.log(user.profile?.age);   // Output: undefined
console.log(user?.address?.city); // Output: undefined
```

- **When to use**:
    
    - When you’re accessing deeply nested properties that may not exist and you want to avoid runtime errors.
        
- **Why it’s useful**: If any property in the chain is `null` or `undefined`, it won’t throw an error; instead, it returns `undefined`.
    

---

### 2. **`??` (Nullish Coalescing Operator)**

- **What it does**: The `??` operator returns the right-hand operand **only if** the left-hand operand is `null` or `undefined`. It is **not** triggered for other falsy values like `0`, `false`, or `""`.
    

#### Example:

```ts
const value1 = null;
const value2 = undefined;
const value3 = 0;
const value4 = '';

console.log(value1 ?? 'default'); // Output: 'default' (because value1 is null)
console.log(value2 ?? 'default'); // Output: 'default' (because value2 is undefined)
console.log(value3 ?? 'default'); // Output: 0 (because 0 is a valid value, not null/undefined)
console.log(value4 ?? 'default'); // Output: '' (because empty string is not null/undefined)
```

- **When to use**:
    
    - When you want to provide a default value **only** when a value is `null` or `undefined`. Unlike `||` (logical OR), it won’t trigger for falsy values like `0` or empty strings.
        
- **Why it’s useful**: Prevents unwanted substitution of valid falsy values (like `0` or empty strings) with a default.
    

---

### 3. **`!value` (Logical NOT)**

- **What it does**: The `!` operator inverts the **truthiness** of a value. If the value is **falsy**, `!value` will return `true`; otherwise, it returns `false`.
    

#### Example:

```ts
const value1 = 'hello';
const value2 = null;
const value3 = 0;
const value4 = undefined;

console.log(!value1);  // Output: false (because 'hello' is truthy)
console.log(!value2);  // Output: true  (because null is falsy)
console.log(!value3);  // Output: true  (because 0 is falsy)
console.log(!value4);  // Output: true  (because undefined is falsy)
```

- **When to use**:
    
    - When you need to explicitly **invert** a truthy/falsy check.
        
- **Why it’s useful**: Sometimes, you want to check for "falsy" values (`null`, `undefined`, `0`, `false`, `''`, etc.) and handle them in a specific way.
    

---

### 4. **`value!` (Non-null Assertion Operator)**

- **What it does**: The `!` used **after** a value is a **non-null assertion operator**. It tells TypeScript that you are **sure** the value is **not null or undefined** at that point, even though TypeScript cannot guarantee it.
    

#### Example:

```ts
const user: { name?: string } = { name: 'John' };

console.log(user.name!);  // Output: 'John' (because we know 'name' is not undefined)

const user2: { name?: string } = {}; 
console.log(user2.name!); // Throws error: "Object is possibly 'undefined'."
```

- **When to use**:
    
    - Use when you’re **sure** a value is **not null or undefined** but TypeScript is being cautious and marking it as possibly null/undefined.
        
- **Why it’s useful**: It's a way to tell TypeScript, “I know better than you — this value will **never** be `null` or `undefined` here.” It suppresses TypeScript's null-checking for that expression. **But** use it cautiously because if the value is actually `null` or `undefined`, it will throw a runtime error.
    

---

### **Summary of Differences**:

|Operator|Behavior|Use Case|
|---|---|---|
|`?.`|Optional chaining — safely access deep properties without throwing an error if `null` or `undefined`|Access deeply nested properties that may not exist|
|`??`|Nullish coalescing — returns right value only when left value is `null` or `undefined`|Provide default values for `null`/`undefined` without affecting valid falsy values (`0`, `false`, `""`)|
|`!value`|Logical NOT — inverts truthiness of value|Check if value is falsy (`null`, `undefined`, `0`, `false`, `""`, etc.)|
|`value!`|Non-null assertion — tells TypeScript to treat the value as non-null/undefined|When you're **sure** a value is not `null` or `undefined`, even though TypeScript is unsure|

---

### **When to Avoid Non-null Assertion (`value!`)**

- Avoid it unless you're **certain** about the absence of `null` or `undefined` at that point in the code. It can **bypass TypeScript's safety checks** and lead to potential runtime errors.
    

Would you like to see specific scenarios where you'd use each of these operators in a practical example?