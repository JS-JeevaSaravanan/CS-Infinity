
```gleam
import gleam/io

fn add_ten(a: Int) -> Int {
  a + 10
}

fn add_two_numbers(a: Int, b: Int) -> Int {
  a + b
}

pub fn main() {
  let add_twelve1 = fn(x) {
    let y = x + 2
    add_ten(y)
  }

  let add_ten_2 = add_ten(_)
  let add_twelve_2 = add_two_numbers(_, 12)

  let doubled_number1 = fn(number) { add_two_numbers(number, number) }
  // let doubled_number2 = add_two_numbers(_,_)
  // Syntax error
  // There is more than 1 argument hole in this function call.

  let doubled_number2 = fn(x) { add_two_numbers(x, x) }

  io.debug(add_twelve1(11))
  //=> 23
  io.debug(add_ten_2(11))
  //=> 21
  io.debug(add_twelve_2(11))
  //=> 23

  io.debug(doubled_number1(11))
  //=.> 22
  io.debug(doubled_number2(11))
  //=> 22
}

```



