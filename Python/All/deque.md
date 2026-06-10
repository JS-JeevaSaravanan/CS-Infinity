
In Python, the `deque` (double-ended queue) is part of the `collections` module and provides a flexible way to add and remove elements from both ends. Here are some commonly used methods and their functionalities:

### 1. **Creating a deque**
```python
from collections import deque

d = deque()  # Creates an empty deque
d = deque([1, 2, 3])  # Creates a deque with initial elements
```

### 2. **Adding elements**
- **append(x)**: Adds `x` to the right end.
  ```python
  d.append(4)  # deque([1, 2, 3, 4])
  ```

- **appendleft(x)**: Adds `x` to the left end.
  ```python
  d.appendleft(0)  # deque([0, 1, 2, 3, 4])
  ```

### 3. **Removing elements**
- **pop()**: Removes and returns an element from the right end.
  ```python
  d.pop()  # Returns 4; deque([0, 1, 2, 3])
  ```

- **popleft()**: Removes and returns an element from the left end.
  ```python
  d.popleft()  # Returns 0; deque([1, 2, 3])
  ```

### 4. **Accessing elements**
- **extend(iterable)**: Adds elements from an iterable to the right end.
  ```python
  d.extend([4, 5])  # deque([1, 2, 3, 4, 5])
  ```

- **extendleft(iterable)**: Adds elements from an iterable to the left end (in reverse order).
  ```python
  d.extendleft([-1, -2])  # deque([-2, -1, 1, 2, 3, 4, 5])
  ```

### 5. **Removing specific elements**
- **remove(value)**: Removes the first occurrence of `value`.
  ```python
  d.remove(3)  # deque([-2, -1, 1, 2, 4, 5])
  ```

### 6. **Rotating the deque**
- **rotate(n)**: Rotates the deque `n` steps to the right (if `n` is positive) or to the left (if `n` is negative).
  ```python
  d.rotate(1)  # deque([-1, 1, 2, 4, 5, -2])
  ```

### 7. **Other useful methods**
- **clear()**: Removes all elements from the deque.
  ```python
  d.clear()  # deque([])
  ```

- **count(x)**: Returns the number of occurrences of `x` in the deque.
  ```python
  d = deque([1, 2, 2, 3])
  d.count(2)  # Returns 2
  ```

- **copy()**: Returns a shallow copy of the deque.
  ```python
  d_copy = d.copy()  # Creates a copy of the deque
  ```

### 8. **Properties**
- **maxlen**: If specified, it limits the size of the deque.
  ```python
  d = deque(maxlen=3)  # Creates a deque that can hold at most 3 items
  ```


```python
from collections import deque

d = deque(maxlen=3) 
print(d) #=> deque([], maxlen=3)

d.append(1)
d.append(2)
d.append(3)
print(d) #=> deque([1, 2, 3], maxlen=3)

d.append(4)
print(d) #=> deque([2, 3, 4], maxlen=3)

```


These methods make `deque` a versatile data structure for various applications, especially when you need fast appends and pops from both ends.

