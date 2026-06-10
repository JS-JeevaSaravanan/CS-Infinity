


# What Actually Happens When You Run `git commit`

You have typed:

```bash
git commit -m "message"
```

thousands of times.

It is probably muscle memory now:

1. Stage files
    
2. Write a message
    
3. Hit Enter
    

Done in half a second.

But inside that half second, Git performs a surprisingly elegant sequence of operations.

And once you understand what really happens, Git stops feeling magical.

Its design is actually shockingly simple.

This article traces a single `git commit` from:

- your keystroke
    
- all the way to Git storing immutable objects on disk.
    

---

# Git’s Three Layers

Git views your project in **three separate layers**.

---

## 1. Working Directory

These are the actual files you edit.

Example:

```text
project/
 ├── app.js
 ├── package.json
 └── README.md
```

This is your normal filesystem.

---

## 2. Staging Area (Index)

The staging area is Git’s preparation zone.

When you run:

```bash
git add app.js
```

you are placing changes into the staging area.

Git calls this internal structure the **Index**.

---

## 3. Repository (`.git` Directory)

This is where Git stores:

- commits
    
- trees
    
- blobs
    
- references
    
- history
    

Everything Git knows lives inside:

```text
.git/
```

---

# The Biggest Misconception About `git add`

Most developers think:

> "`git add` just marks files for the next commit."

That is not what actually happens.

The moment you run:

```bash
git add app.js
```

Git immediately:

4. Reads file contents
    
5. Compresses them using zlib
    
6. Computes a SHA-1 hash
    
7. Stores the result as an object inside `.git/objects`
    

Your data is already inside Git before you commit.

The commit itself is mostly about organizing references.

---

# Blob Objects — Git’s Fundamental Storage Unit

Git stores file contents as **Blob Objects**.

A blob contains:

- raw file contents
    
- nothing else
    

Importantly:

> A blob does NOT store the filename.

Git does not care whether content came from:

- `main.js`
    
- `README.md`
    
- `utils.py`
    

A blob only represents content.

---

# Why Git Separates Content from Filenames

This design enables powerful deduplication.

Git hashes content itself.

So:

```text
Same Content → Same Hash
```

If two files contain identical data:

- Git stores the content only once
    
- multiple filenames can reference the same blob
    

---

## Example

Suppose:

```text
license.txt
COPYING.txt
```

contain identical text.

Git stores:

- one blob
    
- referenced from two paths
    

This makes Git extremely storage-efficient.

---

# The Object Database

All Git objects live inside:

```text
.git/objects/
```

Each object is identified by its hash.

Example:

```text
e69de29bb2d1d6434b8b29ae775ad8c2e48c5391
```

Git uses the hash as:

- identity
    
- integrity verification
    
- lookup key
    

This is called a **content-addressable storage system**.

---

# The Staging Area (Index)

Now we have blobs stored in Git.

But Git still needs to know:

- which files belong in the next commit
    
- which blob corresponds to which file path
    

This is handled by the **Index**.

Stored here:

```text
.git/index
```

---

# What the Index Stores

The index maps:

```text
File Path → Blob Hash
```

Example:

|File|Blob Hash|
|---|---|
|app.js|a1b2c3|
|README.md|d4e5f6|

When you run:

```bash
git status
```

Git compares:

- working directory
    
- index
    
- latest commit
    

to determine what changed.

---

# The Shopping Cart Analogy

The index behaves like a shopping cart.

- Working directory = Store shelves
    
- `git add` = Put item into cart
    
- Index = Cart contents
    
- `git commit` = Final purchase
    

The commit freezes whatever is currently in the cart.

---

# What Happens When You Run `git commit`

Now the interesting part begins.

Suppose you run:

```bash
git commit -m "Initial feature"
```

Git performs several steps internally.

---

# Step 1 — Git Validates Changes

Git compares:

- current index
    
- current HEAD commit
    

If nothing changed:

```text
nothing to commit
```

and Git exits.

---

# Step 2 — Git Reads Your Identity

Git loads:

```bash
git config user.name
git config user.email
```

It checks:

8. Local config
    
9. Global config
    
10. System config
    

Git also records:

- timestamp
    
- timezone
    

This metadata becomes part of the commit object.

---

# Step 3 — Git Creates Tree Objects

Now Git constructs **Tree Objects**.

If:

- blobs = file contents
    

then:

- trees = directory structure
    

---

# What a Tree Contains

Each tree entry stores:

|Field|Meaning|
|---|---|
|Mode|File permissions/type|
|Type|blob or tree|
|Hash|Object hash|
|Filename|File or directory name|

