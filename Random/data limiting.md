

Absolutely. The key is to stop thinking of this as “what is Postgres’s max?” and instead learn to reason about where limits exist, what creates load, and what contract your API should expose.

Your code is a great example for learning this.

1. First principle: distinguish 4 different limits

When you send this:

inArray(listingIdExpr, query.listingIds)


there are several layers involved:

HTTP request
   ↓
JSON parser
   ↓
DTO validation
   ↓
ORM / query builder
   ↓
Postgres driver
   ↓
Postgres wire protocol
   ↓
Postgres parser/planner
   ↓
Postgres executor
   ↓
indexes / disk / memory


Every layer can have a different limit.

This is the first mental model I want you to develop.

A common engineering mistake is:

“Postgres allows X, therefore my API should allow X.”

No.

Your API limit should usually be determined by product semantics + performance + operational safety, not by the absolute database limit.

2. What actually happens to your inArray

Suppose:

query.listingIds = [
  "a",
  "b",
  "c",
];


Conceptually, your ORM turns:

inArray(listingIdExpr, query.listingIds)


into something like:

listing_id IN ($1, $2, $3)


with parameters:

$1 = "a"
$2 = "b"
$3 = "c"


So:

number of IDs
        ↓
number of SQL bind parameters
        ↓
size of the query
        ↓
work for parser/planner/executor


That's why listingIds is the interesting part of your method.

1. The famous PostgreSQL 65,535 limit

There is indeed a PostgreSQL protocol limitation around 65,535 parameters in one prepared/bind statement.

So conceptually:

WHERE id IN (
  $1,
  $2,
  $3,
  ...
  $65535
)


is around the upper boundary.

Your query doesn't only have listingIds, though.

You have:

sql`${customerCodeExpr} = ${query.customerCode}`


which consumes a parameter.

Potentially:

query.publisher !== undefined


consumes another.

And depending on how your ORM represents:

getListingsManagementPublishers()


those values may become parameters too.

So the theoretical ceiling isn't exactly 65,535 IDs.

But this isn't the number I'd use to design your API.

That's the important lesson.

2. There are actually two different problems

Imagine RM sends:

100 IDs


versus:

50,000 IDs


versus:

100,000 IDs


These aren't fundamentally the same problem.

Problem A — hard technical limit

Eventually:

too many parameters
       ↓
driver/protocol/database rejects query


That's a correctness/failure boundary.

Problem B — performance limit

Long before that, this can become undesirable:

10 IDs
   ↓
tiny query

1,000 IDs
   ↓
larger query

10,000 IDs
   ↓
large SQL + planning/execution work

50,000 IDs
   ↓
huge query + potentially expensive planning/execution


You don't want your API contract to be:

“We'll accept anything until Postgres punches us in the face.”

😂

The technical maximum is usually not your application maximum.

3. IN (...) isn't inherently bad

This is another important concept.

People sometimes learn:

“Large IN queries are bad.”

That's too simplistic.

For example:

SELECT *
FROM listings
WHERE listing_id IN ('a', 'b', 'c');


with an index:

listing_id → index


can be extremely efficient.

Even hundreds or thousands of values may be perfectly reasonable depending on:

data types
indexes
PostgreSQL version
query shape
table size
selectivity
concurrent traffic
result size
planner behavior

So don't ask:

“How many IDs does Postgres allow?”

Ask:

“How many IDs does this endpoint need to support while maintaining its desired performance and operational characteristics?”

That's a much stronger engineering question.

4. The most important distinction: database limit vs API limit

Think of these as different contracts.

Database contract
Postgres:
"I can technically process approximately X."

Application contract
Our API:
"We support at most N IDs per request."


Where:

N << X


is completely normal.

For example:

Postgres technical ceiling: ~65k parameters

Application:
listingIds max = 500


That isn't wasteful.

It is defensive API design.

5. Why DTO validation is the right place

Your current flow appears to be roughly:

HTTP
 ↓
ListingStateSearchBodyDto
 ↓
ListingStateSearchQuery
 ↓
buildSearchConditions()
 ↓
SQL


If you put:

@ArrayMaxSize(500)


at the DTO boundary:

                    invalid
                      ↓
HTTP → DTO validation → STOP
                      ↓
                   database


That's excellent.

Without it:

HTTP
 ↓
huge array
 ↓
application
 ↓
ORM
 ↓
driver
 ↓
Postgres
 ↓
💥


The earlier you reject invalid input, the better.

6. But don't blindly choose 500

This is where your engineering judgment comes in.

The question isn't:

“Is 500 safe?”

The question is:

“What does listingIds mean semantically?”

Suppose this endpoint is:

Search listing states


and RM says:

“I need to check the state of these listings.”

