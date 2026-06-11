

Before designing large-scale distributed systems, it’s crucial to understand the high-level architecture of individual computers. 


## Data
### Key Concepts:

- **Layered System**: Computers operate through layers, each optimized for specific tasks.
- **Binary Data**: Computers understand only binary (0s and 1s). 

Sure! Here’s an expanded version including more details on data units:

### Data Units Explained

- **Bit**: The smallest unit of data in computing, representing a binary value (0 or 1).

- **Byte**: Consists of 8 bits. It can represent a single character, like a letter (e.g., 'A') or a number (e.g., '1').

- **Kilobyte (KB)**: 
  - **1 KB = 1,024 Bytes** (or \(2^{10}\) bytes)
  - Commonly used to measure small files, like text documents.

- **Megabyte (MB)**: 
  - **1 MB = 1,024 KB** (or \(2^{20}\) bytes)
  - Used for larger files, such as images or audio files.

- **Gigabyte (GB)**: 
  - **1 GB = 1,024 MB** (or \(2^{30}\) bytes)
  - Typically used for storage capacities of USB drives, hard drives, and video files.

- **Terabyte (TB)**: 
  - **1 TB = 1,024 GB** (or \(2^{40}\) bytes)
  - Commonly used to describe storage for large databases, server capacities, and extensive media libraries.

Understanding these units helps in grasping data sizes and system capacities, which are vital in system design.


Understanding these fundamentals is essential for effective system design.


## Disk storage

To store data, computers use disk storage, which can be either HDD (Hard Disk Drive) or SSD (Solid State Drive). 

### Key Points:

- **Non-Volatile Storage**: Disk storage retains data without power, ensuring that the OS, applications, and user files remain intact after a shutdown or restart.
  
- **Size**: Disks typically range from hundreds of gigabytes to multiple terabytes.

- **Performance**:
  - **SSD**: Faster data retrieval (e.g., 500 MB/s to 3,500 MB/s).
  - **HDD**: Slower speeds (80 to 160 MB/s).




## RAM

Following disk storage, the next immediate access point is RAM (Random Access Memory), which is crucial for temporary data storage during active processes.

The next immediate access point after disk storage is **RAM** (Random Access Memory).

### Key Points:

- **Function**: RAM acts as the primary active data holder, storing data structures, variables, and application data currently in use.
  
- **Volatile Memory**: RAM requires power to maintain its contents. Data is lost after a restart.

- **Size**: RAM typically ranges from a few gigabytes in consumer devices to hundreds of gigabytes in high-end servers.

- **Speed**: RAM read/write speeds often exceed 5,000 MB/s, making it faster than even the best SSDs.

RAM is essential for quick access to data during program execution.

RAM holds:

- **Data Structures**: Organized formats for storing and managing data.
- **Variables**: Values used in program execution.
- **Application Data**: Information actively being processed by running programs.

When a program runs, its:

- **Variables**
- **Intermediate Computations**
- **Runtime Stack**

These components are all stored in RAM, allowing for quick access and efficient processing.


## Cache


To further enhance speed, we use **cache memory**, which is smaller than RAM (typically measured in megabytes) but offers much faster access times, often in nanoseconds.

### Key Points:

- **Cache Levels**:
  - **L1 Cache**: The CPU first checks here for data.
  - **L2 and L3 Cache**: If not found in L1, the CPU checks these caches next.
  
- **Purpose**: Cache memory reduces the average access time for data by storing frequently used information, optimizing CPU performance.

By efficiently managing data access, cache memory significantly boosts overall system speed.



## CPU

The **CPU** (Central Processing Unit) is the brain of the computer, responsible for fetching, decoding, and executing instructions.

### Key Points:

- **Function**: The CPU processes operations defined in your code.
  
- **Code Compilation**: High-level languages (like Java, C++, and Python) must be compiled into machine code by a compiler before the CPU can execute them.

- **Data Access**: The CPU can read from and write to RAM, disk storage, and cache memory, enabling efficient data processing.

In essence, the CPU is essential for executing instructions and managing data flow within the system.


## Motherboard

Finally, we have the **motherboard**, or main board, which connects all components of the computer.

### Key Points:

- **Function**: The motherboard provides pathways for data to flow between the CPU, RAM, storage, and other components.
  
- **Connectivity**: It houses sockets for components, ensuring communication and coordination within the system.

In summary, the motherboard is essential for integrating and facilitating the operation of all hardware components.














