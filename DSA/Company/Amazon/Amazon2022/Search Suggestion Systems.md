![[search_suggestion_systems.py]]



## Search Suggestions System

### Problem Statement

You are given an array of strings `products` and a string `searchWord`.
Design a system that suggests at most three product names from `products` after each character of `searchWord` is typed.
Suggested products should have a common prefix with `searchWord`.
If there are more than three products with a common prefix, return the three lexicographically minimum products.

**Lexicographically** means **alphabetical order**, just like words are ordered in a dictionary.

Return a list of lists of the suggested products after each character of `searchWord` is typed.

https://leetcode.com/problems/search-suggestions-system/


### Examples

### Example 1

**Input:**
```python
products = ["mobile", "mouse", "moneypot", "monitor", "mousepad"]
searchWord = "mouse"
```

**Output:**
```python
[
    ["mobile", "moneypot", "monitor"],
    ["mobile", "moneypot", "monitor"],
    ["mouse", "mousepad"],
    ["mouse", "mousepad"],
    ["mouse", "mousepad"]
]
```

**Explanation:**
- Products sorted lexicographically: `["mobile", "moneypot", "monitor", "mouse", "mousepad"]`.
- After typing `m` and `mo`, all products match, so we show: `["mobile", "moneypot", "monitor"]`.
- After typing `mou`, `mous`, and `mouse`, the system suggests: `["mouse", "mousepad"]`.

### Example 2

**Input:**
```python
products = ["havana"]
searchWord = "havana"
```

**Output:**
```python
[
    ["havana"],
    ["havana"],
    ["havana"],
    ["havana"],
    ["havana"],
    ["havana"]
]
```

**Explanation:**
- The only word `"havana"` will always be suggested while typing the search word.

### Constraints

- `1 <= products.length <= 1000`
- `1 <= products[i].length <= 3000`
- `1 <= sum(products[i].length) <= 2 * 10^4`
- All the strings of products are unique.
- `products[i]` consists of lowercase English letters.
- `1 <= searchWord.length <= 1000`
- `searchWord` consists of lowercase English letters.



## Solution


Here’s a crisp version of the `search_suggestions_3` function in Python syntax, focusing on clarity and brevity:

```python
def search_suggestions_3(products: List[str], searchWord: str) -> List[List[str]]:
    products.sort()
    left_ptr, right_ptr = 0, len(products) - 1
    result = []

    for letter in searchWord:
        # Move left pointer
        while left_ptr <= right_ptr and (len(products[left_ptr]) <= len(result) or products[left_ptr][len(result)] != letter):
            left_ptr += 1
        # Move right pointer
        while left_ptr <= right_ptr and (len(products[right_ptr]) <= len(result) or products[right_ptr][len(result)] != letter):
            right_ptr -= 1

        # Get number of matches
        words_left = right_ptr - left_ptr + 1
        result.append(products[left_ptr:left_ptr + min(3, words_left)])

    return result
```

### Key Changes:
- **Simplified Pointer Movement**: The conditions for moving the pointers now use `len(result)` directly for clarity.
- **Concise Result Appending**: Instead of multiple conditions, we use slicing to append the top 3 matches directly.
- **Iterating Directly Over Letters**: The loop uses the letter directly instead of indexing. 

This maintains clarity while making the function more succinct.


![[search_suggestion_systems.py]]

