


## Binary Search


Binary search is an efficient algorithm for finding the position of a specific element in a **sorted** list. Let’s illustrate this with a guessing game example:

Imagine your friend chooses a number between **1 and 100**, and your task is to guess it. 

#### Linear Search

One approach is **linear search**, where you start at **1** and guess each number in sequence. If the correct number is **100**, you’d need **100 guesses**—which is inefficient, especially with larger ranges (like **1 to 10,000**). This method has a time complexity of **O(n)**, meaning the number of guesses grows linearly with the size of the list.

#### Binary Search

Now, let’s consider **binary search**. Instead of starting at **1**, you begin by guessing the **middle** of the range, which is **50**. Your friend then tells you if the number is higher or lower. Based on that feedback, you can eliminate half of the remaining possibilities with each guess.

For instance:
1. Guess **50**: If the number is higher, you now consider **51 to 100**.
2. Guess the new middle (let's say **75**): Continue narrowing down the range based on feedback.

This method effectively halves the number of options with each guess, leading to a time complexity of **O(log n)**. 

```pseudo
FUNCTION binarySearch(array, target):
    low = 0
    high = length(array) - 1

    WHILE low <= high:
        mid = (low + high) // 2  // Integer division

        IF array[mid] == target:
            RETURN mid  // Target found
        ELSE IF array[mid] < target:
            low = mid + 1  // Search in the right half
        ELSE:
            high = mid - 1  // Search in the left half

    RETURN -1  // Target not found

```

#### Worst-Case Comparison

To see how efficient this is, let’s look at the worst-case scenario:
- For linear search in the range **1 to 10,000**, you might need **10,000 guesses**.
- For binary search, using **O(log n)**: 
  - Calculate \( \log_2(10,000) \), which is approximately **13.3**. Thus, you’d need **14 guesses** in the worst case.

#### Conclusion

Binary search is a powerful tool, particularly when dealing with sorted lists. Its efficiency makes it significantly faster than linear search for large datasets. Just remember: binary search only works on sorted data. If you find yourself needing to search through a sorted list, binary search is an excellent approach to consider.


## Depth-First Search (DFS)

Depth-First Search (DFS) is a traversal algorithm used to explore nodes and edges in a graph or tree structure. The key idea behind DFS is to start at the **root node** and explore as far down one branch as possible before backtracking. This approach effectively utilizes a technique called **backtracking**.

#### How DFS Works

1. **Initialization**: Before starting DFS, create a **visited array** to keep track of nodes you’ve already explored.

2. **Traversal**:
   - Begin at the **root node** and add it to the visited array.
   - Move to the first child node and add it to the visited array.
   - Continue down this branch, visiting nodes and adding them to the visited array until you reach a node with no unvisited children.

3. **Backtracking**:
   - Once you hit a dead end, backtrack to the previous node and check for any unvisited children.
   - If there are unvisited nodes, proceed down that branch and repeat the process.
   - If not, backtrack further up until all nodes have been visited.

This process continues until the entire graph has been explored.

#### Visual Example

Imagine navigating a maze: you start at the entrance and explore each path to its end. If you encounter a wall, you backtrack to the last junction and try another path. This method of exploration allows you to efficiently search through complex structures.


Recursive DFS Pseudocode

```pseudo
FUNCTION DFS(node, visited):
    IF node IS NULL:
        RETURN

    // Mark the node as visited
    visited.add(node)

    // Process the current node (e.g., print it)
    PRINT(node)

    // Recur for each unvisited adjacent node
    FOR each neighbor in node.adjacent:
        IF neighbor NOT IN visited:
            DFS(neighbor, visited)

```


Iterative DFS Pseudocode

```pseudo
FUNCTION iterativeDFS(root):
    visited = empty set
    stack = empty stack

    stack.push(root)

    WHILE stack is not empty:
        node = stack.pop()

        IF node NOT IN visited:
            visited.add(node)

            // Process the current node (e.g., print it)
            PRINT(node)

            // Add all unvisited neighbors to the stack
            FOR each neighbor in node.adjacent:
                IF neighbor NOT IN visited:
                    stack.push(neighbor)

```
#### Time Complexity

The time complexity of DFS is expressed as **O(V + E)**, where:
- **V** is the total number of **vertices** (or nodes).
- **E** is the total number of **edges** (or branches).

This complexity arises because, in the worst case, you may need to visit every node and edge.

#### Real-World Applications

DFS is particularly useful in scenarios like:
- **Maze solving**: Finding a path through a maze by exploring all possible routes.
- **Puzzle solving**: Games like Sudoku, where exploring different configurations is necessary.
- **Graph algorithms**: Such as topological sorting and finding connected components.

Now that we’ve covered DFS, let’s move on to its counterpart: **Breadth-First Search (BFS)**.



## Breadth-First Search (BFS)

Breadth-First Search (BFS) is an algorithm used to explore nodes and edges in a graph or tree structure. Unlike Depth-First Search (DFS), BFS explores all the nodes at the current level before moving on to the next level. This level-by-level approach makes it intuitive and easy to understand.

#### How BFS Works

1. **Initialization**:
   - Create a **visited array** to track which nodes have been explored.
   - Create a **queue** to hold the nodes that need to be explored.

2. **Traversal**:
   - Start at the **root node**, mark it as visited, and add it to the queue.
   - While the queue is not empty:
     - Dequeue the front node.
     - Process that node (e.g., print it or store it).
     - Enqueue all its unvisited neighbors, marking them as visited as you go.

3. **Level-by-Level Exploration**:
   - Continue this process until all reachable nodes have been visited, ensuring that you explore each level fully before proceeding to the next.

#### Visual Example

Think of BFS like exploring a building floor by floor. You check every room on the first floor before moving to the second floor. This systematic approach ensures that you see all possible connections at each level.

#### Real-World Applications

BFS is commonly used in scenarios such as:
- **Chess algorithms**: To evaluate possible moves by exploring all possible next moves and their subsequent options.
- **Social networking**: Finding the shortest path between users.
- **Web crawling**: To explore web pages level by level.

#### Time Complexity

The time complexity of BFS is also **O(V + E)**, where:
- **V** is the total number of vertices (nodes).
- **E** is the total number of edges (connections).

### Pseudocode for Breadth-First Search

```plaintext
FUNCTION BFS(root):
    visited = empty set
    queue = empty queue

    // Start with the root node
    visited.add(root)
    queue.enqueue(root)

    WHILE queue is not empty:
        node = queue.dequeue()

        // Process the current node (e.g., print it)
        PRINT(node)

        // Enqueue all unvisited neighbors
        FOR each neighbor in node.adjacent:
            IF neighbor NOT IN visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)
```

### Summary

- **BFS** efficiently explores nodes level by level, ensuring that all neighbors are examined before moving deeper.
- The algorithm is particularly useful for problems requiring the shortest path or level-based exploration.

If you have any further questions or need more examples, feel free to ask!





