
### Comments

```elixir
# Single line comments start with a number symbol.

# There's no multi-line comment,
# but you can stack multiple comments.
```


---

### ✅ 2. **Hello World**

```elixir
IO.puts("Hello, World!") #=> Hello, World!
```

---




## 🔢 What Does `/1`, `/2`, etc., Mean?

In Elixir, **`/n` indicates the number of arguments** a function takes.  
It’s called the **arity** of the function.

---

### 🧠 Examples

|Function|Arity|Meaning|
|---|---|---|
|`is_map/1`|1|Takes **1 argument**|
|`Enum.each/2`|2|Takes **2 arguments**|
|`String.slice/3`|3|Takes **3 arguments**|

---

### ✅ Why It's Useful

Elixir lets you **pass around functions** and **refer to them by name and arity**.

#### Example:

```elixir
# Define a short function
add = &Kernel.+/2  # refers to the + function with 2 arguments

IO.puts(add.(5, 3))  # => 8
```

Here, `&Kernel.+/2` is a reference to the addition function (`+`) with 2 arguments.

---

### ✅ When You See It

- In docs and code references
    
- When **passing** or **matching** functions
    
- In `&Module.function/arity` shorthand
    

---

### 🔁 Another Example

```elixir
Enum.map([1, 2, 3], &(&1 * 2))  # Equivalent to Enum.map/2
```

If you had your own function:

```elixir
def double(x), do: x * 2
```

You could pass it as:

```elixir
Enum.map([1, 2, 3], &double/1)
```

---
