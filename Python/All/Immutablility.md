
In Python, while you cannot explicitly declare a variable as immutable like you can with `const` in JavaScript, you can use immutable data types to achieve similar behavior. Here are some common ways to create variables that should be treated as immutable:

### 1. **Using Immutable Data Types**

Python provides several built-in immutable data types:

- **Integers**: Once created, an integer cannot be changed.
- **Strings**: Strings are immutable; you cannot change them after creation.
- **Tuples**: A tuple is a sequence type that is immutable.

#### Example:

```python
# Immutable integers
x = 10
# x = x + 1  # This creates a new integer instead of changing x

# Immutable string
name = "Alice"
# name[0] = "B"  # This will raise an error

# Immutable tuple
coordinates = (10, 20)
# coordinates[0] = 15  # This will raise an error
```

### 2. **Using Named Constants**

While Python does not have a built-in `const` keyword, you can define a variable using uppercase letters to indicate it should be treated as a constant. It’s a convention, not enforced by the language.

#### Example:

```python
# Conventionally treated as constant
MAX_CONNECTIONS = 100
# MAX_CONNECTIONS = 200  # This is allowed, but it is discouraged
```

### 3. **Using `frozendict` (Python 3.9+)**

If you want to create an immutable dictionary, you can use `frozendict`, which is available starting from Python 3.9.

#### Example:

```python
from types import MappingProxyType

# Creating an immutable dictionary
immutable_dict = MappingProxyType({'a': 1, 'b': 2})

# Attempting to change the dictionary will raise an error
# immutable_dict['a'] = 10  # This will raise a TypeError

print(immutable_dict)  # Output: {'a': 1, 'b': 2}
```

### 4. **Creating Custom Immutable Classes**

You can define your own classes that prevent modification of their attributes after instantiation.

#### Example:

```python
class ImmutablePoint:
    def __init__(self, x: int, y: int):
        self.__x = x
        self.__y = y

    @property
    def x(self):
        return self.__x

    @property
    def y(self):
        return self.__y

# Create an instance of ImmutablePoint
point = ImmutablePoint(1, 2)

# point.x = 10  # This will raise an AttributeError
print(point.x, point.y)  # Output: 1 2
```

### Summary

- **Immutable Data Types**: Use integers, strings, and tuples to hold values that shouldn’t change.
- **Constants**: Use uppercase naming conventions for values you want to treat as constants.
- **Immutable Collections**: Use `MappingProxyType` for immutable dictionaries.
- **Custom Classes**: Define classes with properties to restrict attribute modification.

This way, you can effectively use immutable variables in Python!

