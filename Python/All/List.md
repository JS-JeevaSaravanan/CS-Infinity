
In Python, you can access a subpart of an array (or list) without creating a new instance by using slice notation. However, note that slicing itself creates a new list; if you want to reference a subpart of the original list without creating a new instance, you can use indexing to refer to the specific elements you need.

Here's how you can do both:

### 1. Slicing (Creates a New Instance)

Using slicing creates a new list that contains the specified elements.

```python
original_list = [1, 2, 3, 4, 5]
sublist = original_list[1:4]  # This creates a new list [2, 3, 4]
print(sublist)  # Output: [2, 3, 4]
```

### 2. Referencing Elements (No New Instance)

If you want to access specific elements without creating a new list, you can do so by using indexing:

```python
original_list = [1, 2, 3, 4, 5]
first_element = original_list[1]  # This references the second element (2)
second_element = original_list[2]  # This references the third element (3)

print(first_element)  # Output: 2
print(second_element)  # Output: 3
```

### 3. Using Iterators

If you need to process a subpart of the list without creating a new instance, consider using iterators:

```python
original_list = [1, 2, 3, 4, 5]

# Create an iterator for the original list
iterator = iter(original_list)

# Skip to the desired starting point
for _ in range(1):  # Skip the first element
    next(iterator)

# Now, you can use the iterator to access elements
sub_part = [next(iterator) for _ in range(3)]  # Get the next three elements
print(sub_part)  # Output: [2, 3, 4]
```

### Summary

- **Slicing** creates a new instance and cannot be avoided if you want a sublist.
- **Indexing** allows you to refer to specific elements without creating new instances.
- **Iterators** can be used to traverse the list without creating new lists, but they have a different usage pattern. 

If you want to keep memory usage low and avoid new list instances, directly accessing elements or using iterators would be the best approach.


Note :
```python
graph = [[]]* 2
```

When you use `graph = [[]] * numCourses`, you create a list of references to the same inner list. This means that any modification to one of the lists will affect all of them, which is not the intended behavior


