






**“01 Matrix”** problem — where for each cell in a binary matrix, you want to compute the **distance to the nearest 0**. The `searchMatrix` recursive approach works but is very inefficient (exponential time) for large inputs like yours.

Let’s complete and **optimize** your `updateMatrix` function using a **Breadth-First Search (BFS)** — which is the standard O(m×n) solution.

Here’s the **complete, clean, and efficient code:**

```python
from typing import List
from collections import deque

def updateMatrix(matrix: List[List[int]]) -> List[List[int]]:
    rows, cols = len(matrix), len(matrix[0])
    result = [[float('inf')] * cols for _ in range(rows)]
    q = deque()

    # Step 1: Initialize queue with all 0-cells
    for r in range(rows):
        for c in range(cols):
            if matrix[r][c] == 0:
                result[r][c] = 0
                q.append((r, c))

    # Step 2: BFS to update distances
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    while q:
        x, y = q.popleft()
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols:
                if result[nx][ny] > result[x][y] + 1:
                    result[nx][ny] = result[x][y] + 1
                    q.append((nx, ny))

    return result
```

### ✅ Explanation:

- **Initialize:**  
    Put all `0` cells in a queue and set their distance to `0`.  
    Set all `1` cells’ distances to infinity initially.
    
- **BFS traversal:**  
    Expand outward from every `0`, updating neighboring cells’ distances when you find a shorter path.
    
- **Why BFS works best:**  
    BFS ensures the first time you visit a cell, it’s through the shortest path.
    

---





Perfect 👍 Let’s create a **detailed technical article** on the **“01 Matrix”** problem — covering the **problem statement**, **intuitions**, **multiple approaches (DFS, DP, BFS)**, and their **time/space complexities** with clean, industry-style explanations.

---

# 🧩 01 Matrix — Explained with All Approaches

## 📘 Problem Statement

You are given an `m x n` binary matrix `mat` consisting of only `0`s and `1`s.

Your task is to return a matrix of the same size, where each cell contains the **distance to the nearest `0`**.

- Distance is measured in **number of steps** between adjacent cells (up, down, left, right).
    
- If a cell already contains `0`, its distance is `0`.
    

---

### 🧠 Example

#### Input:

```python
mat = [
  [0,0,0],
  [0,1,0],
  [1,1,1]
]
```

#### Output:

```python
[
  [0,0,0],
  [0,1,0],
  [1,2,1]
]
```

#### Explanation:

- For cell `(2,0)`, nearest zero is at `(1,0)` → distance = 1
    
- For cell `(2,1)`, nearest zero is at `(1,1)` via `(1,0)` → distance = 2
    
- Cells containing `0` remain `0`.
    

---

## 🧩 Approaches to Solve 01 Matrix

There are multiple valid ways to solve this problem — each with a different balance of **time**, **space**, and **complexity**.

We’ll go through them in order of conceptual progression.

---

## 🥉 Approach 1: Brute Force DFS (Depth-First Search)

### 🔹 Idea

For each cell that contains `1`,  
perform a **DFS search** in all four directions to find the **closest `0`**.

At every step, we:

- Move in 4 directions.
    
- Stop when a `0` is found.
    
- Track visited nodes to prevent cycles.
    

### 🔹 Code

```python
from typing import List

def updateMatrix(matrix: List[List[int]]) -> List[List[int]]:
    rows, cols = len(matrix), len(matrix[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    def dfs(r, c, visited):
        if matrix[r][c] == 0:
            return 0
        visited.add((r, c))
        min_dist = float('inf')

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited:
                dist = dfs(nr, nc, visited)
                min_dist = min(min_dist, dist + 1 if dist != float('inf') else float('inf'))

        visited.remove((r, c))
        return min_dist

    result = [[0]*cols for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            if matrix[i][j] == 0:
                result[i][j] = 0
            else:
                result[i][j] = dfs(i, j, set())
    return result
```

### 🔹 Complexity

|Metric|Value|
|---|---|
|**Time Complexity**|O((m × n)²) — For each cell (m×n), DFS can visit all cells again|
|**Space Complexity**|O(m × n) — for recursion stack and visited set|

### ⚠️ Note

- Correct but **very slow** for large matrices.
    