---

# Example Tree Structure

```text
src/
 ├── app.js
 └── utils/
      └── helper.js
```

Git creates:

- root tree
    
- nested tree for `utils`
    
- blob objects for files
    

---

# Git’s Most Elegant Optimization

Suppose you modify:

```text
src/components/button.js
```

What changes?

Only objects along that path.

Git creates:

- new blob for `button.js`
    
- new tree for `components`
    
- new tree for `src`
    
- new root tree
    

Everything else remains untouched and reused.

---

# Why This Is Powerful

Git avoids duplicating entire project snapshots.

Unchanged objects are reused automatically.

Even massive repositories remain efficient because:

- most commits change very little
    
- most objects are shared
    

---

# Step 4 — Git Creates the Commit Object

Now Git creates the actual **Commit Object**.

A commit object is surprisingly small.

Usually around:

- 200 bytes
    
- plain text
    

---

# What a Commit Object Contains

---

## 1. Tree Pointer

```text
tree <tree-hash>
```

Points to the root tree representing the entire project snapshot.

---

## 2. Parent Pointer

```text
parent <previous-commit-hash>
```

Links history together.

This creates Git’s commit chain.

---

## 3. Author Information

```text
author John Doe <john@example.com>
```

Includes:

- name
    
- email
    
- timestamp
    

---

## 4. Committer Information

Usually identical to author.

Can differ during:

- rebases
    
- patch applications
    
- merges
    

---

## 5. Commit Message

Your message:

```text
"Initial feature"
```

---

# Git Hashes the Commit

Git now:

11. Serializes commit contents
    
12. Computes SHA-1 hash
    
13. Compresses object
    
14. Stores it in `.git/objects`
    

That hash becomes the permanent identity of the commit.

Example:

```text
aef123b45cd...
```

---

# Important Insight: Commits Are Immutable

Once created:

- commits never change
    
- blobs never change
    
- trees never change
    

Git objects are immutable forever.

Any modification creates entirely new objects.

---

# HEAD — How Git Knows Your Current Branch

Git tracks your current branch using:

```text
.git/HEAD
```

Usually it contains:

```text
ref: refs/heads/main
```

Meaning:

> “You are currently on the `main` branch.”

---

# Branches Are Just Tiny Text Files

Git then reads:

```text
.git/refs/heads/main
```

Inside is simply:

```text
<commit-hash>
```

That is the branch.

A branch is literally:

- a text file
    
- containing one commit hash
    

That is all.

---

# Step 5 — Git Moves the Branch Forward

After creating the new commit:

Git simply replaces:

```text
old-hash
```

with:

```text
new-hash
```

inside the branch file.

That single line update moves the branch forward.

---

# Why Branches Are So Fast

Creating a branch feels instant because Git is not:

- copying files
    
- cloning history
    
- duplicating snapshots
    

Git only creates:

```text
41-byte text file
```

containing a commit hash.

That’s the entire cost.

---

# Mutable Branches vs Immutable Commits

This distinction is crucial.

---

## Commits

Immutable.

Never modified.

---

## Branches

Mutable pointers.

Updated constantly.

---

# Merge Commits

Normal commits have:

- one parent
    

Merge commits have:

- multiple parents
    

Example:

```text
parent A
parent B
```

This allows Git to preserve parallel history.

---

# The Reflog — Git’s Safety Net

Git records reference changes inside:

```text
.git/logs/
```

This is called the **Reflog**.

Every update records:

- old hash
    
- new hash
    
- timestamp
    
- operation
    

---

# Why Reflog Is Important

Suppose you accidentally run:

```bash
git reset --hard
```

and “lose” commits.

Usually:

- commits still exist
    
- only references disappeared
    

You can recover them using:

```bash
git reflog
```

Reflog acts like Git’s undo history.

---

# Why Git Feels So Fast

Git’s design is surprisingly minimal.

Underneath:

- no complicated database
    
- no magical diff engine
    
- no huge metadata layer
    

Mostly just:

- compressed objects
    
- hashes
    
- text files
    
- pointers
    

That simplicity is what makes Git:

- fast
    
- reliable
    
- scalable
    

---

# The Entire `git commit` Flow Recap

In a fraction of a second, Git:

15. Reads the index
    
16. Validates changes
    
17. Reads author metadata
    
18. Creates blobs if needed
    
19. Builds tree objects
    
20. Creates commit object
    
21. Hashes and stores objects
    
22. Updates branch reference
    
23. Updates reflog
    

All almost instantly.

---

# The Deep Insight Behind Git

Git is fundamentally:

> A content-addressable object database connected by mutable references.