{

to check below solutions!
soln given by chatGpt


Here are several approaches to solving the Search Suggestions System problem, each with varying levels of complexity and efficiency:

### 1. **Naive Approach**
- **Description**: For each prefix of the `searchWord`, iterate through the entire `products` list to find matches.
- **Complexity**: O(m * n) where `m` is the length of `searchWord` and `n` is the number of products.
- **Implementation**:
    ```python
    def suggested_products(products, searchWord):
        result = []
        for i in range(1, len(searchWord) + 1):
            prefix = searchWord[:i]
            matches = [p for p in products if p.startswith(prefix)]
            result.append(sorted(matches)[:3])
        return result
    ```

### 2. **Sorting + Prefix Matching**
- **Description**: Sort the products first. Then for each prefix of `searchWord`, use binary search to efficiently find matching products.
- **Complexity**: O(n log n) for sorting, and O(m log n) for the binary search part.
- **Implementation**:
    ```python
    import bisect

    def suggested_products(products, searchWord):
        products.sort()
        result = []
        prefix = ""

        for char in searchWord:
            prefix += char
            # Find the first index where the prefix would fit
            index = bisect.bisect_left(products, prefix)
            matches = []
            # Gather up to 3 matches
            for i in range(index, min(index + 3, len(products))):
                if products[i].startswith(prefix):
                    matches.append(products[i])
            result.append(matches)
        return result
    ```

### 3. **Trie (Prefix Tree)**
- **Description**: Construct a Trie from the products, and then traverse the Trie according to the characters in `searchWord` to collect suggestions.
- **Complexity**: O(n * k) for building the Trie, and O(m * k) for traversing it, where `k` is the average length of the product names.
- **Implementation**:
    ```python
    class TrieNode:
        def __init__(self):
            self.children = {}
            self.products = []

    class Trie:
        def __init__(self):
            self.root = TrieNode()

        def insert(self, product):
            node = self.root
            for char in product:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
                if len(node.products) < 3:
                    node.products.append(product)

    def suggested_products(products, searchWord):
        trie = Trie()
        for product in sorted(products):
            trie.insert(product)

        result = []
        node = trie.root
        for char in searchWord:
            if char in node.children:
                node = node.children[char]
            else:
                node = TrieNode()  # No further matches possible
            result.append(node.products)
        return result
    ```

### 4. **Optimized Prefix Search Using a Sorted List**
- **Description**: Keep the products sorted and use a list to track valid matches as characters are added to the prefix.
- **Complexity**: O(n log n) for sorting, followed by O(m) for the prefix check.
- **Implementation**:
    ```python
    def suggested_products(products, searchWord):
        products.sort()
        result = []
        prefix = ""

        for char in searchWord:
            prefix += char
            matches = [p for p in products if p.startswith(prefix)]
            result.append(matches[:3])
        return result
    ```

### Summary of Approaches
- **Naive Approach**: Simple but inefficient for large datasets.
- **Sorting + Prefix Matching**: More efficient with a significant speed-up from sorting and binary search.
- **Trie**: Very efficient for prefix searches, especially with many products and varying lengths.
- **Optimized Prefix Search**: A mix of sorting and maintaining state, suitable for many use cases.

Each of these approaches has its own advantages and trade-offs, so the best choice depends on the specific requirements and constraints of your application.



}



Search Suggestion Systems: https://leetcode.com/problems/search-suggestions-system/
for more - see above line discussion section




Temp

repl.it

```
from typing import List


def main():

    def suggested_products(prodcuts: List[str],
                           searchWord: str) -> List[List[str]]:
        sorted_products = sorted(prodcuts)
        print("# sorted products", sorted_products)

        start_index = 0
        end_index = len(searchWord) - 1

        ans = []
        for i in range(len(searchWord)):

            subWord = searchWord[0:i + 1]
            subset = sorted_products[start_index:end_index + 1]
            print('subword', subWord, 'subset', subset)

            temp_start_index = -1
            for j in range(len(subset)):
                word = subset[j]
                if (word.startswith(subWord)):
                    temp_start_index = j
                    break

            if (temp_start_index == -1):
                ans.append([])
                continue

            start_index = temp_start_index

            temp_end_index = -1

            for k in range(len(subset) - 1, start_index, -1):
                word = subset[k]
                if (word.startswith(subWord)):
                    temp_end_index = len(subset) - k
                    break

        return []

    test_data_set = [{
        "input": {
            "products": ["mobile", "mouse", "moneypot", "monitor", "mousepad"],
            "searchWord": "mouse",
        },
        "output": [["mobile", "moneypot", "monitor"],
                   ["mobile", "moneypot", "monitor"], ["mouse", "mousepad"],
                   ["mouse", "mousepad"], ["mouse", "mousepad"]]
    }]

    for test_data in test_data_set:
        input_products = test_data["input"]["products"]
        input_searchWord = test_data["input"]["searchWord"]
        output = test_data["output"]

        result = suggested_products(input_products, input_searchWord)

        print("### ", result)

        if (result != output):
            print("failed")


main()

```