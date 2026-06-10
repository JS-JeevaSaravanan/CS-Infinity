


### Problem:

- You have **3 boxes**, each containing **50 balls**:
    1. One box contains **only blue balls**.
    2. One box contains **only orange balls**.
    3. One box contains **a mix of blue and orange balls**.
- All the boxes are **mislabeled**. This means none of the labels (e.g., "Blue", "Orange", "Mixed") correctly describe the contents of the box.

### Task:

Determine the contents of each box by drawing a single ball **only once** from one box.

---

### Solution:

1. **Choose the box labeled "Mixed"**:
    
    - Since all boxes are mislabeled, the box labeled "Mixed" cannot actually contain mixed balls. It must either contain **only blue balls** or **only orange balls**.
2. **Draw a single ball from the "Mixed" box**:
    
    - If the ball you draw is **blue**, the box contains only blue balls.
    - If the ball you draw is **orange**, the box contains only orange balls.
3. **Relabel the other boxes based on elimination**:
    
    - The box labeled "Blue" must now contain the **Mixed** balls (because it is mislabeled).
    - The box labeled "Orange" must contain the **remaining color** (e.g., if "Mixed" was blue, this will be orange).

---

### Example Walkthrough:

- Suppose you draw a **blue ball** from the "Mixed" box:
    
    - The "Mixed" box is actually the **Blue** box.
    - The box labeled "Blue" must contain the **Mixed** balls.
    - The box labeled "Orange" must contain the **Orange** balls.
- Suppose you draw an **orange ball** from the "Mixed" box:
    
    - The "Mixed" box is actually the **Orange** box.
    - The box labeled "Blue" must contain the **Mixed** balls.
    - The box labeled "Orange" must contain the **Blue** balls.

By drawing **just one ball**, you can deduce the contents of all three boxes!


### Recap:

You have three boxes, each mislabeled:

- Box 1: Labeled "Blue"
- Box 2: Labeled "Orange"
- Box 3: Labeled "Mixed"

None of these labels match the actual contents of the box. After drawing a single ball from the box labeled "Mixed," you deduce its true contents. Based on this, you can determine the contents of the other two boxes because they are also mislabeled.

---

### Step-by-Step Relabeling Logic:

1. **Draw a ball from the box labeled "Mixed":**
    
    - If the ball is **Blue**, this box contains only **Blue balls**.
    - If the ball is **Orange**, this box contains only **Orange balls**.
2. **Relabeling the Other Boxes:**
    
    - **Key Rule**: Since all the boxes are mislabeled, the label on each box must correspond to the contents of another box.

#### Case 1: The "Mixed" Box Contains Only Blue Balls

- The box labeled "Mixed" is the **Blue** box.
- The box labeled "Blue" must contain the **Mixed (blue + orange)** balls (because it cannot contain only Blue).
- The box labeled "Orange" must contain the **Orange** balls.

#### Case 2: The "Mixed" Box Contains Only Orange Balls

- The box labeled "Mixed" is the **Orange** box.
- The box labeled "Orange" must contain the **Blue** balls.
- The box labeled "Blue" must contain the **Mixed (blue + orange)** balls.

---

### How Relabeling Works:

By eliminating the wrong labels and deducing the contents of one box, you can assign the correct labels to all three boxes. This is possible because:

1. Each label must be **wrong**, meaning it can't describe the actual contents of the box it's on.
2. The process of elimination ensures you can uniquely assign the correct contents to the remaining boxes.
3. 