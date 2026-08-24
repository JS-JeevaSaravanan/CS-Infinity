
Byte Size: A Practical Guide to Bytes, Characters, Encoding, and Limits

When engineers encounter a requirement like:

“This field must not exceed 5,000 bytes.”

it is tempting to interpret that as:

“This field can contain 5,000 characters.”

That assumption is often wrong.

Understanding bytes, characters, encoding, and size limits is one of those small pieces of computer science that pays dividends everywhere: APIs, databases, files, HTTP requests, message queues, caching, authentication tokens, logging, and storage.

The central idea is simple:

Characters are what humans see. Bytes are what computers ultimately store or transmit. Encoding defines the relationship between them.

1. Start with the hierarchy

Think of text as passing through several representations:

Human text
   ↓
Characters
   ↓
Encoding
   ↓
Bytes
   ↓
Storage / network / database


For example:

Hello


contains 5 visible characters.

Under UTF-8:

H → 1 byte
e → 1 byte
l → 1 byte
l → 1 byte
o → 1 byte


So:

5 characters = 5 UTF-8 bytes


But:

こんにちは


contains 5 characters, while each character takes multiple bytes in UTF-8.

Therefore:

5 characters ≠ 5 bytes


This is the first concept to internalize.

2. What exactly is a byte?

A bit is a binary digit:

0 or 1


A byte is traditionally 8 bits:

1 byte = 8 bits


An 8-bit value can represent:

2⁸ = 256


different values:

0 → 255


Bytes are the fundamental unit you'll commonly encounter when talking about:

files
network payloads
encoded text
memory
database storage
binary protocols

You will see units such as:

B       byte
KB      kilobyte
MB      megabyte
GB      gigabyte
TB      terabyte


But there is an important naming trap.

1. KB vs KiB

There are two conventions.

Decimal units
1 KB = 1,000 bytes
1 MB = 1,000,000 bytes
1 GB = 1,000,000,000 bytes

Binary units
1 KiB = 1,024 bytes
1 MiB = 1,048,576 bytes
1 GiB = 1,073,741,824 bytes


The i matters:

KB  → decimal
KiB → binary


In everyday engineering conversations, people often use KB/MB loosely. But when precision matters, use the correct unit.

2. Characters are not bytes

Consider:

hello


There are:

5 characters


and in UTF-8:

5 bytes


Now consider:

café


Visually:

4 characters


But the é can occupy multiple bytes in UTF-8.

So the encoded representation may be:

c → 1 byte
a → 1 byte
f → 1 byte
é → 2 bytes


Total:

4 characters
5 bytes


This is why a requirement such as:

maxLength = 5000


must always be clarified.

Does it mean:

5,000 characters?


or:

5,000 bytes?


Those are different contracts.

3. Encoding is the missing piece

A computer does not inherently store the abstract concept of:

"é"


It stores numbers/bytes.

An encoding defines how characters are represented as bytes.

Common encodings include:

UTF-8
UTF-16
UTF-32
ASCII


For modern web applications, UTF-8 is overwhelmingly important.

The same character can therefore have different byte representations depending on the encoding.

That is why this:

"How many bytes is this string?"


is incomplete.

The real question is:

“How many bytes does this string occupy under which encoding?”

4. UTF-8 is variable-width

UTF-8 is particularly important because it uses a variable number of bytes per Unicode code point.

Broadly:

ASCII characters       → 1 byte
many Latin characters  → 2 bytes
many other scripts     → 3 bytes
many emoji             → 4 bytes


For example:

A


is:

1 byte


while:

€


uses:

3 bytes


and:

😀


uses:

4 UTF-8 bytes


This makes UTF-8 very space-efficient for ordinary English text while supporting essentially all modern writing systems.

5. Why 5,000 bytes does NOT mean 5,000 characters

Suppose your system says:

maximum size = 5,000 bytes


The maximum number of characters depends on the text.

ASCII-heavy text
hello world...


Mostly 1 byte per character.

Therefore:

≈ 5,000 characters

2-byte UTF-8 characters

Approximately:

5,000 / 2
≈ 2,500 characters

3-byte UTF-8 characters

Approximately:

5,000 / 3
≈ 1,666 characters

4-byte UTF-8 characters

Approximately:

5,000 / 4
= 1,250 characters


Therefore, the technically correct statement is:

