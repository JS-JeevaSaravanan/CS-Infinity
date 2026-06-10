
Absolutely! Here's a **crisp, real-world guide** to Elixir's **`IO` module** for **input/output** — including `IO.puts`, `IO.inspect`, and others.

---

### 🖨️ Common IO Output Methods

|Function|Use For|Example & Output|
|---|---|---|
|`IO.puts/1`|Print string with newline|`IO.puts("Hello")` → prints `Hello`|
|`IO.write/1`|Print without newline|`IO.write("Hello")` → stays on same line|
|`IO.inspect/2`|Print any Elixir term|`IO.inspect([1,2], label: "List")` → `List: [1, 2]`|
|`IO.puts/2`|To a specific device|`IO.puts(:stderr, "Error!")` → to error stream|
|`IO.ANSI`|Styled output (color, etc)|`IO.puts(IO.ANSI.red() <> "Red text" <> IO.ANSI.reset())`|

---

### 📥 Common IO Input Methods

|Function|Use For|Example & Notes|
|---|---|---|
|`IO.gets/1`|Read line from standard input|`name = IO.gets("What's your name? ")`|
|`IO.getn/2`|Read `n` characters|`IO.getn("Char: ", 1)`|
|`IO.gets/1` + `String.trim/1`|Clean user input|`String.trim(IO.gets("> "))` removes newline|

---

### 🔍 Examples in Practice

```elixir
# Simple output
IO.puts("Welcome to Elixir!")

# Inspect complex values
person = %{name: "Alice", age: 30}
IO.inspect(person, label: "User Info")

# Styled output (red text)
IO.puts(IO.ANSI.red() <> "Error!" <> IO.ANSI.reset())

# Input with prompt
name = IO.gets("What's your name? ") |> String.trim()
IO.puts("Hello, #{name}!")

# Read 1 char only
IO.puts("Press any key to continue...")
_ = IO.getn("", 1)
```

---

### ✅ Quick Tip: Use `IO.inspect/2` for Debugging

```elixir
Enum.map([1,2,3], fn x ->
  IO.inspect(x, label: "Debugging item")
  x * 2
end)
```

---


```ruby | exlir
# --- Filter even numbers ---
list = [1, 2, 3, 4]
evens = Enum.filter(list, fn x -> rem(x, 2) == 0 end)
IO.inspect(evens)  # => [2, 4]
IO.inspect("Events: #{evens}") #=> <<69, 118, 101, 110, 116, 115, 58, 32, 2, 4>>
IO.inspect("Events: #{inspect(evens)}") #=> "Events: [2, 4]"
```

 **string interpolation vs. binary representation**.

Let’s break it down and explain **why you're seeing those strange numbers (`<<69, 118, ...>>`)** instead of the actual list `[2, 4]`.


```elixir
IO.inspect("Events: #{evens}")
```

🔴 Problem here.

Let’s break that down:

- `"Events: #{evens}"` attempts to **interpolate a list (`[2, 4]`) into a string**.
    
- But Elixir tries to **convert `[2, 4]` into a binary** — and **lists of integers are sometimes interpreted as character codepoints (charlists)**.
    
- So `[2, 4]` becomes **"non-printable characters"** → resulting in the weird binary: `<<69, 118, 101, 110, 116, 115, 58, 32, 2, 4>>`
    

Use `inspect/1` to **convert any value into a readable string** for interpolation:

```elixir
IO.puts("Evens: #{inspect(evens)}")
```



## 🔁 Summary

|Expression|Result|Why|
|---|---|---|
|`IO.inspect(evens)`|`[2, 4]`|Prints the raw data structure|
|`IO.puts("Evens: #{evens}")`|`<<69, ... 2, 4>>`|Treats list as charlist|
|`IO.puts("Evens: #{inspect(evens)}")`|`Evens: [2, 4]`|Proper string conversion|

---