That’s it.

Everything else:

- branches
    
- merges
    
- rebases
    
- tags
    

is built on top of this simple model.

---

# Final Perspective

Once you understand Git internals:

- commits stop feeling mysterious
    
- branches stop feeling “heavy”
    
- rebases become understandable
    
- detached HEAD makes sense
    
- recovery becomes easier
    

And most importantly:

You stop fearing Git.

Because underneath all the commands and abstractions, Git is just:

- objects
    
- hashes
    
- trees
    
- pointers
    

elegantly connected together.


referred {

ByteMonk YT - git insanly fast
https://www.youtube.com/watch?v=E-CH3-VyVck


}


# 21. Git Does Not Store “Diffs” the Way Most People Think

One of the biggest misconceptions about Git is:

> “Git stores every commit as a diff.”

Not exactly.

Git primarily stores:

- complete snapshots
    
- using reusable objects
    

Each commit points to a full project tree.

The reason Git remains efficient is because:

- unchanged objects are reused
    
- identical content shares hashes
    

So Git behaves more like:

- a filesystem snapshot system
    

than a traditional patch-based version control system.

---

# 22. Why Git Hashes Everything

Git hashes:

- blobs
    
- trees
    
- commits
    
- tags
    

Every object gets a unique identifier.

This gives Git several powerful properties.

---

## 1. Integrity Verification

If object contents change:

- hash changes immediately
    

Corrupted objects become detectable instantly.

---

## 2. Deduplication

Same content:

- same hash
    
- same object reused
    

---

## 3. Immutable History

Because hashes include parent hashes:

```text
Commit A → Commit B → Commit C
```

changing an old commit changes:

- its hash
    
- every descendant hash
    

This makes history tampering obvious.

---

# 23. SHA-1 and Git’s Transition to SHA-256

Historically Git used:

- SHA-1 hashes
    

Example:

```text
e69de29bb2d1d6434b8b29ae775ad8c2e48c5391
```

But SHA-1 is now considered cryptographically weak.

Modern Git versions support:

- SHA-256 repositories
    

The core architecture remains identical:

- content → hash → object storage
    

Only the hashing algorithm changes.

---

# 24. Git Objects Are Just Compressed Text

A Git object is surprisingly simple.

Internally Git stores:

```text
<object-type> <size>\0<content>
```

Example blob:

```text
blob 14\0Hello World
```

Git then:

1. hashes it
    
2. compresses it with zlib
    
3. stores it
    

That simplicity is one reason Git is so portable and durable.

---

# 25. The Git Object Types

Git fundamentally has only four object types.

---

## 1. Blob

Stores:

- file contents
    

---

## 2. Tree

Stores:

- directory structure
    

---

## 3. Commit

Stores:

- metadata
    
- tree pointer
    
- parent pointer
    

---

## 4. Tag

Stores:

- named references to commits
    

Example:

```bash
git tag v1.0
```

Tags are essentially permanent bookmarks.

---

# 26. Lightweight Tags vs Annotated Tags

Git supports two kinds of tags.

---

## Lightweight Tag

Simple pointer to commit.

Like:

- a branch that never moves
    

---

## Annotated Tag

Stores metadata:

- author
    
- date
    
- message
    
- signature
    

Usually used for:

- releases
    
- versioning
    

---

# 27. Detached HEAD — What It Actually Means

One of Git’s most confusing states is:

```text
HEAD detached
```

But internally it is simple.

Normally:

```text
HEAD → branch → commit
```

Example:

```text
HEAD → main → abc123
```

In detached HEAD:

```text
HEAD → commit
```

HEAD points directly to a commit instead of a branch.

You can still:

- inspect history
    
- make commits
    
- experiment safely
    

But new commits are not attached to a branch unless you create one.

---

# 28. Why Rebasing Rewrites History

Rebase often feels mysterious.

But now you can understand it clearly.

A commit hash depends on:

- tree
    
- parent
    
- metadata
    

If parent changes:

- hash changes
    

So rebasing works by:

4. replaying commits
    
5. creating entirely new commit objects
    
6. attaching them to a different parent
    

Old commits remain unchanged.

Rebase creates new history rather than modifying existing commits.

---

# 29. Cherry-Pick — Copying Commits

`git cherry-pick`:

- copies a commit
    
- applies changes elsewhere
    
- creates a brand new commit object
    

Even if contents are identical:

- different parent
    
- different metadata
    
- new hash
    

This is why cherry-picked commits are not “the same” commit internally.

---

# 30. Merge vs Rebase — Internal Difference

Understanding internals makes this distinction easier.