A 5,000-byte UTF-8 limit allows anywhere from roughly 1,250 to 5,000 Unicode code points depending on the content.

And even that needs one more nuance.

6. Emoji teach an important lesson

Consider:

😀


You might think:

1 character


That's reasonable from a human perspective.

But JavaScript gives:

"😀".length


as:

2


Why?

Because JavaScript strings are based on UTF-16 code units, and this emoji is represented using a surrogate pair.

Meanwhile:

Buffer.byteLength("😀", "utf8")


gives:

4


So we have:

Human-perceived character: 1
JavaScript UTF-16 code units: 2
UTF-8 bytes: 4


These are three different measurements.

That distinction is extremely useful.

7. Four different notions of "length"

When dealing with text, you should distinguish at least these concepts:

8. Bytes
9. Code units
10. Unicode code points
11. Grapheme clusters


They answer different questions.

9.1 Bytes

Question:

How much encoded data is this?

For UTF-8 in Node.js:

Buffer.byteLength(text, 'utf8')


This is what you want when enforcing a byte-size limit.

9.2 UTF-16 code units

JavaScript's:

text.length


measures UTF-16 code units.

For example:

"😀".length
// 2


This is useful for understanding JavaScript's string representation, but it should not automatically be interpreted as "number of visible characters."

9.3 Unicode code points

A code point represents a Unicode value.

You can inspect them approximately using:

[...text].length


For:

😀


you get:

1


because the emoji is one Unicode code point.

But this still isn't necessarily the same as what a human perceives as one character.

9.4 Grapheme clusters

Consider:

👨‍👩‍👧‍👦


A user may perceive this as:

1 character


but it is composed of multiple Unicode code points joined together.

Similarly, accented characters can sometimes be represented as:

é


or as:

e + combining acute accent


These can look identical while having different underlying representations.

A grapheme cluster is closer to what users perceive as a single character.

This distinction matters for sophisticated text editors and UX character counters.

12. The classic engineering trap

Imagine a requirement:

Review text must be at most 5,000 bytes.

A developer writes:

if (review.reviewText.length > 5000) {
  throw new Error("Too long");
}


This is potentially wrong.

Why?

Because:

.length


doesn't measure UTF-8 bytes.

A string could have:

4,000 characters


but:

> 5,000 UTF-8 bytes


depending on its contents.

The correct implementation for a UTF-8 byte limit is:

const byteLength = Buffer.byteLength(
  review.reviewText ?? '',
  'utf8',
);

if (byteLength > 5000) {
  // reject
}


Now you're measuring the thing the requirement actually specifies.

13. The general rule for limits

Whenever you encounter a limit, ask:

What exactly is being limited?

It could be:

characters
bytes
code points
grapheme clusters
database storage
HTTP payload size
number of records
number of tokens
memory


These are not interchangeable.

For example:

"5,000 characters"


is a UX-oriented constraint.

While:

"5,000 bytes"


is an encoding/storage/transport-oriented constraint.

14. Why systems impose byte limits

Byte limits exist because computers ultimately have to handle physical data.

Common reasons include:

Database fields

A database column may have storage or index-related constraints.

HTTP requests

Servers may limit request body size:

max request body = 1 MB

Message queues

A messaging system may impose a maximum message size.

Caches

You may want to prevent one object from consuming excessive cache memory.

Logging

Unbounded logs can cause:

disk growth
→ expensive storage
→ difficult searching
→ operational problems

APIs

A malicious or accidental client could send enormous payloads.

So size limits are often both:

correctness constraints
+
resource-protection mechanisms

15. Input limits are a form of defensive engineering

Suppose an API accepts:

{
  "reviewText": "..."
}


and has no limit.

A client can accidentally or intentionally send:

10 bytes
100 bytes
1 KB
1 MB
100 MB
1 GB


That changes the operational characteristics of your service dramatically.

A good API defines a contract such as:

reviewText ≤ 5,000 UTF-8 bytes


Now the system knows the maximum expected size.

This makes resource usage much more predictable.

16. Validate at the boundary

A powerful architectural principle is:

Reject invalid data as close as possible to the system boundary.

For example:

HTTP request
     ↓
DTO validation
     ↓
application logic
     ↓
database


If a field has a known limit, validate it before expensive work happens.

Don't rely on:

database eventually rejects it


if the application can give a clearer error earlier.

This principle applies equally to:

array sizes
string sizes
pagination limits
file sizes
batch sizes
numeric ranges

