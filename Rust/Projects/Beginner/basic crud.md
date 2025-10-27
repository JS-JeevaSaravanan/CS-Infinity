


## load json file data


```rust
use serde::{Deserialize, Serialize};

const DATA_FILE : &str = "data.json";

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Item {
	id: u32,
	name: String,
}

fn load_data() -> Vec<Item> {
    let data = fs::read_to_string(DATA_FILE).unwrap_or_else(|_| "[]".to_string());
    serde_json::from_str(&data).unwrap_or_default()
}
```

### What it does:

This function **loads and parses JSON data** from a file (whose path is `DATA_FILE`) and returns a vector of `Item` structs.

---

### Step-by-step breakdown:

1. **`fs::read_to_string(DATA_FILE)`**
    
    - Tries to read the entire file into a `String`.
        
2. **`.unwrap_or_else(|_| "[]".to_string())`**
    
    - If reading the file fails (e.g., file not found), it defaults to `"[]"`, which is an empty JSON array.
        
3. **`serde_json::from_str(&data)`**
    
    - Attempts to parse the JSON string into a `Vec<Item>` using `serde_json`.
        
4. **`.unwrap_or_default()`**
    
    - If parsing fails (e.g., invalid JSON), it returns an empty `Vec<Item>` as the default.
        

---

### In one line:

> It reads a JSON file and deserializes it into a vector of `Item`s, falling back to an empty list if the file is missing or invalid.




---

## Shared data 

```rust
use actix_web::{web};

let shared_data = web::Data::new(Mutex::new(initial_data));
```

---

### What it does:

It wraps `initial_data` in a `Mutex` and then wraps that in `web::Data` so it can be **safely shared across multiple threads** in a web server (usually with Actix-web).

---

### Step-by-step:

1. **`Mutex::new(initial_data)`**
    
    - Wraps the data in a **mutex** so only one thread can access it at a time.
        
    - Ensures **thread-safe** access for mutable state.
        
2. **`web::Data::new(...)`**
    
    - Wraps it in **Actix's application state container**, allowing the state to be **shared across handlers** in the web app.
        

---

### In one line:

> It creates a thread-safe, shared application state (`initial_data`) for use in Actix-web handlers.

---


Absolutely! Let’s break this down **crisply** and also **in-depth** so you get both clarity and understanding.

---

## Start Server:


```rust

use actix_web::{ App, HttpServer,};

HttpServer::new(move || {
    App::new()
        .app_data(shared_data.clone())
        .route("/items", web::get().to(get_items))
        .route("/items", web::post().to(create_item))
        .route("/items/{id}", web::put().to(update_item))
        .route("/items/{id}", web::delete().to(delete_item))
})
.bind(("127.0.0.1", 8080))?
.run()
.await
```

---

### 💡 **What it does (crisp summary):**

> It creates and runs an Actix web server on `127.0.0.1:8080` with four routes for CRUD operations on `/items`, all sharing a common app state.

---

### 🔍 Line-by-Line Deep Explanation:

---

### 1. `HttpServer::new(move || { ... })`

- **Creates a new HTTP server instance**.
    
- Takes a closure that **builds the app for each worker thread**.
    
- `move` is required to **move ownership** of `shared_data` into the closure (for thread safety).
    

---

### 2. `App::new()`

- Creates a **new Actix web application**.
    
- This is where we define routes, middleware, and app-level data.
    

---

### 3. `.app_data(shared_data.clone())`

- Adds the **shared application state** (like a DB or in-memory store).
    
- Uses `.clone()` because **each worker thread** gets its own copy of the pointer (`Arc` behind `web::Data`), **not the data itself**.
    
- `shared_data` is typically something like `web::Data<Mutex<Vec<Item>>>`.
    

---

### 4. `.route("/items", web::get().to(get_items))`

- Defines a **GET /items** route.
    
- Calls the handler function `get_items`.
    

---

### 5. `.route("/items", web::post().to(create_item))`

- Defines a **POST /items** route.
    
- Calls `create_item` handler to create a new item.
    

---

### 6. `.route("/items/{id}", web::put().to(update_item))`

- Defines a **PUT /items/{id}** route.
    
- For updating an existing item by its `id`.
    

---

### 7. `.route("/items/{id}", web::delete().to(delete_item))`

- Defines a **DELETE /items/{id}** route.
    
- For deleting an item by its `id`.
    

---

### 8. `.bind(("127.0.0.1", 8080))?`

- Binds the server to the local IP `127.0.0.1` and port `8080`.
    
- The `?` propagates any error if binding fails.
    

---

### 9. `.run().await`

- Starts the server and begins handling requests **asynchronously**.
    
- `await` ensures it runs until manually stopped.
    

---

### ✅ Summary:

This block sets up a fully functional RESTful API server in Actix-web that:

- Listens on port `8080`
    
- Handles CRUD operations on `/items`
    
- Shares mutable state (`shared_data`) across routes safely using `Mutex` + `web::Data`
    

---
