

revert commit 

There are several ways to revert a commit in Git depending on what exactly you want to do. Here's a breakdown:

---

### 🔄 **1. Revert a commit (safe, creates a new commit)**

This is the safest way, especially for public/shared branches.

```bash
git revert <commit_hash>
```

- This creates a new commit that **undoes** the changes of the specified commit.
    
- Doesn't change commit history—safe for use on shared branches.
    

---

### 🧹 **2. Reset to a previous commit (dangerous on shared branches)**

#### 🧪 Soft reset (keeps changes in working directory and staging area)

```bash
git reset --soft <commit_hash>
```

#### 🧶 Mixed reset (default — keeps changes in working directory, but unstaged)

```bash
git reset <commit_hash>
```

#### 🔥 Hard reset (discards all changes — use with caution!)

```bash
git reset --hard <commit_hash>
```

- These commands **move the branch pointer** and optionally discard changes.
    
- Avoid on shared/public branches unless you're confident no one else relies on this history.
    

---

### 💡 Pro Tip: To undo the most recent commit

```bash
git reset --soft HEAD~1       # Keeps changes staged
git reset --mixed HEAD~1      # Keeps changes unstaged
git reset --hard HEAD~1       # Discards all changes
```

or to revert the last commit safely:

```bash
git revert HEAD
```

---

Let me know your situation (e.g., committed by mistake and pushed, or want to change local commit), and I can recommend the best approach.



git commit

To get the **commit hash** in Git, you have a few options:

---

### ✅ **1. `git log` (most common)**

```bash
git log
```

You’ll see output like this:

```
commit 1a2b3c4d5e6f7g8h9i0j (HEAD -> main)
Author: Your Name <you@example.com>
Date:   Mon Apr 21 12:34:56 2025 +0000

    Your commit message here
```

- The long string after `commit` (e.g., `1a2b3c4d5e6f7g8h9i0j`) is the **commit hash**.
    
- You can copy the **first 7 characters** if you want a shortened version (e.g., `1a2b3c4`).
    

---

### ✅ **2. Show just hashes**

```bash
git log --oneline
```

Example output:

```
1a2b3c4 Fix bug in login flow
d5e6f7g Add new API endpoint
...
```

---

### ✅ **3. For the latest commit only**

```bash
git rev-parse HEAD
```

Or for a short version:

```bash
git rev-parse --short HEAD
```

---

Want to grab the hash of a specific commit (like second or third one)? Or need to use it for revert/reset?