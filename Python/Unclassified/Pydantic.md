


|**Aspect**|**Details**|
|---|---|
|**What is it?**|A data validation and settings management library for Python.|
|**Main Use**|Validating and parsing data using Python type hints.|
|**Core Idea**|Define **data models** using Python classes; Pydantic ensures data is valid.|
|**Language**|Python|
|**Type System**|Built on top of Python's **type hints** (`int`, `str`, `List`, etc.)|
|**Common Use Cases**|APIs (especially with FastAPI), config handling, data pipelines|
|**Key Features**|- Automatic type conversion- Detailed error reporting- JSON support|

### 🔥 Example:

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    age: int

user = User(id="1", name="Alice", age="30")
print(user)
```

**Output:**

```python
User(id=1, name='Alice', age=30)
```

Notice how it auto-converted strings to `int` — that's Pydantic magic ✨

Let me know if you want to dive into `Pydantic v2`, which brings some big changes!