Then perhaps this is inherently a batch lookup API.

You should discover:

7. What's the normal batch size?

Maybe:

usually 10–50

8. What's the largest legitimate batch?

Maybe:

maximum business operation = 200

9. Does the endpoint paginate?

If the endpoint already has:

pageSize = 100


then allowing:

listingIds = 100,000


starts becoming suspicious.

10. What's the expected latency?

If:

100 IDs → 30 ms
500 IDs → 50 ms
5,000 IDs → 400 ms
50,000 IDs → 5 sec


then the database's theoretical limit is irrelevant.

Your product might choose:

max = 500


because 500 is the performance sweet spot.

11. Another subtle issue: result cardinality

This is really important.

Imagine:

WHERE listing_id IN (...)


You provide:

5,000 IDs


and PostgreSQL returns:

4,800 rows


Now you're not only dealing with a big input.

You're dealing with a potentially large output.

Think in two dimensions:

                 OUTPUT
              small     large
           ┌─────────┬─────────┐
INPUT small│   easy  │         │
           ├─────────┼─────────┤
INPUT large│         │ dangerous│
           └─────────┴─────────┘


Large input + large output is where systems start getting interesting.

12. Then there's query planning

This is another reason the 65k number isn't useful as an application limit.

Postgres doesn't simply execute:

WHERE id IN (...)


without thinking.

It has to parse and plan the query.

Conceptually:

SQL
 ↓
parse
 ↓
analyze
 ↓
plan
 ↓
execute


A gigantic SQL statement can increase:

parsing work
planning work
memory consumption
network payload
driver overhead

So even if:

65,000 parameters


is technically possible, that doesn't mean:

65,000 parameters


is a good production query.

13. There is an even better technique for genuinely huge batches

Now suppose your business requirement really is:

“Sometimes RM genuinely needs to send 100,000 IDs.”

Then:

@ArrayMaxSize(500)


isn't solving the actual business requirement.

At that point you start considering different database representations.

For example, instead of:

WHERE id IN ($1, $2, $3, ... $50000)


you can conceptually send the IDs as one value and turn them into rows inside PostgreSQL.

For example:

WHERE id = ANY($1)


where $1 represents an array.

Or:

JOIN unnest($1) AS requested(id)
  ON requested.id = listings.id


Or for very large workloads:

client
  ↓
temporary/staging table
  ↓
COPY
  ↓
JOIN
  ↓
database


These are fundamentally different strategies.

This leads to an important progression:

small batch
    ↓
IN / ANY

medium batch
    ↓
IN / ANY + reasonable API cap

large batch
    ↓
array / unnest / join

very large batch
    ↓
staging/temp table + bulk load


Don't reach for the last solution unless the requirements justify it.

14. IN vs ANY is worth understanding

Your current ORM probably produces something like:

WHERE listing_id IN ($1, $2, $3, ...)


Another shape is:

WHERE listing_id = ANY($1)


where $1 is an array.

Conceptually:

IN:
1 parameter per ID

ANY:
1 parameter containing an array of IDs


This can avoid the parameter-count problem.

But—and this is crucial—

It does not magically make an arbitrarily huge request cheap.

You still have:

huge input
 ↓
network transfer
 ↓
array construction
 ↓
database processing
 ↓
query execution


You solved one bottleneck, not the whole system.

15. Batching is not automatically the answer

Suppose you have:

10,000 IDs


and decide:

batch size = 500


Then:

500
500
500
...


means 20 database queries.

That can be worse than one well-designed query.

You have now introduced:

20 round trips
20 query executions
20 result sets
20 opportunities for failure


So:

“Postgres has a limit, therefore we'll batch”

is not sufficient reasoning.

You need to compare:

one large query
        vs
multiple smaller queries
        vs
one array parameter
        vs
temporary/staging table


based on actual workload.

16. Your endpoint's semantics matter enormously

Look at this:

query.listingIds !== undefined
  ? inArray(listingIdExpr, query.listingIds)
  : undefined


Notice something interesting.

listingIds is optional.

So you have two radically different query modes:

Mode A
customerCode only


Potentially:

"give me listings for this customer"

Mode B
customerCode + 500 listing IDs


Potentially:

"give me states for this exact batch"


These might deserve different performance considerations.

I'd investigate:

What does the caller actually use this endpoint for?


before deciding the number.

17. The index question

This is probably the next thing I'd inspect in your codebase.

You have:

customerCodeExpr = ...
publisherExpr = ...
listingIdExpr = ...


Ask:

What indexes exist for the combination of these predicates?

Your query is effectively:

WHERE
    customer_code = ?
AND publisher IN (...)
AND listing_id IN (...)


You want to understand whether PostgreSQL can efficiently narrow the data.

