

```python
class TreeNode:
    def __init__(self, value: int = 0, left: 'Optional[TreeNode]' = None, right: 'Optional[TreeNode]' = None):
        self.value = value
        self.left = left
        self.right = right
```
The reason for using `'Optional[TreeNode]'` in quotes is to avoid a circular reference in the type hinting for the `TreeNode` class. 

When you define the class `TreeNode`, the type hint `left: 'Optional[TreeNode]'` indicates that `left` can either be `None` or another `TreeNode` instance. However, at the point where you're defining the class, `TreeNode` hasn't been fully defined yet. By putting `Optional[TreeNode]` in quotes, you’re telling Python to treat it as a forward reference.

Here's a quick breakdown:

- `Optional[TreeNode]` means that the attribute can either be `None` or an instance of `TreeNode`.
- Quoting it (`'Optional[TreeNode]'`) allows the interpreter to recognize it correctly, even though the `TreeNode` class definition isn’t complete yet.

If you use Python 3.10 or later, you can avoid this by using the `from __future__ import annotations` statement at the top of your file, which automatically treats all type hints as strings. This makes it easier to read and avoids the need for quotes. Here's how it looks:

```python
from __future__ import annotations

class TreeNode:
    def __init__(self, value: int = 0, left: Optional[TreeNode] = None, right: Optional[TreeNode] = None):
        self.value = value
        self.left = left
        self.right = right
```

This way, you don't need to quote the type hints at all.


