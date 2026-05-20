

# Stacked PRs: The Fastest Way to Ship Without Chaos

Most pull requests fail for one reason: they become too big.

A feature starts small, then grows:

- database changes
    
- API updates
    
- UI tweaks
    
- refactors
    
- tests
    
- cleanup
    

Soon, reviewers are staring at a 2,000-line PR nobody wants to touch.

That’s where **stacked PRs** help.

---

## What Are Stacked PRs?

Instead of one massive pull request, you split work into a sequence of smaller PRs that build on each other.

Example:

```text
main
 └── PR #1: database schema
      └── PR #2: backend API
           └── PR #3: frontend integration
                └── PR #4: cleanup + tests
```

Each PR is:

- small
    
- reviewable
    
- mergeable
    
- focused on one concern
    

Reviewers only look at the incremental change.

---

## Why Teams Love Them

### Faster Reviews

Small PRs get reviewed quickly. Large PRs sit for days.

### Better Feedback

Reviewers understand context instead of scanning endless diffs.

### Lower Risk

If something breaks, the blast radius is tiny.

### Parallel Progress

You don’t block on one giant merge.

### Cleaner Git History

Each commit chain tells a clear story.

---

## The Mental Shift

Traditional workflow:

> “Finish everything → Open one PR”

Stacked workflow:

> “Ship layers continuously”

You stop thinking in features.  
You start thinking in increments.

---

## Example

Instead of this:

```text
PR: "Add payments system"
```

Do this:

```text
PR #1: payment models
PR #2: Stripe client
PR #3: checkout API
PR #4: frontend flow
PR #5: retries + logging
```

Now every review is manageable.

---

## Rules for Good Stacked PRs

### 1. One Concern Per PR

Don’t mix refactors with feature logic.

### 2. Keep Them Small

Ideal size:

- 100–400 lines
    
- easy to review in 10 minutes
    

### 3. Base Each PR Correctly

Each branch branches from the previous one, not `main`.

### 4. Rebase Frequently

Avoid painful merge conflicts later.

### 5. Merge Bottom-Up

The stack collapses cleanly into `main`.

---

## Common Mistakes

### Huge “temporary” PRs

If you say:

> “Ignore the first 30 files”

…the PR is too big.

### Hidden Dependencies

Every PR should still make logical sense alone.

### Long-Lived Stacks

Stacks should move fast. Old stacks rot quickly.

---

## Best Tools

Teams commonly use:

- GitHub stacked diffs
    
- Graphite
    
- GitTown
    
- Gerrit
    
- plain Git + disciplined branching
    

But tooling matters less than the habit.

---

## When NOT to Use Stacked PRs

Avoid them for:

- tiny typo fixes
    
- urgent hotfixes
    
- ultra-small features
    

Stacks shine when work is:

- multi-layered
    
- cross-functional
    
- longer than a day or two
    

---

## Final Thought

Stacked PRs optimize for something most teams underestimate:

**review velocity**.

The best engineers don’t just write good code.  
They make their code easy to review, merge, and trust.

Small PRs scale teams.  
Stacked PRs scale delivery.



to check {

https://www.aviator.co/blog/stacked-prs-code-changes-as-narrative/

https://www.git-tower.com/blog/stacked-prs


}