17. But don't confuse different size limits

Suppose:

reviewText ≤ 5,000 bytes


and:

HTTP request ≤ 1 MB


These are different.

You could have:

request:
{
  reviewText: 5 KB,
  author: ...,
  metadata: ...,
  images: ...
}


The field-level limit doesn't tell you the request-level limit.

Think in layers:

Field limit
    ↓
Object limit
    ↓
Request limit
    ↓
Message limit
    ↓
Storage limit


Each protects a different resource.

18. Unicode creates surprising edge cases

Text isn't just English letters.

Production systems need to account for:

English
Hindi
Tamil
Arabic
Chinese
Japanese
Korean
emoji
combining marks
zero-width joiners
accented characters


A user might see:

"hello 😀"


as a short string.

But its encoded representation may contain substantially more bytes than an ASCII-only string of the same apparent length.

This is why testing only:

"aaaaaaaaaaaaaaaa"


is insufficient for text-size validation.

19. Test boundaries, not just normal cases

For a 5,000-byte limit, useful tests include:

Exactly under
4,999 bytes


Expected:

accepted

Exactly at
5,000 bytes


Expected:

accepted


assuming the contract is "maximum 5,000."

Exactly over
5,001 bytes


Expected:

rejected


But also test different encodings:

ASCII
multi-byte Unicode
emoji
mixed text


For example:

"aaaa..."
"தமிழ்..."
"😀😀😀..."
"Hello 😀 தமிழ்"


This verifies that you're measuring bytes, not accidentally measuring characters.

20. Boundary testing teaches a general engineering principle

The interesting cases aren't random values.

They're around boundaries:

limit - 1
limit
limit + 1


This pattern applies everywhere:

pageSize = 100

99   → valid
100  → valid
101  → invalid


and:

max file size = 10 MB

9.99 MB → valid
10 MB   → valid
10 MB+  → invalid


and:

max batch = 500

499 → valid
500 → valid
501 → invalid


Boundary thinking is one of the most reusable testing skills you can develop.

21. Normalization can complicate byte limits

Unicode can represent visually equivalent text in different ways.

For example, a character such as:

é


can be represented either as a single precomposed character or as:

e + combining accent


Those representations can have different byte lengths.

Therefore, a system that cares deeply about text semantics may need to think about Unicode normalization before applying certain kinds of limits.

For ordinary API validation, you often don't need to normalize manually.

But you should know the issue exists.

The important lesson is:

Visually identical text does not necessarily have identical byte representations.

22. Byte size and database size aren't always the same thing

Another subtle point:

UTF-8 string size


is not necessarily equal to:

total database storage consumed


A database may add:

row metadata
column metadata
page overhead
indexes
TOAST/out-of-line storage
compression


So if your product requirement says:

"Review text must be no larger than 5,000 bytes"

that usually means:

The encoded text value must not exceed 5,000 bytes.

It does not necessarily mean:

"This row occupies exactly 5,000 bytes in PostgreSQL."

Always understand what layer the requirement refers to.

23. Byte limits also appear outside text

The same reasoning applies to binary data.

For example:

image
PDF
ZIP file
audio
video
protobuf message
encrypted payload


These are already byte-oriented.

If an API says:

maximum upload = 10 MB


you don't ask:

“How many characters is that?”

because there aren't necessarily characters involved at all.

This is an important mental shift:

Bytes are the universal low-level size measurement. Characters are a higher-level concept specific to text.

24. API design: character limit vs byte limit

When designing an API, decide what users actually need.

Character-based requirement

Good when the requirement is about UX:

"Review must be at most 5,000 characters."


Users understand this.

But you need to define what "character" means if Unicode complexity matters.

Byte-based requirement

Good when protecting a storage/transport boundary:

"Review must be at most 5,000 UTF-8 bytes."


This is technically precise.

But users may find the limit surprising because:

5,000 English characters


and:

5,000 Tamil characters


can consume very different amounts of space.

Often the best system has both:

UX limit
+
technical byte safety limit


For example:

User-facing:
maximum 4,000 characters

System safety:
maximum 5,000 UTF-8 bytes


Whether that's desirable depends on the product.

25. The same idea appears in your database batch question

This connects directly to the earlier listingIds discussion.

There, you were asking:

“Postgres has a parameter limit. Should we batch?”

The deeper pattern is the same.

There are multiple layers:

