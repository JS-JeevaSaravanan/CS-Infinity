Renaming a Git branch depends on whether it's **local only** or already pushed to a remote.

---

## 🔹 Rename current local branch

```bash
git branch -m new-branch-name
```

---

## 🔹 Rename a different local branch

```bash
git branch -m old-branch-name new-branch-name
```

---

## 🔹 If the branch is already pushed to remote (e.g. `origin`)

You need to **rename locally + update remote**:

### 1. Rename locally

```bash
git branch -m old-branch-name new-branch-name
```

### 2. Delete old branch on remote

```bash
git push origin --delete old-branch-name
```

### 3. Push new branch

```bash
git push origin new-branch-name
```

### 4. Set upstream tracking

```bash
git push --set-upstream origin new-branch-name
```

---

## 🔹 If you're currently on the branch

You can simplify:

```bash
git branch -m new-branch-name
git push origin --delete old-branch-name
git push --set-upstream origin new-branch-name
```

---

## ⚠️ Notes

- Anyone else using the old branch must **re-fetch and switch**:
    
    ```bash
    git fetch origin
    git checkout new-branch-name
    ```
    
- PRs in platforms like GitHub/Bitbucket may auto-update, but verify.
    

---

If you want, tell me your exact scenario (PR open? shared branch? protected branch?), I’ll give a safer sequence.