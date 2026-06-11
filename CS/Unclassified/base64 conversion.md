

When you convert a JSON string (or any text) to Base64, you are essentially trading space for "transportability." Since Base64 uses a 64-character alphabet to represent 8-bit data, it is inherently less efficient.

### The Quick Answer

The length of your data will increase by approximately **33% to 37%**.

The standard rule of thumb is a **4/3 increase**. For every 3 bytes of original data, Base64 uses 4 characters.

---

### Why the Increase Happens

Base64 works by taking groups of 24 bits (3 bytes) and re-mapping them into four 6-bit chunks. Each 6-bit chunk corresponds to one character in the Base64 index.

### The Calculation

If you want to be precise, the formula for the output length (in bytes) is:

$$L_{out} = 4 \times \lceil \frac{n}{3} \rceil$$

Where:

- **$n$** is the length of the original JSON string.
    
- The **ceiling function** $\lceil \dots \rceil$ accounts for the "padding" characters (`=`) added to the end to make the output a multiple of 4.
    

### Example Comparison

|**JSON String Length**|**Base64 Encoded Length**|**% Increase**|
|---|---|---|
|100 bytes|136 bytes|36%|
|1,000 bytes|1,336 bytes|33.6%|
|10,000 bytes|13,336 bytes|33.36%|

---

### Important Considerations

- **JSON Content:** If your JSON contains a lot of special characters or non-ASCII data (like emojis or foreign scripts), those characters might already be multi-byte in UTF-8. Base64 encodes the _bytes_, so the 33% increase applies to the byte-count of the encoded string, not necessarily the character count of the original text.
    
- **URL Safety:** If you are using "URL-safe" Base64, the length remains the same, but `+` and `/` are replaced with `-` and `_`.
    
- **Overhead:** While 33% is the mathematical limit, small strings see a higher percentage of growth due to the padding characters.
    

Are you planning to pass this Base64 string through a URL or an API header, where character limits might be an issue?