Business limit
     ↓
API limit
     ↓
application/resource limit
     ↓
database practical limit
     ↓
database hard limit


For text:

product text limit
     ↓
API validation
     ↓
HTTP body limit
     ↓
database practical limit
     ↓
database storage constraints


For IDs:

business batch size
     ↓
API ArrayMaxSize
     ↓
query performance
     ↓
driver/protocol parameter limit


The general engineering lesson is:

Do not design your application around the lowest-level system's absolute maximum. Establish an explicit application-level contract above it.

26. A useful vocabulary to build

When talking about text and limits, be precise with these words:

Byte

A unit of encoded/binary data.

1 byte = 8 bits

Character

A human-oriented concept that can be ambiguous technically.

Unicode code point

A numeric value representing a Unicode character/entity.

UTF-8

A variable-width encoding of Unicode.

UTF-16 code unit

The representation JavaScript strings use for .length.

Grapheme cluster

Approximately what a user perceives as one character.

Encoding

The mapping between abstract text and bytes.

Payload

The data transmitted between systems.

Cardinality

The number of items/rows/values involved.

Limit

A contract or boundary imposed by a system.

Hard limit

A fundamental technical boundary beyond which the system cannot operate.

Practical limit

A point beyond which performance/resource usage becomes unacceptable.

Application limit

The explicit limit your application chooses to expose.

27. A practical debugging workflow

When someone reports:

"This string is too large."

Don't immediately change the limit.

Ask:

28. What exactly is being measured?
29. Characters or bytes?
30. Which encoding?
31. At which layer is the limit enforced?
32. What is the actual measured size?
33. What is the configured maximum?
34. Is the failure coming from our application or an underlying system?


Then inspect the actual representation.

For Node.js:

const bytes = Buffer.byteLength(value, 'utf8');

console.log({
  utf16CodeUnits: value.length,
  utf8Bytes: bytes,
});


This often immediately explains the discrepancy.

35. The three questions I would ask in code review

Whenever I see:

someString.length


next to a size limit, I ask:

Question 1

What does this limit mean: characters or bytes?

Question 2

Does .length measure that thing?

Question 3

What happens with Unicode/emoji?

If the answer is:

limit = bytes


then:

string.length


is almost certainly the wrong measurement.

Use the appropriate encoding-aware byte calculation.

36. The broader engineering lesson

The really valuable lesson isn't actually about UTF-8.

It's about measuring the thing you are actually trying to constrain.

If your requirement is:

maximum 5,000 bytes


measure:

bytes


If your requirement is:

maximum 500 IDs


measure:

IDs


If your requirement is:

maximum 100 database rows


measure:

rows


If your requirement is:

maximum 1 MB HTTP request


measure:

request bytes


Don't substitute an easier measurement just because it happens to correlate most of the time.

37. The mental model to remember

Keep this picture in your head:

                 HUMAN VIEW
                     │
                 "😀 hello"
                     │
                     ▼
              Unicode text
                     │
                encoding
                     │
                     ▼
             UTF-8 byte sequence
                     │
                     ▼
        ┌─────────────────────────┐
        │  storage / network / DB │
        └─────────────────────────┘


And remember:

character count
      ≠
code point count
      ≠
JavaScript .length
      ≠
UTF-8 byte count
      ≠
total system storage


They are related, but they answer different questions.

38. Cheat sheet
Concept	What it measures	Example: 😀
Human-perceived character	What user sees	1
Unicode code point	Unicode representation	1
JS .length	UTF-16 code units	2
UTF-8 size	Encoded bytes	4

For a 5,000-byte UTF-8 limit:

ASCII-heavy text       → up to ~5,000 chars
2-byte characters      → up to ~2,500
3-byte characters      → up to ~1,666
4-byte characters      → up to ~1,250


But mixed text can fall anywhere in between.

In Node.js:

Buffer.byteLength(value, 'utf8')


is the right primitive when the requirement is explicitly UTF-8 byte size.

Final takeaway

Whenever you encounter a size limit, don't ask only:

“What's the maximum?”

Ask:

“Maximum of what, measured how, at which layer, and why?”

That one habit will help you reason correctly about:

UTF-8 text
database fields
API payloads
file uploads
message queues
batch queries
pagination
caching
memory
network protocols

And the hierarchy to remember is:

Business requirement
        ↓
Application contract
        ↓
Practical resource limit
        ↓