- DFS explores every possible path redundantly.
    

---

## 🥈 Approach 2: DFS with Memoization (`lru_cache`)

### 🔹 Idea

Use recursion but **cache already computed distances**  
so that once the distance for a cell is known, it’s reused.

This drastically reduces recomputation.

### 🔹 Code

```python
from functools import lru_cache

def updateMatrix(matrix):
    rows, cols = len(matrix), len(matrix[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    @lru_cache(None)
    def dfs(r, c):
        if matrix[r][c] == 0:
            return 0
        min_dist = float('inf')
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                min_dist = min(min_dist, dfs(nr, nc) + 1)
        return min_dist

    return [[dfs(r, c) for c in range(cols)] for r in range(rows)]
```

### 🔹 Complexity

|Metric|Value|
|---|---|
|**Time Complexity**|O(m × n) — each cell computed once due to memoization|
|**Space Complexity**|O(m × n) — for recursion stack + cache|

✅ **Faster and correct**, but DFS depth may still cause stack overflow on very large grids.

---

## 🥇 Approach 3: BFS (Breadth-First Search) — Optimal

### 🔹 Intuition

Instead of starting from every `1` and looking for the nearest `0`,  
we **reverse the process** — start from **all zeros simultaneously** and expand outward.

Each layer of BFS increases the distance by 1.

This ensures that:

- The first time we visit a cell, it’s the **shortest distance** to a `0`.
    
- We visit each cell only once.
    

### 🔹 Code

```python
from collections import deque
from typing import List

def updateMatrix(matrix: List[List[int]]) -> List[List[int]]:
    rows, cols = len(matrix), len(matrix[0])
    q = deque()
    dist = [[float('inf')] * cols for _ in range(rows)]

    # Step 1: Initialize queue with all 0s
    for i in range(rows):
        for j in range(cols):
            if matrix[i][j] == 0:
                dist[i][j] = 0
                q.append((i, j))

    # Step 2: BFS traversal
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    while q:
        r, c = q.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                if dist[nr][nc] > dist[r][c] + 1:
                    dist[nr][nc] = dist[r][c] + 1
                    q.append((nr, nc))
    return dist
```

### 🔹 Complexity

|Metric|Value|
|---|---|
|**Time Complexity**|**O(m × n)** — each cell visited once|
|**Space Complexity**|**O(m × n)** — for queue and distance matrix|

✅ **Most optimal solution** — works efficiently for large matrices.

---

## 🧮 Example Walkthrough (BFS)

For:

```
[
 [0,0,0],
 [0,1,0],
 [1,1,1]
]
```

1. Enqueue all `0`s initially → all have distance `0`.
    
2. Expand BFS:
    
    - Update all adjacent `1`s → distance = `1`.
        
    - Next layer: update farther `1`s → distance = `2`.
        
3. Stop when queue is empty.
    

Result:

```
[
 [0,0,0],
 [0,1,0],
 [1,2,1]
]
```

---

## 🧾 Summary Table

|Approach|Description|Time|Space|Notes|
|---|---|---|---|---|
|**DFS (Brute Force)**|Explore all paths per cell|O((m×n)²)|O(m×n)|Simple, but very slow|
|**DFS + Memoization**|Cache computed distances|O(m×n)|O(m×n)|Correct, faster, but deep recursion|
|**BFS (Optimal)**|Multi-source BFS from all zeros|**O(m×n)**|**O(m×n)**|Fastest and recommended|

---

## 🧠 Key Takeaways

- **Reverse Thinking** helps: start from zeros instead of ones.
    
- BFS ensures shortest paths automatically.
    
- DFS is educational but not practical for large grids.
    
- Memoization makes DFS feasible but still less intuitive.
    

---

## 🏁 Final Recommendation

In real-world or interview use:

- ✅ **Implement BFS** (clean and efficient)
    
- 🧩 Use **DFS** only to demonstrate recursion and backtracking understanding
    
- 🚀 For coding rounds, BFS easily fits within time limits (even for `1000 x 1000` matrices)
    

---

time limit exceed soln

