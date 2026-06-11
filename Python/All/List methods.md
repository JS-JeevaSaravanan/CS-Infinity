
Here's a concise list of common methods available for Python lists:

### List Methods

1. **append(x)**: Adds an item `x` to the end of the list.
2. **extend(iterable)**: Extends the list by appending elements from the iterable.
3. **insert(i, x)**: Inserts an item `x` at a given position `i`.
4. **remove(x)**: Removes the first item from the list whose value is equal to `x`. Raises a `ValueError` if not found.
5. **pop([i])**: Removes and returns the item at the given position `i`. If no index is specified, `pop()` removes and returns the last item in the list.
6. **clear()**: Removes all items from the list.
7. **index(x[, start[, end]])**: Returns the index of the first item whose value is equal to `x`. Raises a `ValueError` if not found.
8. **count(x)**: Returns the number of times `x` appears in the list.
9. **sort(key=None, reverse=False)**: Sorts the items of the list in place (the arguments can be used for sort customization).
10. **reverse()**: Reverses the elements of the list in place.
11. **copy()**: Returns a shallow copy of the list.

### Example Usage

```python
# Example list
my_list = [3, 1, 4, 1, 5]

# Append
my_list.append(9)

# Extend
my_list.extend([2, 6, 5])

# Insert
my_list.insert(2, 0)

# Remove
my_list.remove(1)

# Pop
item = my_list.pop()

# Clear
my_list.clear()

# Index
index = my_list.index(4)

# Count
count = my_list.count(1)

# Sort
my_list.sort()

# Reverse
my_list.reverse()

# Copy
new_list = my_list.copy()
```

This list should cover the essential methods you'll use with Python lists!

