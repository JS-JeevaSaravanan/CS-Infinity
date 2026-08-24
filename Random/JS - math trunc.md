
Math.trunc(Number(pageSize)) does two things:

Number(pageSize) converts pageSize to a number.
Math.trunc(...) removes the decimal part, moving toward 0.

Examples:

Math.trunc(Number("10.8"))  // 10
Math.trunc(Number("10.2"))  // 10
Math.trunc(Number("-10.8")) // -10
Math.trunc(Number("5"))     // 5


So if:

pageSize = "20.7";


then:

Math.trunc(Number(pageSize))


returns:

20

Why use Math.trunc?

It's useful when you want to ensure pageSize is an integer.

Note that Math.trunc() is different from Math.floor() for negative numbers:

Math.trunc(-10.8) // -10
Math.floor(-10.8) // -11


For a pagination pageSize, this is typically being used to convert something like "25.5" into 25.