```python
from typing import List, Tuple, Set, Dict

def bfs(matrix: List[List[int]], i: int, j: int, cache: Dict[Tuple[int, int], int] ) -> int:
    
    if matrix[i][j] == 0:
        return 0

    if (i, j) in cache:
        return cache[(i, j)]
    
    queue: List[Tuple[int, int, int]] = [(i, j, 0)]
    visited: Set[Tuple[int, int]] = set()
    visited.add((i, j))

    while queue:
        x, y, val = queue.pop(0)
        new_val = val + 1
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nx, ny = x + dx, y + dy
            if -1 < nx < len(matrix) and -1 < ny < len(matrix[0]) and (nx, ny) not in visited:
                if matrix[nx][ny] == 0:
                    cache[(nx, ny)] = new_val
                    return new_val
                else:
                    queue.append((nx, ny, new_val))
                    visited.add((nx, ny))
                
                
    return -1
        

    

def updateMatrix(matrix: List[List[int]]) -> List[List[int]]:
  rows, cols = len(matrix), len(matrix[0])
  res = [[0]*cols for _ in range(rows)]
  cache: Dict[Tuple[int,int], int] = {}
  for i in range(rows):
      for j in range(cols):
          res[i][j] = bfs(matrix, i, j, cache)
  return res


```



Excellent question 🔥 — and this is a **very common pitfall** when solving the “01 Matrix” problem with BFS per cell.

Let’s break it down carefully 👇

---

## ⚙️ What your code does

For each cell `(i, j)`, you call:

```python
self.bfs(matrix, i, j, cache)
```

Then inside `bfs`, you do a **full BFS search** outward from `(i, j)` until you find a zero.

So if you have an `m x n` matrix:

- You run BFS **m × n times**
    
- Each BFS can visit **O(m × n)** cells
    

That leads to **O((m×n)²)** time complexity 🚨 — too slow for large matrices (like 100×100 or more).

---

## 🧠 Why the cache doesn’t help much here

Your cache only stores results for **positions that are zero or directly adjacent to zero**.  
But for all other positions, you still do a BFS that explores a large portion of the matrix.

Example:

- You start BFS at (5,5)
    
- You only hit the cache _after you find a 0_, which is late
    
- So for many cells, you’re repeating almost the same searches
    

So the cache gives only marginal improvement.

---

## ✅ The Efficient Approach (Global BFS)

The optimal solution is to **run one BFS starting from all zeros simultaneously**.

This way, each cell’s distance to the nearest zero is computed **once** —  
O(m × n) total time.

### Optimized BFS solution:

```python
from collections import deque
from typing import List

class Solution:
    def updateMatrix(self, matrix: List[List[int]]) -> List[List[int]]:
        rows, cols = len(matrix), len(matrix[0])
        res = [[float('inf')] * cols for _ in range(rows)]
        queue = deque()

        # Start BFS from all zeros at once
        for i in range(rows):
            for j in range(cols):
                if matrix[i][j] == 0:
                    res[i][j] = 0
                    queue.append((i, j))

        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        # Multi-source BFS
        while queue:
            x, y = queue.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols:
                    # If we find a shorter distance
                    if res[nx][ny] > res[x][y] + 1:
                        res[nx][ny] = res[x][y] + 1
                        queue.append((nx, ny))
        return res
```

### ⏱️ Complexity

- **Time:** O(m × n)
    
- **Space:** O(m × n)
    

---

## 🧩 Summary

|Problem|Cause|Fix|
|---|---|---|
|TLE (Time Limit Exceeded)|Running BFS for every cell (O((mn)²))|Use one **multi-source BFS** starting from all 0s|

---


