
In Python, you can perform a union of sets using several methods. The union of two or more sets combines all unique elements from those sets. Here are the common ways to do this:

### 1. **Using the `union()` method**
The `union()` method returns a new set containing all unique elements from the specified sets.

```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}
result = set1.union(set2)

print(result)  # Output: {1, 2, 3, 4, 5}
```

### 2. **Using the `|` operator**
You can also use the `|` operator to achieve the same result.

```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}
result = set1 | set2

print(result)  # Output: {1, 2, 3, 4, 5}
```

### 3. **Union of multiple sets**
You can union more than two sets using both the `union()` method and the `|` operator.

#### Using `union()`
```python
set1 = {1, 2}
set2 = {3, 4}
set3 = {4, 5, 6}
result = set1.union(set2, set3)

print(result)  # Output: {1, 2, 3, 4, 5, 6}
```

#### Using the `|` operator
```python
set1 = {1, 2}
set2 = {3, 4}
set3 = {4, 5, 6}
result = set1 | set2 | set3

print(result)  # Output: {1, 2, 3, 4, 5, 6}
```

### 4. **Using the `update()` method**
If you want to modify one of the original sets to include the elements from another set, you can use `update()`.

```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}
set1.update(set2)

print(set1)  # Output: {1, 2, 3, 4, 5}
```

This modifies `set1` in place, adding the unique elements from `set2`.


