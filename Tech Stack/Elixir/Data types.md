

### ✅ 3. **Basic Data Types**


```ruby | elixir

# There are numbers
3    # integer
0x1F # integer
3.0  # float
1 + 2       # => 3
3.14 * 2    # => 6.28

# Atoms are constants whose values are their own name. They start with `:`.
:hello # atom
:ok         # => :ok


# Strings
"elixir" <> "lang"  # => "elixirlanguage"


# Booleans
true or false

# Tuples that are stored contiguously in memory.
{1,2,3} # tuple
{:ok, "done"}

# We can access a tuple element with the `elem` function:
elem({1, 2, 3}, 0) #=> 1

# Lists that are implemented as linked lists.
[1,2,3] # list

# We can access the head and tail of a list as follows:
[head | tail] = [1,2,3]
head #=> 1
tail #=> [2,3]


# Maps
%{name: "Alice", age: 30}


```



---

# 🧠 Elixir Data Types: 
## 🔢 1. **Numbers**

Elixir supports **integers** and **floats**.

```ruby | elixir
3         # Integer => 3
0x1F      # Hex integer => 31
3.14 * 2  # Float => 6.28
```

✅ **Check type:**

```elixir
is_integer(3)   # true
is_float(0x1F)  # false
is_float(3.14)  # true
```


### Common operations:

```elixir
+  -  *  /  div  rem  round  trunc
```

### Examples:

```elixir
10 + 5       # => 15
div(10, 3)   # => 3
rem(10, 3)   # => 1
round(3.14)  # => 3
```

not modulo here %, use rem always
div for divide to get rounded off quotient

```elixir
IO.puts(10/3) #=> 3.3333333333333335
IO.puts(div(10, 3)) #=> 3
```

---

## 🟣 2. **Atoms**

Atoms are **named constants**. They are self-referential — their value is their name.

```elixir
:ok
:male
:pending
```

✅ **Check type:**

```elixir
is_atom(:ok)   # true
```


```ruby | elixir
:off
IO.puts(:ok) #=> :ok
IO.puts(:off) #=> :off
IO.puts(is_atom(:off)) #=> true
```


✅ **Real-world use:**

```ruby | elixir
def register_user(data) do
  if data.valid, do: {:ok, "Registered"}, else: {:error, "Invalid info"}
end
```

---

## 🧵 3. **Strings**

Strings are UTF-8 binaries.

```ruby | elixir
"elixir" <> "lang"   # => "elixirlanguage"
IO.puts("hello" <> "world") #=> helloworld
```

✅ **Check type:**

```elixir
is_binary("hello")  # true
```

✅ **Real-world use:**

```elixir
welcome_message = "Welcome " <> user.name
```

---

## ✅ 4. **Booleans**

Booleans in Elixir are `true` and `false`. 
They're actually atoms under the hood!

```elixir
true or false  # => true
```

✅ **Check type:**

```ruby | elixir
is_boolean(true)  # true

:true
IO.puts(:true) #=> true
IO.puts(:false) #=> false

```

✅ **Real-world use:**

```elixir
if user.active do
  IO.puts("Show in search results")
end
```

## ✅ **Booleans & Atoms**

- Used in control flow, states, tags, results.
    
- Often returned in pattern tuples: `{:ok, val}`, `:error`, `:pending`


---

## 📦 5. **Lists**

Ordered collections, implemented as **linked lists**.

```elixir
[1, 2, 3]
["music", "travel", "sports"]
```

✅ **Check type:**

```elixir
is_list([1, 2, 3])  # true
```

 Pattern matching:

```elixir
[head | tail] = [1, 2, 3]
# head = 1
# tail = [2, 3]
```


## 📋 **Lists** (Linked lists)

- **Push (prepend):** `[new | list]`
    
- **Pop (head & tail):** `[head | tail] = list`
    
- **Concat:** `list1 ++ list2`
    
- **Remove:** `list -- [value]`
    
- **Length, Enum ops, etc.**
    

### Examples:

```ruby | elixir
list = [2, 3]
[1 | list]       # => [1, 2, 3] (push front)
[head | tail] = [1, 2, 3]
# head = 1, tail = [2, 3]
[1, 2] ++ [3, 4] # => [1, 2, 3, 4]
[1, 2, 3] -- [2] # => [1, 3]
Enum.map([1, 2], fn x -> x * 2 end) # => [2, 4]
```



---

### ✅ Full Elixir Example with Comments

