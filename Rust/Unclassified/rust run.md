
To check if Rust is installed on your system using the terminal, you can run the following command:

```bash
rustc --version
```

If Rust is installed, this command will output the version number of the Rust compiler. If it’s not installed, you’ll see an error message indicating that `rustc` is not found.

You can also check for the Rust toolchain with:

```bash
cargo --version
```

This checks for Cargo, Rust's package manager, which is typically installed alongside Rust.

If you need to install Rust, you can do so using the official installer by running:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

This will guide you through the installation process.



Here's a simple "Hello, World!" program in Rust:

```rust
fn main() {
    println!("Hello, world!");
}
```

### How to Run It:

1. **Create a New Rust Project:**
   Open your terminal and create a new project with Cargo (Rust's package manager):

   ```bash
   cargo new hello_world
   cd hello_world
   ```

2. **Replace the `main.rs`:**
   Open `src/main.rs` in your favorite text editor and replace its contents with the above code.

3. **Run the Program:**
   Back in your terminal, run:

   ```bash
   cargo run
   ```

You should see the output:

```
Hello, world!
```

That's it! You've successfully written and run a Rust program.


To quickly run a Rust program without creating a full project with Cargo, you can use the Rust Playground or a single-file approach. Here’s how to do it:

### Using Rust Playground

1. **Visit the Rust Playground:** Go to [play.rust-lang.org](https://play.rust-lang.org/).
2. **Enter Your Code:** You can paste your Rust code (like the "Hello, World!" example) in the editor.
3. **Run the Code:** Click the "Run" button to execute it and see the output.

### Running a Single-File Program Locally

If you have Rust installed, you can create and run a simple Rust program directly in the terminal:

1. **Create a File:**
   Open your terminal and create a new Rust file, for example:

   ```bash
   echo 'fn main() { println!("Hello, world!"); }' > hello.rs
   ```

2. **Run the Program:**
   Use the Rust compiler `rustc` to run the file:

   ```bash
   rustc hello.rs && ./hello
   ```

This will compile the program and execute it, showing the output:

```
Hello, world!
```

That's it! You can run any Rust program using this method.


