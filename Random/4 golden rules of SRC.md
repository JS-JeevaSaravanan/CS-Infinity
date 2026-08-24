The core metrics for measuring user-facing system health. They are: Latency, Traffic, Errors, and Saturation.

**Latency:** The time it takes to service a request. It is crucial to measure both successful and failed requests because a fast error does not equate to a good user experience

**Traffic:** A measure of total demand on your system, often measured in requests per second or network throughput

**Errors:** The rate at which requests fail, whether explicitly (e.g., HTTP 500s) or implicitly (e.g., a successful response returning wrong data)

**Saturation:** How full your system is, typically focusing on the most constrained resources like CPU, memory utilization, or disk capacity