Underlying system limit
        ↓
Hard technical boundary


Good engineering chooses the application limit deliberately instead of accidentally discovering it at the lowest layer.


Text to byte:
If you want to find how many bytes a text takes in JavaScript, use TextEncoder:

const text = "Hello 👋";

const byteSize = new TextEncoder().encode(text).length;

console.log(byteSize); // 10


For a reusable function:

function getByteSize(text) {
  return new TextEncoder().encode(text).length;
}

console.log(getByteSize("Hello 👋"));


For KB:

function getSizeInKB(text) {
  return new TextEncoder().encode(text).length / 1024;
}

console.log(getSizeInKB(text).toFixed(2), "KB");

For a 5 KB limit
const MAX_BYTES = 5 * 1024;
const bytes = new TextEncoder().encode(text).length;

if (bytes > MAX_BYTES) {
  console.log(`Text is too large: ${bytes} bytes`);
} else {
  console.log(`Text size: ${bytes} bytes`);
}


Use TextEncoder, not text.length, because text.length counts JavaScript UTF-16 code units, not UTF-8 bytes. This matters for emojis, accented characters, non-English languages, etc.


Yes — Buffer.byteLength(text) works too, but it depends on where your JavaScript is running.

Node.js

In Node.js:

const text = "Hello 👋";

console.log(Buffer.byteLength(text, "utf8"));


This returns the number of UTF-8 bytes.

For example:

const text = "Hello 👋";

console.log(text.length);                  // 8
console.log(Buffer.byteLength(text));      // 10
console.log(new TextEncoder().encode(text).length); // 10


Why the difference?

text.length → JavaScript UTF-16 code units
Buffer.byteLength(text) → UTF-8 bytes
TextEncoder().encode(text).length → UTF-8 bytes
Browser

Buffer is not normally available in browsers:

Buffer.byteLength(text); // ❌ Buffer is not defined


Use:

new TextEncoder().encode(text).length

So for your 5 KB review limit

If your code is Node.js/backend, this is perfectly fine:

const bytes = Buffer.byteLength(review, "utf8");

if (bytes > 5 * 1024) {
  console.log("Review exceeds 5 KB");
}


If your code is frontend/browser, use:

const bytes = new TextEncoder().encode(review).length;


Both give you the same UTF-8 byte count for the same text.



Yes — for this particular string, PostgreSQL's OCTET_LENGTH(r.review_text) should match JavaScript's TextEncoder().encode(text).length and Node's Buffer.byteLength(text), assuming the strings are actually identical.

So:

AND OCTET_LENGTH(r.review_text) > 5000


is effectively equivalent to:

new TextEncoder().encode(text).length > 5000


and:

Buffer.byteLength(text) > 5000

Why?

OCTET_LENGTH() returns the number of bytes, not characters.

Your text contains Unicode characters such as:

♥️
è
é (if present)
potentially other non-ASCII characters

UTF-8 uses multiple bytes for these characters.

For example:

const text = "♥️";

console.log(text.length); // 2
console.log(new TextEncoder().encode(text).length); // 6
console.log(Buffer.byteLength(text)); // 6


PostgreSQL:

SELECT OCTET_LENGTH('♥️');


should also return:

6

Your example

You got:

TextEncoder:     5959
Buffer.byteLength: 5959


Therefore, if r.review_text contains exactly that same UTF-8 text, PostgreSQL should give:

OCTET_LENGTH(r.review_text) = 5959


and:

OCTET_LENGTH(r.review_text) > 5000


will be TRUE.

One important thing to check

If PostgreSQL is giving you a different result, the most likely issue is that the strings aren't actually identical.

You can inspect both character and byte lengths in PostgreSQL:

SELECT
    LENGTH(r.review_text) AS character_length,
    OCTET_LENGTH(r.review_text) AS byte_length
FROM reviews r
WHERE ...;


For your example, you'd expect something roughly like:

character_length | byte_length
-----------------+------------
      ~5500      |    5959


The exact character count isn't important; the key is that byte_length should correspond to JavaScript's Buffer.byteLength().

Also check the encoding

PostgreSQL should normally be using UTF-8:

SHOW server_encoding;


You ideally want:

UTF8


So yes: OCTET_LENGTH() is the PostgreSQL equivalent you want if your 5000 limit is a byte limit matching JavaScript's TextEncoder/Buffer.byteLength.