```ruby | elixir
list = [1, 2, 3, 4]
IO.puts("Is it a list? #{is_list(list)}")  # => true

# --- Destructure: head, middle, tail ---
[head | rest] = list
middle = Enum.slice(rest, 0..-2)
tail = List.last(list)

IO.puts("Head: #{head}")        # => 1
IO.inspect(middle, label: "Middle") # => [2, 3]
IO.puts("Tail: #{tail}")        # => 4

# --- Prepend (Push) ---
# Add an element to the front
new_list = [:a | list]
IO.inspect(new_list, label: "Prepend :a")  # => [:a, 1, 2, 3, 4]

# --- Pop (Destructure head and tail) ---
[head2 | tail2] = list
IO.puts("Popped head: #{head2}")     # => 1
IO.inspect(tail2, label: "Remaining list")  # => [2, 3, 4]

# --- Concat ---
list2 = [5, 6]
concat = list ++ list2
IO.inspect(concat, label: "Concatenated")  # => [1, 2, 3, 4, 5, 6]

# --- Remove element ---
removed = list -- [2]
IO.inspect(removed, label: "After removing 2")  # => [1, 3, 4]

# --- Length ---
IO.puts("Length: #{length(list)}")  # => 4

# -- For each list --
return = Enum.each(list, fn item -> IO.puts(item) end)
#=> 1
# 2
# 3
# 4

# --- Map over list ---
squared = Enum.map(list, fn x -> x * x end)
IO.inspect(squared)  # => [1, 4, 9, 16]

# --- Filter even numbers ---
evens = Enum.filter(list, fn x -> rem(x, 2) == 0 end)
IO.inspect(evens)  # => [2, 4]
IO.inspect("Events: #{evens}") #=> <<69, 118, 101, 110, 116, 115, 58, 32, 2, 4>>
IO.inspect("Events: #{inspect(evens)}") #=> "Events: [2, 4]"

# --- Reduce (sum) ---
sum = Enum.reduce(list, 0, fn x, acc -> x + acc end)
IO.puts("Sum: #{sum}")  # =>Sum: 10

```



---

### 📌 Summary of Common List Operations in Elixir:

|Operation|Code|Example Result|
|---|---|---|
|**Check list**|`is_list(list)`|`true`|
|**Push (prepend)**|`[new|list]`|
|**Pop**|`[head|tail] = list`|
|**Concat**|`list1 ++ list2`|`[1,2] ++ [3] => [1,2,3]`|
|**Remove**|`list -- [value]`|`[1,2,3] -- [2] => [1,3]`|
|**Length**|`length(list)`|`4`|
|**Map**|`Enum.map(list, fn x -> ... end)`|Transform values|
|**Filter**|`Enum.filter(list, fn -> ... end)`|Keep some values|
|**Reduce**|`Enum.reduce(list, acc, fn -> ... )`|Aggregate (e.g., sum)|

Elixir doesn't have a built-in `foreach` keyword like some other languages (e.g., Python or JavaScript), **but you can achieve the same behavior using `Enum.each/2`**.

- `Enum.each/2` is **used for side effects** like printing or logging. — it **does not return a new list**.

| Purpose                                   | Use This      |
| ----------------------------------------- | ------------- |
| Do something with each item (e.g., print) | `Enum.each/2` |
| Create a new list based on transformation | `Enum.map/2`  |


---

## 🧺 6. **Tuples**

Fixed-size collections, great for tagging results.

```elixir
{:ok, "User created"}
{:error, "Email already exists"}
```

- **Access:** `elem(tuple, index)`
    
- **Update:** `put_elem(tuple, index, value)`
    
- **Fixed size**


✅ **Check type:**

```elixir
is_tuple({:ok, 123})  # true
```

✅ **Real-world use:**

```elixir
case create_profile(data) do
  {:ok, profile} -> IO.puts("Welcome, #{profile.name}")
  {:error, reason} -> IO.puts("Error: #{reason}")
end
```


```ruby | elixir
tuple1 = {:ok, 200}

IO.inspect(tuple1) #=> :ok, 200}

IO.inspect(elem(tuple1,0)) #=> :ok

tuple2 = put_elem(tuple1,0,100)
IO.inspect(tuple1) #=> :ok, 200}
IO.inspect(tuple2) #=> {100.200}


#IO.inspect(elem(tuple1,2)) #=> :ok
#=: ** (ArgumentError) errors were found at the given arguments: * 1st argument: out of range :erlang.element(3, {:ok, 200})

#put_elem(tuple1,2,300)
#=: ** (ArgumentError) errors were found at the given arguments: * 1st argument: out of range :erlang.setelement(3, {:ok, 200}, 300)

```



---

## 🗺️ 7. **Maps**

Key-value data store — like dictionaries or objects in JS.


- **Access:** `map[:key]` or `map.key`
    
- **Add/update:** `%{map | key: new_val}`
    
- **Put/get/remove:** `Map.put/3`, `Map.get/2`, `Map.delete/2`
    
- **Keys/values/merge**
    


