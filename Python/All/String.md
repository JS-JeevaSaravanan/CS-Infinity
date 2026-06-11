
Python provides a rich set of tools for string operations and manipulations. Below is a concise overview of the most common string operations:

### 1. **Basic String Operations**

- **Concatenation**:
  ```python
  s1 = "Hello"
  s2 = "World"
  result = s1 + " " + s2  # "Hello World"
  ```

- **Repetition**:
  ```python
  repeated = "abc" * 3  # "abcabcabc"
  ```

- **Length**:
  ```python
  length = len("Hello")  # 5
  ```

### 2. **Accessing and Slicing Strings**

- **Access by Index**:
  ```python
  s = "Python"
  first_char = s[0]  # 'P'
  last_char = s[-1]  # 'n'
  ```

- **Slicing**:
  ```python
  substring = s[1:4]  # 'yth'
  reverse = s[::-1]    # 'nohtyP'
  ```

### 3. **Case Conversion**

- **Upper and Lower Case**:
  ```python
  s = "Hello World"
  upper = s.upper()  # "HELLO WORLD"
  lower = s.lower()  # "hello world"
  ```

- **Title Case**:
  ```python
  title = s.title()  # "Hello World"
  ```

- **Swap Case**:
  ```python
  swapped = s.swapcase()  # "hELLO wORLD"
  ```

### 4. **Searching and Replacing**

- **Find Substring**:
  ```python
  s = "hello world"
  index = s.find("world")  # 6
  ```

- **Replace Substring**:
  ```python
  new_string = s.replace("world", "Python")  # "hello Python"
  ```

- **Check Prefix/Suffix**:
  ```python
  s.startswith("he")  # True
  s.endswith("ld")    # True
  ```

### 5. **Splitting and Joining**

- **Split by Delimiter**:
  ```python
  s = "a,b,c"
  parts = s.split(",")  # ['a', 'b', 'c']
  ```

- **Join List into String**:
  ```python
  joined = "-".join(parts)  # "a-b-c"
  ```

### 6. **Trimming**

- **Strip Whitespace**:
  ```python
  s = "  Hello  "
  stripped = s.strip()  # "Hello"
  left_strip = s.lstrip()  # "Hello  "
  right_strip = s.rstrip()  # "  Hello"
  ```

### 7. **String Formatting**

- **f-strings**:
  ```python
  name = "Alice"
  age = 30
  message = f"My name is {name} and I'm {age} years old."  # "My name is Alice and I'm 30 years old."
  ```

- **`format()`**:
  ```python
  message = "My name is {} and I'm {} years old.".format(name, age)
  ```

### 8. **Character Operations**

- **ASCII/Unicode Conversion**:
  ```python
  char = chr(65)  # 'A'
  ascii_code = ord('A')  # 65
  ```

### 9. **Checking String Properties**

- **Is Alphabetic/Numeric**:
  ```python
  s.isalpha()   # True if all characters are alphabetic
  s.isdigit()   # True if all characters are digits
  ```

### Summary of Common Methods:

| Operation          | Method Example                  |
|--------------------|----------------------------------|
| Concatenation       | `"Hello" + " " + "World"`       |
| Repetition          | `"abc" * 3`                    |
| Length              | `len(s)`                       |
| Slicing             | `s[1:4]`, `s[::-1]`            |
| Upper/Lower Case    | `s.upper()`, `s.lower()`        |
| Find/Replace        | `s.find("world")`, `s.replace()`|
| Split/Join          | `s.split(",")`, `"-".join(lst)` |
| Strip Whitespace    | `s.strip()`, `s.lstrip()`       |
| f-string Formatting | `f"My name is {name}"`          |

This concise guide should cover most common string manipulations in Python!