For example, perhaps you have:

INDEX(customer_code, publisher, listing_id)


or:

INDEX(customer_code, listing_id)


or perhaps listing_id itself is already unique/indexed.

The optimal indexing strategy depends on:

cardinality
selectivity
query frequency
ordering
table size

This is where EXPLAIN ANALYZE becomes your friend.

18. Learn to think in cardinality

This concept will help you everywhere in backend/database engineering.

Cardinality = roughly, how many rows/values are involved.

Suppose:

customers = 1,000,000
listings = 100,000,000


and:

customer_code = "ABC"


matches:

1,000 listings


Then:

listing_id IN (10 IDs)


is highly selective.

But:

listing_id IN (900 IDs)


is much less selective.

The query planner cares about this.

So query performance isn't simply:

number of parameters


It is more like:

input cardinality
+ selectivity
+ indexes
+ table statistics
+ result cardinality
+ concurrency
+ query shape


That's the deeper mental model.

19. The database limit you should actually memorize

I'd memorize the concept, not just the number:

PostgreSQL's extended query protocol has a 16-bit parameter-count field, giving a maximum of 65,535 parameters per statement.

But don't walk into design discussions saying:

“Our max is 65,535.”

Instead say:

“There's a protocol ceiling around 65k bind parameters, but that's far above the limit I'd expose at the API. We should establish an application batch-size limit based on actual RM usage and query performance.”

That sounds like someone who understands the system rather than someone who memorized a Postgres trivia fact.

20. So how would I make the decision in your case?

I'd follow this sequence.

Step 1 — Find the consumer

Ask:

Who calls this endpoint?


Then:

What's their normal listingIds size?
What's their maximum legitimate size?

Step 2 — Establish the business contract

For example:

RM sends listing state requests in batches.
Maximum supported batch = 500.


That becomes an API contract.

Step 3 — Validate at the boundary

Something conceptually like:

@ArrayMaxSize(MAX_LISTING_IDS)
listingIds?: string[];


Now the database doesn't need to protect itself from arbitrary API input.

Step 4 — Verify database performance

Test representative sizes:

10
50
100
250
500
1,000
5,000


Measure:

latency
planning time
execution time
rows returned
database CPU


Don't guess if this endpoint is important.

Step 5 — Look at the query plan

Run something representative with:

EXPLAIN (ANALYZE, BUFFERS)
...


You're looking for things like:

Index Scan
Bitmap Index Scan
Bitmap Heap Scan
Seq Scan


and:

Planning Time
Execution Time


This teaches you vastly more than knowing the 65k limit.

21. One correction to the earlier answer

There's one thing I'd be careful about in the answer you pasted.

It said:

“Fastify's JSON body size limit (default 1 MB) would likely reject a payload with tens of thousands of IDs before the param limit.”

Don't build your design around that.

The actual effective HTTP/body limit depends on your server/framework configuration and deployment stack. Even if some default happens to be 1 MB in your setup, that's an independent configurable limit, not a reliable safety mechanism.

You want:

API validation
    ↓
explicit business limit


not:

hope HTTP parser rejects it first

22. The mental model I'd keep

When you see code like:

inArray(column, values)


immediately ask these five questions:

23. How does the ORM serialize this?
       ↓
24. How many bind parameters does it create?
       ↓
25. What is the database/protocol hard limit?
       ↓
26. What is the practical performance limit?
       ↓
27. What is the business/API limit?


And ideally:

             HARD LIMIT
                 ↑
        ┌─────────────────┐
        │ DB / protocol   │
        └─────────────────┘
                 ↑
        ┌─────────────────┐
        │ performance     │
        └─────────────────┘
                 ↑
        ┌─────────────────┐
        │ API contract    │
        └─────────────────┘
                 ↑
        ┌─────────────────┐
        │ business need   │
        └─────────────────┘


Usually:

business need
    < API limit
    < practical performance limit
    << technical hard limit


That's the healthy relationship.

28. And specifically for your code

I would not currently conclude:

“We need to batch because Postgres has a 65k parameter limit.”

I'd conclude:

“listingIds is an unbounded user-controlled input that becomes SQL parameters. We need an explicit application-level batch-size decision. The Postgres parameter limit is a lower-level safety boundary, not the desired API limit.”

Then investigate:

RM's actual batch sizes
        ↓
desired API contract
        ↓
indexes/query plan
        ↓
performance at 100/500/1000/etc.
        ↓
choose MAX_LISTING_IDS


And only if the business says:

“We genuinely need 10k/100k IDs in one operation”

should you start investigating:

ANY(array)
unnest()
temporary tables
COPY
bulk operations


That distinction—hard limits vs practical limits vs product limits—is the main concept I'd want you to take away.