```python

def test_matrix():
  test_cases = [
    {
      'input': [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
      'output': [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
  }, {
      'input': [[0, 0, 0], [0, 1, 0], [1, 1, 1]],
      'output': [[0, 0, 0], [0, 1, 0], [1, 2, 1]]
  }, {
      'input': [[1, 1, 1], [1, 1, 1], [1, 1, 0]],
      'output': [[4, 3, 2], [3, 2, 1], [2, 1, 0]]
  }, 
                {
      'input': [[1, 0, 1, 1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
                [0, 0, 1, 0, 1, 0, 0, 1, 0, 0], [1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
                [0, 1, 0, 1, 1, 0, 0, 0, 0, 1], [0, 0, 1, 0, 1, 1, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 0, 1, 1], [1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 0, 1, 0], [1, 1, 1, 1, 0, 1, 0, 0, 1,
                                                 1]],
      'output':
      [[1, 0, 1, 1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
       [0, 0, 1, 0, 1, 0, 0, 1, 0, 0], [1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
       [0, 1, 0, 1, 1, 0, 0, 0, 0, 1], [0, 0, 1, 0, 1, 1, 1, 0, 1, 0],
       [0, 1, 0, 1, 0, 1, 0, 0, 1, 1], [1, 0, 0, 0, 1, 2, 1, 1, 0, 1],
       [2, 1, 1, 1, 1, 2, 1, 0, 1, 0], [3, 2, 2, 1, 0, 1, 0, 0, 1, 1]],
  }]

  for i, test_case in enumerate(test_cases):
    result = updateMatrix(test_case['input'])
    expected = test_case['output']
    failed_text = f"Test case {i + 1} failed: expected {expected}, but got {result}"
    assert result == expected, failed_text

  print("All test cases passed!")


test_matrix()


```



---

Great! Let me show you different solutions to the **01 Matrix** problem (finding distance to nearest 0 for each cell).I've provided **4 different solutions** to the 01 Matrix problem! Here's a quick summary:

