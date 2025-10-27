



![[BigOGraph.png]]


Big O :

https://www.bigocheatsheet.com/

https://bigocheatsheet.io/




### Understanding Big O Notation

Big O notation is a mathematical representation that describes the efficiency of an algorithm in terms of time complexity (how fast it runs) and space complexity (how much memory it uses). It provides a way to evaluate how the performance of an algorithm changes as the size of the input, denoted by \( n \), increases.

#### Key Points of Big O Notation

1. **Definition**: Big O expresses the upper bound of an algorithm’s running time or space requirement, allowing us to compare efficiencies.
2. **Variables**: The variable \( n \) represents the number of inputs. For example, if you have an array of 5 elements, \( n = 5 \).
3. **Growth Rates**: Algorithms with lower growth rates (e.g., \( O(1) \), \( O(\log n) \)) are generally more efficient than those with higher growth rates (e.g., \( O(n) \), \( O(n^2) \)).

#### Common Big O Functions (Best to Worst)

- \( O(1) \): Constant time
- \( O(\log n) \): Logarithmic time
- \( O(n) \): Linear time
- \( O(n \log n) \): Linearithmic time
- \( O(n^2) \): Quadratic time
- \( O(2^n) \): Exponential time
- \( O(n!) \): Factorial time

### Example: Comparing Algorithms

Let’s illustrate why Big O notation is important with an example involving two algorithms:

- **Algorithm A**: \( O(\log n) \)
- **Algorithm B**: \( O(n) \)

#### Scenario 1: Analyzing 10 Elements

For \( n = 10 \):
- \( O(\log(10)) \) ≈ 3.3 milliseconds
- \( O(10) \) = 10 milliseconds

With 10 elements, the difference in speed is noticeable but might not matter significantly in practice.

#### Scenario 2: Analyzing 10 Million Elements

Now consider \( n = 10,000,000 \):
- \( O(\log(10,000,000)) \) ≈ 23.3 milliseconds
- \( O(10,000,000) \) = 10,000,000 milliseconds (or about 2 hours and 47 minutes)

In this scenario, the performance gap becomes critical. A delay of 2 hours for a search engine would be unacceptable.

### Conclusion

Understanding Big O notation helps you evaluate algorithms' performance and make informed decisions when selecting the right algorithm for your project. As seen, even a small difference in complexity can lead to vastly different performance outcomes with larger datasets.

If you're interested in diving deeper, consider exploring resources that detail the complexities of various data structures and algorithms. This foundational knowledge is invaluable for software engineering and algorithm design!