```elixir
%{name: "Alice", age: 30}
%{"email" => "test@example.com"}
```

note: "the colon of key must be with key with no space before and always should be space after.. else compiler throw error to since not sure of syntax.. have confusion with atom."


✅ **Check type:**

```elixir
is_map(%{name: "Elixir"})  # true
```





### Examples:

```ruby | elixir
user = %{name: "Samy", age: 33, gender: :male}

IO.inspect(user)                # => %{name: "Samy", age: 33, gender: :male}
IO.inspect(is_map(user))        # => true

# Access values
IO.puts(user[:gender])          # => male
IO.puts(Map.get(user, :gender)) # => male

# Update value (creates new map)
updated_user = %{user | gender: :female}
IO.inspect(updated_user)        # => %{name: "Samy", age: 33, gender: :female}

# Add or update a key
user_with_location = Map.put(user, :location, "Chennai")
IO.inspect(user_with_location)  # => %{name: "Samy", age: 33, gender: :male, location: "Chennai"}

# Delete a key
user_without_age = Map.delete(user, :age)
IO.inspect(user_without_age)    # => %{name: "Samy", gender: :male}

# Get all keys
IO.inspect(Map.keys(user))      # => [:name, :age, :gender]

# Get all values
IO.inspect(Map.values(user))    # => ["Samy", 33, :male]

# Merge two maps (note: keys in second map override)
more_info = %{age: 34, location: "Chennai"}
merged_user = Map.merge(user, more_info)
IO.inspect(merged_user)         # => %{name: "Samy", age: 34, gender: :male, location: "Chennai"}

```


|Function|Description|
|---|---|
|`Map.get(map, key)`|Safe value access|
|`Map.put(map, key, val)`|Add/update key|
|`Map.delete(map, key)`|Remove key|
|`Map.keys(map)`|List all keys|
|`Map.values(map)`|List all values|
|`Map.merge(map1, map2)`|Combine maps (map2 overrides)|


---


### 🔢 Binaries

Low-level string or byte storage.

```elixir
<<104, 101, 108, 108, 111>> # => "hello"
```

✅ Check type:

```elixir
is_binary("hello")   # true
```

---

### 🗃 Keyword Lists

Special type of list with key-value pairs (keys are atoms, ordered).

```elixir
[role: :admin, active: true]
```

✅ Real-world:

```elixir
User.create([name: "Alex", age: 30])
```

---

### 💬 Charlists

List of character codepoints (used in Erlang interop).

```elixir
'hello'  # => [104, 101, 108, 108, 111]
```

✅ Rarely used unless interfacing with Erlang.

---

## 🔍 Summary Table

| Type      | Example             | Use Case                 | Check With           |
| --------- | ------------------- | ------------------------ | -------------------- |
| Integer   | `3`, `0x1F`         | Age, counts              | `is_integer/1`       |
| Float     | `3.14`, `99.99`     | Price, score             | `is_float/1`         |
| Atom      | `:ok`, `:female`    | Status, categories       | `is_atom/1`          |
| Boolean   | `true`, `false`     | Flags, conditions        | `is_boolean/1`       |
| String    | `"hello"`           | Names, bios, messages    | `is_binary/1`        |
| Tuple     | `{:ok, "Done"}`     | Tagged responses         | `is_tuple/1`         |
| List      | `[1,2,3]`           | Interests, match lists   | `is_list/1`          |
| Map       | `%{name: "Alice"}`  | Profile data, config     | `is_map/1`           |
| Keyword   | `[name: "Elixir"]`  | Options/config (ordered) | `Keyword.keyword?/1` |
| Binary    | `<<104, 101, 108>>` | Raw byte strings         | `is_binary/1`        |
| Charlists | `'hello'`           | Erlang interop           | `is_list/1`          |

Perfect! Here's a **crisp cheat-sheet of common workflow methods (a.k.a. operations)** for Elixir's core data structures — like `List`, `Tuple`, `Map`, etc. Think of this as a **"what you typically do with each data structure"** reference.

---

---

## 📦 **Keyword Lists** (Ordered list of key-value pairs)

- **Access by key:** `list[:key]`
    
- **Used for options, metadata, etc.**
    
- Often passed to functions.
    

### Example:

```elixir
opts = [role: :admin, active: true]
opts[:role]        # => :admin
Keyword.get(opts, :active) # => true
```

---

## 🧬 **Binaries & Strings**

- **Concatenate:** `<>`
    
- **Length:** `String.length/1`
    
- **Slice, match, split, replace**
    

### Examples:

```elixir
"hello" <> "world"      # => "helloworld"
String.length("hi")     # => 2
String.slice("elixir", 0, 3)  # => "eli"
String.contains?("hello", "ll") # => true
```

---

