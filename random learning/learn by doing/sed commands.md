
**`sed`** (short for _stream editor_) is a Unix command-line utility used to **process and transform text streams**—typically files or piped input—without opening an editor.

---

## 🧠 What it’s used for

- Search and replace text
    
- Delete or filter lines
    
- Insert or append content
    
- Perform pattern-based transformations
    

It works **line by line**, making it fast and script-friendly.

---

## ⚙️ Basic Syntax

```bash
sed [options] 'command' file
```

---

## 🔧 Common `sed` Commands

### 1. Replace text (most common)

```bash
sed 's/old/new/' file
```

- Replaces **first occurrence per line**
    

👉 Replace all occurrences:

```bash
sed 's/old/new/g' file
```

---

### 2. Edit file in-place

```bash
sed -i 's/old/new/g' file.txt
```

- Modifies the file directly
    

---

### 3. Delete lines

```bash
sed '2d' file.txt
```

- Deletes line 2
    

```bash
sed '/error/d' file.txt
```

- Deletes lines containing "error"
    

---

### 4. Print specific lines

```bash
sed -n '1,5p' file.txt
```

- Prints lines 1–5
    

---

### 5. Insert / Append

```bash
sed '2i New line' file.txt   # insert before line 2
sed '2a New line' file.txt   # append after line 2
```

---

## 🧪 Real-world examples

### Replace environment variable in config

```bash
sed -i 's/localhost/production-db/' .env
```

---

### Remove empty lines

```bash
sed '/^$/d' file.txt
```

---

### Replace only in matching lines

```bash
sed '/error/s/foo/bar/' logs.txt
```

---

## 🧠 Mental Model

Think of `sed` as:

> “Apply a transformation rule to each line of input”

---

## ⚡ When to use `sed` vs others

|Tool|Use case|
|---|---|
|`sed`|Quick inline text transformations|
|`awk`|Structured text processing|
|`grep`|Searching/filtering|
|editors (vim)|manual editing|

---

## 🚀 Why devs love it

- Works great in **CI/CD pipelines**
    
- Perfect for **automation scripts**
    
- No need to open files manually
    
- Extremely fast for large files
    

---

If you want, I can show:

- `sed` tricks used in **GitHub Actions / CI**
    
- Or how to use it for **codebase-wide refactors safely**