---

# Merge

Creates:

- one new merge commit
    
- multiple parents
    

History remains branched.

---

# Rebase

Creates:

- entirely new commits
    
- linear history
    

Original commits remain untouched.

---

# 31. Git Checkout vs Git Switch

Historically:

```bash
git checkout
```

handled:

- branch switching
    
- file restoration
    
- detached HEAD
    

This overloaded behavior caused confusion.

Modern Git introduced:

```bash
git switch
git restore
```

to separate concerns.

Internally though:

- references still move the same way
    

---

# 32. The Working Tree Is Reconstructed from Objects

When you switch branches:

```bash
git switch feature
```

Git:

7. reads commit tree
    
8. reconstructs filesystem contents
    
9. writes files into working directory
    

Git essentially materializes:

- snapshots from object storage
    

into real files.

---

# 33. Packfiles — How Git Handles Huge Repositories

Loose objects work well initially.

But large repositories may contain:

- millions of objects
    

Storing all separately becomes inefficient.

Git solves this using:

- Packfiles
    

---

# What Packfiles Do

Git combines many objects into:

- compressed binary packs
    

Benefits:

- smaller storage
    
- faster cloning
    
- faster transfer
    

---

# Delta Compression

Inside packfiles Git can store:

```text
Object B = Object A + Changes
```

This is where Git starts using diffs internally for optimization.

Especially useful for:

- large source files
    
- repeated versions
    

---

# 34. Why Cloning Large Repositories Is Expensive

When you clone a repository:

```bash
git clone
```

Git downloads:

- commits
    
- trees
    
- blobs
    
- references
    
- tags
    

Potentially:

- years of history
    

Large repositories become expensive because:

- object graphs are huge
    

---

# 35. Shallow Clones

To optimize cloning:

```bash
git clone --depth=1
```

downloads:

- latest history only
    

Useful for:

- CI/CD pipelines
    
- temporary builds
    

Tradeoff:

- incomplete history
    

---

# 36. Git Fetch vs Git Pull

Many developers confuse these.

---

## Git Fetch

Downloads:

- commits
    
- references
    

But does NOT modify your branch.

---

## Git Pull

Actually performs:

```text
git fetch + git merge
```

(or rebase depending on configuration)

It updates your current branch automatically.

---

# 37. Remote Repositories Are Just More Git Repositories

GitHub, GitLab, Bitbucket:

- are not special Git systems
    

They are simply:

- Git repositories on remote machines
    

When pushing:

```bash
git push origin main
```

Git transfers:

- missing objects
    
- updated references
    

That’s it.

---

# 38. Git Push Is Mostly Object Synchronization

During push:

10. Git checks what remote already has
    
11. Sends only missing objects
    
12. Updates remote branch reference
    

Because Git objects are immutable:

- synchronization becomes efficient
    

---

# 39. Garbage Collection — Cleaning Unreachable Objects

Sometimes objects become unreachable.

Example:

- deleted branches
    
- abandoned commits
    

Git eventually cleans them using:

```bash
git gc
```

This:

- compresses objects
    
- removes unreachable data
    
- optimizes storage
    

---

# 40. Why Git Is Fundamentally Distributed

Traditional version control systems often rely on:

- centralized servers
    

Git does not.

Every clone contains:

- full history
    
- complete object database
    

Meaning:

- every developer has a full repository
    
- commits work offline
    
- branches work locally
    
- history is decentralized
    

This is one of Git’s most revolutionary ideas.

---

# 41. Git’s Mental Model (The Most Important Concept)

Most Git confusion disappears once you adopt the correct mental model.

Git is NOT:

- a filesystem backup tool
    
- a diff tracker
    
- a cloud sync tool
    

Git is:

> An immutable graph of content-addressed objects connected through references.

Everything follows from this idea.

---

# 42. The Real Reason Git Became So Successful

Git succeeded because it optimized for:

- speed
    
- integrity
    
- local operations
    
- branching efficiency
    
- distributed collaboration
    

But its deepest strength is architectural simplicity.

At its core Git is mostly:

- hashes
    
- trees
    
- blobs
    
- compressed files
    
- pointers
    

Very small primitives combined elegantly.

---

# Final Perspective

Once you deeply understand Git internals:

- commands stop feeling random
    
- recovery becomes easier
    
- rebasing becomes logical
    
- merge conflicts become explainable
    
- history rewriting becomes understandable
    

And eventually you realize:

Git is less like a “tool” and more like a tiny filesystem + graph database built entirely on immutable objects.

That is why it scales from:

- personal projects
    
- all the way to the Linux kernel itself.

