


https://learnxinyminutes.com/elixir/


---



---

### ✅ 4. **Variables (Immutable)**

```elixir
x = 10       # => x is bound to 10
x = x + 5    # => rebinding allowed (doesn’t mutate, creates new binding)
```

---

### ✅ 5. **Pattern Matching**

```elixir
{:ok, result} = {:ok, 42}   # => result = 42

[a, b] = [1, 2]             # a = 1, b = 2

%{name: n} = %{name: "Bob"} # n = "Bob"
```

---

### ✅ 6. **Functions**

```elixir
# Named Function
defmodule Math do
  def add(a, b), do: a + b
end

Math.add(2, 3)  # => 5

# Anonymous Function
sum = fn a, b -> a + b end
sum.(3, 4)      # => 7
```

---

### ✅ 7. **Control Flow**

```elixir
# if
if true do
  "yes"
else
  "no"
end

# case
case {1, 2, 3} do
  {1, x, 3} -> x
  _ -> "no match"
end
# => 2
```

---

### ✅ 8. **Pipe Operator (`|>`)**

```elixir
"hello"
|> String.upcase()
|> String.reverse()
# => "OLLEH"
```

---
Awesome! Here's **Section 2** of the Elixir crash course — diving into **modules, recursion, Enum, pattern matching tricks, and immutability in practice**.

---

## 🔹 Elixir Tutorial — Section 2: Functional Power & Modules

---

### ✅ 1. **Modules & Function Definitions**

```elixir
defmodule Greeter do
  def hello(name) do
    "Hello, #{name}!"
  end

  def greet_all(names) do
    Enum.map(names, &hello/1)
  end
end

Greeter.hello("Phoenix")           # => "Hello, Phoenix!"
Greeter.greet_all(["Ana", "Bob"])  # => ["Hello, Ana!", "Hello, Bob!"]
```

---

### ✅ 2. **Recursion (Elixir’s way of looping)**

```elixir
defmodule Recursion do
  def countdown(0), do: IO.puts("Blast off!")
  def countdown(n) do
    IO.puts(n)
    countdown(n - 1)
  end
end

Recursion.countdown(3)
# 3
# 2
# 1
# Blast off!
```

---

### ✅ 3. **Enum & Stream (Data processing)**

```elixir
Enum.map([1, 2, 3], fn x -> x * 2 end)
# => [2, 4, 6]

Enum.filter(1..10, fn x -> rem(x, 2) == 0 end)
# => [2, 4, 6, 8, 10]

Enum.reduce([1, 2, 3], 0, fn x, acc -> x + acc end)
# => 6
```

**Lazy Stream:**

```elixir
stream = Stream.map(1..1000, fn x -> x * 2 end)
Enum.take(stream, 5)
# => [2, 4, 6, 8, 10]
```

---

### ✅ 4. **Immutability in Practice**

```elixir
list = [1, 2, 3]
new_list = [0 | list]

list      # => [1, 2, 3]
new_list  # => [0, 1, 2, 3]
```

Lists are not mutated — new versions are created!

---

### ✅ 5. **Guards**

Used to add conditions to pattern matches:

```elixir
defmodule Check do
  def type(x) when is_integer(x), do: "Integer"
  def type(x) when is_binary(x), do: "String"
end

Check.type(42)     # => "Integer"
Check.type("hi")   # => "String"
```

---

### ✅ 6. **Default Parameters**

```elixir
defmodule Hello do
  def greet(name \\ "stranger") do
    "Hi, #{name}!"
  end
end

Hello.greet()        # => "Hi, stranger!"
Hello.greet("Neo")   # => "Hi, Neo!"
```

---

Perfect! Let’s wrap up the trilogy with **Section 3**, covering **advanced pattern matching, error handling, concurrency with processes, and stateful abstractions**.

---

## 🔹 Elixir Tutorial — Section 3: Flow Control, Error Handling & Concurrency

---

### ✅ 1. **Advanced Pattern Matching with `with`**

```elixir
defmodule Login do
  def authenticate(user) do
    with {:ok, name} <- fetch_name(user),
         true <- valid_name?(name) do
      "Welcome, #{name}"
    else
      _ -> "Access denied"
    end
  end

  defp fetch_name(%{name: name}), do: {:ok, name}
  defp fetch_name(_), do: :error

  defp valid_name?("admin"), do: true
  defp valid_name?(_), do: false
end

Login.authenticate(%{name: "admin"})  # => "Welcome, admin"
Login.authenticate(%{name: "foo"})    # => "Access denied"
```

---

### ✅ 2. **Error Handling (`try`, `rescue`, `catch`)**

```elixir
try do
  1 / 0
rescue
  ArithmeticError -> "Can't divide by zero"
end
# => "Can't divide by zero"
```

But idiomatic Elixir prefers **`{:ok, result}` / `{:error, reason}`** tuples.

---

### ✅ 3. **Processes (`spawn`, `send`, `receive`)**

Elixir uses lightweight processes for concurrency.

```elixir
# Start a process
pid = spawn(fn ->
  receive do
    {:greet, msg} -> IO.puts("Got: #{msg}")
  end
end)

send(pid, {:greet, "Hello!"})
# => Output: Got: Hello!
```

---

### ✅ 4. **Agents — Simple Shared State**

```elixir
{:ok, agent} = Agent.start_link(fn -> 0 end)

Agent.update(agent, fn state -> state + 1 end)
Agent.get(agent, fn state -> state end)  # => 1
```

Agents hold state, and functions operate over it immutably behind the scenes.

---

### ✅ 5. **Tasks — Async Execution**

```elixir
task = Task.async(fn -> expensive_work() end)
Task.await(task)

defp expensive_work, do: Enum.sum(1..1_000_000)
```

---

### ✅ 6. **Supervision (Preview of OTP)**

```elixir
children = [
  {Agent, fn -> 0 end}
]

Supervisor.start_link(children, strategy: :one_for_one)
```

Supervisors automatically restart crashed processes — core of Elixir resilience.

---

### ✅ 7. **Mix — Elixir Project Tool**

Create and run a new app:

```bash
mix new my_app
cd my_app
mix run
```

Add dependencies in `mix.exs`, run `mix deps.get`.

---

### ✅ 8. **Conclusion — What to Explore Next**

- Phoenix (Web framework)
    
- GenServer (Advanced processes)
    
- OTP behaviors
    
- LiveView (Real-time UI)
    
- Nerves (IoT)
    
- Deployment with releases
    

---

That's it — you've now got a solid foundation in Elixir 🧠⚡  
Want a cheatsheet or a project idea to apply all this?




