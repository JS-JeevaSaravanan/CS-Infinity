

 **“signoff”** usually refers to a **Git sign-off line** added to commits.

Example:

```text
Signed-off-by: Jeeva Saravanan <you@example.com>
```

This comes from the Git feature:

```bash
git commit --signoff
```

(or `git commit -s`)

---

# What it means

A sign-off is a declaration that:

> “I wrote this code or have the right to contribute it.”

It’s commonly used in:

- Linux kernel development
    
- open source projects
    
- corporate contribution workflows
    

Based on the **Developer Certificate of Origin (DCO)**.

---

# In Zed specifically

When you see:

- “Sign off commit”
    
- “Enable signoff”
    
- “Commit signoff”
    

Zed is simply helping you create:

```text
Signed-off-by: Your Name <email>
```

automatically in commit messages.

---

# Example

Without signoff:

```text
Add TCP echo server
```

With signoff:

```text
Add TCP echo server

Signed-off-by: Jeeva <jeeva@example.com>
```

---

# Do you need it?

## Usually NO for personal learning projects

You can ignore it safely.

---

## YES if:

- contributing to OSS projects
    
- repo requires DCO
    
- company workflow mandates it
    

GitHub often checks this automatically.

---

# Enable manually in Git

Global config:

```bash
git config --global format.signoff true
```

Then every commit uses signoff automatically.

---

# Important distinction

This is NOT:

- cryptographic signing
    
- SSH signing
    
- GPG signing
    

Those verify identity/security.

“Signoff” is mostly a legal/contribution acknowledgment.