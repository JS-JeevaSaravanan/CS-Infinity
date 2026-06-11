

Initialize dictionary:
```
{
	1: []
	2: []
}
```

```
graph = {
	x: [] for x in range(numCourses)
}
```




```
dp = [[] for _ in range(target + 1)]

```



You can simplify the code slightly by removing the explicit `str()` conversion since `join()` will convert the items to strings automatically:

```python
print(' '.join(map(str, result)))
print(' '.join(str(x) for x in result))
```



To flatten a list of lists like `[[1], [2, 3], [4, 5]]` into a single list `[1, 2, 3, 4, 5]`, you can use a list comprehension or `itertools.chain`. Here's the solution using list comprehension:

```python
flattened = [item for sublist in [[1], [2, 3], [4, 5]] for item in sublist]
print(flattened)
```

Alternatively, using `itertools.chain`:

```python
from itertools import chain

flattened = list(chain.from_iterable([[1], [2, 3], [4, 5]]))
print(flattened)
```