```python
"""
01 Matrix Problem: Find distance to nearest 0 for each cell
Given m x n binary matrix, return distance of nearest 0 for each cell.
"""

from collections import deque
from typing import List

# Solution 1: BFS from all 0s (Multi-source BFS) - OPTIMAL
# Time: O(m*n), Space: O(m*n)
def updateMatrix_BFS(mat: List[List[int]]) -> List[List[int]]:
    """
    Start BFS from all 0s simultaneously. 
    When we reach a cell, it's the shortest distance.
    """
    m, n = len(mat), len(mat[0])
    queue = deque()
    
    # Initialize: add all 0s to queue, mark 1s as unvisited
    for i in range(m):
        for j in range(n):
            if mat[i][j] == 0:
                queue.append((i, j))
            else:
                mat[i][j] = -1  # Mark as unvisited
    
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    
    while queue:
        x, y = queue.popleft()
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            
            if 0 <= nx < m and 0 <= ny < n and mat[nx][ny] == -1:
                mat[nx][ny] = mat[x][y] + 1
                queue.append((nx, ny))
    
    return mat


# Solution 2: Dynamic Programming (Two-pass)
# Time: O(m*n), Space: O(1) if we modify input
def updateMatrix_DP(mat: List[List[int]]) -> List[List[int]]:
    """
    Two-pass DP: top-left to bottom-right, then bottom-right to top-left.
    Each cell checks already-processed neighbors.
    """
    m, n = len(mat), len(mat[0])
    MAX = m + n  # Maximum possible distance
    
    # First pass: top-left to bottom-right
    for i in range(m):
        for j in range(n):
            if mat[i][j] != 0:
                top = mat[i-1][j] if i > 0 else MAX
                left = mat[i][j-1] if j > 0 else MAX
                mat[i][j] = min(top, left) + 1
    
    # Second pass: bottom-right to top-left
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            if mat[i][j] != 0:
                bottom = mat[i+1][j] if i < m-1 else MAX
                right = mat[i][j+1] if j < n-1 else MAX
                mat[i][j] = min(mat[i][j], bottom + 1, right + 1)
    
    return mat


# Solution 3: BFS from each 1 (Brute Force - NOT RECOMMENDED)
# Time: O(m*n * m*n), Space: O(m*n)
def updateMatrix_BruteForce(mat: List[List[int]]) -> List[List[int]]:
    """
    For each 1, run BFS to find nearest 0.
    Very slow but easy to understand.
    """
    m, n = len(mat), len(mat[0])
    result = [[0] * n for _ in range(m)]
    
    def bfs(start_i, start_j):
        if mat[start_i][start_j] == 0:
            return 0
        
        queue = deque([(start_i, start_j, 0)])
        visited = {(start_i, start_j)}
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        while queue:
            x, y, dist = queue.popleft()
            
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                
                if 0 <= nx < m and 0 <= ny < n and (nx, ny) not in visited:
                    if mat[nx][ny] == 0:
                        return dist + 1
                    visited.add((nx, ny))
                    queue.append((nx, ny, dist + 1))
        
        return 0
    
    for i in range(m):
        for j in range(n):
            result[i][j] = bfs(i, j)
    
    return result


# Solution 4: DFS with Memoization
# Time: O(m*n), Space: O(m*n)
def updateMatrix_DFS(mat: List[List[int]]) -> List[List[int]]:
    """
    DFS with memoization. Not as efficient as BFS for this problem.
    """
    m, n = len(mat), len(mat[0])
    memo = {}
    
    def dfs(i, j, visited):
        if (i, j) in memo:
            return memo[(i, j)]
        
        if mat[i][j] == 0:
            return 0
        
        visited.add((i, j))
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        min_dist = float('inf')
        
        for dx, dy in directions:
            ni, nj = i + dx, j + dy
            if 0 <= ni < m and 0 <= nj < n and (ni, nj) not in visited:
                min_dist = min(min_dist, dfs(ni, nj, visited) + 1)
        
        visited.remove((i, j))
        memo[(i, j)] = min_dist
        return min_dist
    
    result = [[0] * n for _ in range(m)]
    for i in range(m):
        for j in range(n):
            result[i][j] = dfs(i, j, set())
    
    return result


# Test the solutions
if __name__ == "__main__":
    test_cases = [
        [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
        [[0, 0, 0], [0, 1, 0], [1, 1, 1]],
        [[1, 1, 1], [1, 1, 1], [1, 1, 0]],
    ]
    
    for idx, test in enumerate(test_cases):
        print(f"\nTest Case {idx + 1}:")
        print("Input:")
        for row in test:
            print(row)
        
        # Make copies since some solutions modify input
        import copy
        
        result_bfs = updateMatrix_BFS(copy.deepcopy(test))
        print("\nBFS Result:")
        for row in result_bfs:
            print(row)
        
        result_dp = updateMatrix_DP(copy.deepcopy(test))
        print("\nDP Result:")
        for row in result_dp:
            print(row)


"""
COMPARISON OF APPROACHES:

1. Multi-source BFS (BEST for interviews)
   - Time: O(m*n)
   - Space: O(m*n)
   - Pros: Optimal, easy to understand, guaranteed shortest path
   - Cons: Requires queue

2. Dynamic Programming (BEST for optimization)
   - Time: O(m*n)
   - Space: O(1) if modifying input
   - Pros: Very space efficient, no queue needed
   - Cons: Two passes needed, slightly less intuitive

3. Brute Force BFS (Don't use in practice)
   - Time: O((m*n)²)
   - Space: O(m*n)
   - Pros: Simple to understand
   - Cons: Way too slow for large inputs

4. DFS with Memoization
   - Time: O(m*n)
   - Space: O(m*n)
   - Pros: Works
   - Cons: Stack overflow risk, not natural for shortest path

RECOMMENDATION: Use Multi-source BFS for interviews, DP for production.
"""
```

## 🏆 **Best Solutions:**

1. **Multi-source BFS** - Start from all 0s at once, expand outward. Perfect for interviews!
2. **Dynamic Programming** - Two-pass approach, very space-efficient

## 📝 **Key Insights:**

- **Multi-source BFS** treats all 0s as starting points and expands like a wave - when you first reach a cell, that's the shortest distance
- **DP approach** processes cells in order, using previously computed neighbors to calculate distances
- The brute force approach (BFS from each 1) is O(n⁴) and too slow
- DFS works but isn't ideal for shortest-path problems

**Time Complexity:** O(m×n) for the optimal solutions  
**Space Complexity:** O(m×n) for BFS, O(1) for DP if modifying input

Would you like me to:

- Explain any approach in more detail?
- Show step-by-step execution on an example?
- Discuss when to use each approach?


---


to checK {

Explanation

https://www.youtube.com/watch?v=B7sP1PcKOtw
https://www.youtube.com/watch?v=CTqBOiciqc4



similar : 
https://leetcode.com/problems/map-of-highest-peak/

https://www.youtube.com/shorts/FqTcYU_LXkY

This is Much Harder than 329. Longest Increasing Path in a Matrix





}