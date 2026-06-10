

Reffered {  
  
[https://www.youtube.com/watch?v=GWYhtksrmhE](https://www.youtube.com/watch?v=GWYhtksrmhE)

}

In this video, the speaker discusses a set of rules known as the "Power of 10" that NASA follows to write reliable and statically analyzable code for their space missions. These rules are designed to prevent code crashes and ensure safety in extreme scenarios. Here is a summary of the key points covered in the video:

1. Simple Control Flow: NASA avoids using go-to statements, set jump, long jump, or recursion. Recursive code can be hard to follow and can lead to crashes, especially in embedded systems.
2. Fixed Upper Bound for Loops: NASA gives all loops a fixed upper bound. Even when traversing a linked list, they set a maximum limit on the number of iterations to prevent runaway code.
3. Exclusive Use of Stack Memory: NASA recommends avoiding the use of the heap and exclusively using stack memory. This helps eliminate memory bugs, use-after-free errors, and memory leaks.
4. Functions Should Do One Thing: Functions should have a single responsibility and should not exceed 60 lines (about the size of a piece of paper). This promotes code readability, testability, and ensures that functions are concise and focused.
5. Data Hiding: NASA supports the idea of declaring variables at the lowest possible scope. This reduces the risk of erroneous values and makes debugging easier.
6. Check Return Values: All non-void function return values should be checked. Ignoring return values can lead to unexpected failures. Return values that are intentionally ignored should be explicitly cast to void.
7. Limit Use of the C Preprocessor: The C preprocessor should be limited to file inclusions and simple conditional macros. Conditional compilation can create multiple code variants, increasing testing requirements and reducing code clarity.
8. Restrict Pointer Use: Pointers should not be dereferenced more than one layer at a time. This enforces proper tracking of pointers and prevents misuse. Function pointers should be used sparingly as they complicate code analysis and testing.
9. Enable Compiler Warnings and Pedantic Mode: Code should be compiled with all warnings enabled and in pedantic mode. This helps catch potential issues and treats them as errors.
10. Use Static Code Analyzers and Unit Testing: Code should be analyzed using multiple static code analyzers with different rule sets. Additionally, thorough unit testing should be performed to ensure code reliability.

By following these rules, NASA aims to write code that is safe, easily analyzable, and testable, reducing the risk of code failures and crashes in critical systems.

