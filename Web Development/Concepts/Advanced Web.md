

### 82. HTTP Methods
- HTTP methods define the action to be performed on a specific resource.
- Common methods include GET (retrieve data), POST (send data), PUT (update data), and DELETE (remove data).

### 83. Status Code
- Status codes are issued by a server in response to a client's request, indicating the result of the request.
- They are categorized into groups, such as informational (1xx), success (2xx), redirection (3xx), client errors (4xx), and server errors (5xx).

### 84. 404 Not Found
- The 404 status code indicates that the server cannot find the requested resource.
- This is a common error message that users encounter when the URL is incorrect or the page has been moved or deleted.

### 85. Single-page Application (SPA)
- An SPA is a web application that loads a single HTML page and dynamically updates content without requiring a full page reload.
- This provides a smoother user experience, similar to that of a desktop application.

### 86. JavaScript Object Notation (JSON)
- JSON is a data interchange format that can be understood by any programming language.

### 87. Static-Site Generation (SSG)
- In this case, every web page on the site is uploaded to a server in advance allowing Bots to get the information they need.
- A frontend JavaScript framework usually takes over to hydrate the HTML to make it fully interactive and behave like a single-page application.

### 88. Hydration
- It allows the HTML to make it fully interactive and behave like a single-page application.

### 89. First Contentful Paint (FCP) & Time to Interactive (TTI)
- Performance is extremely important and you’ll want to use tools like Lighthouse to optimize metrics like first contentful paint and time to interactive.

### 90. Fullstack Framework
- Most developers will use a full-stack framework like Next.js, Ruby on Rails, Laravel, and so on, which abstracts away many of the more tedious things developers don’t want to deal with.


### 91. Module Bundlers
- Module bundlers are tools like Webpack that take all of your JavaScript, CSS, and HTML and package it in a way that can actually work in a browser.
- They might also provide a linter like ESLint to warn you when your code doesn't follow the proper style guidelines.

### 92. Linter
- A linter is a tool that warns you when your code doesn't follow the proper style guidelines.

### 93. Database
- You are definitely going to need a database to build a full-stack web application because you need somewhere to store your data, like data about your users.

### 94. User Authentication
- In order to get that data, you'll need to give users a way to log in via a process called user authentication.

### 95. Web Server
- Before you deploy your code, you'll need to test it with a web server.
- There are tools like Nginx and Apache to create an HTTP server, but your framework will likely do this for you by serving the files on localhost.


### 96. Localhost
- Localhost makes your own IP address behave like a remote web server.

### 97. Cloud
- When it comes time to deploy, you'll likely use a big cloud provider like AWS.
- Most apps are containerized with Docker, making them easy to scale up and down based on the amount of traffic that they receive.

### 98. Containers
- Containers are a way to package applications and their dependencies together, allowing for consistent deployment across different environments.

### 99. Infrastructure as a Service (IAAS) / Platform-as-a-Service (PAAS) / Backend-as-a-Service (BAAS) / Software as a Service (SAAS)
- There are many tools out there that function as a platform as a service to manage this infrastructure for you in exchange for your money.
- If you don't want to get locked in with a giant tech corporation, you might host your app on a decentralized blockchain with Web3.

### 100. World Wide Web-based on Blockchain Technology (Web3)
- Web3 represents a new paradigm for the internet that leverages blockchain technology to create a more decentralized web.


Here's a list of technical interview questions along with concise answers covering the topics from **HTTP Methods** to **Web3**. This guide will help you prepare effectively for your interviews by providing essential knowledge and insights into these concepts.

---

### 82. HTTP Methods

**Question**: What are the main HTTP methods, and what are their purposes?

**Answer**: 
- **GET**: Retrieve data from the server (idempotent).
- **POST**: Send data to the server to create a new resource.
- **PUT**: Update an existing resource (idempotent).
- **DELETE**: Remove a resource from the server (idempotent).
- **PATCH**: Apply partial modifications to a resource.

---

### 83. Status Code

**Question**: What are HTTP status codes, and what do they signify?

**Answer**: HTTP status codes indicate the result of an HTTP request. They are grouped into five classes:
- **1xx**: Informational (e.g., 100 Continue)
- **2xx**: Success (e.g., 200 OK)
- **3xx**: Redirection (e.g., 301 Moved Permanently)
- **4xx**: Client Errors (e.g., 404 Not Found)
- **5xx**: Server Errors (e.g., 500 Internal Server Error)

---

### 84. 404 Not Found

**Question**: What does a 404 Not Found status code indicate?

**Answer**: A 404 Not Found status code indicates that the server could not find the requested resource. This is commonly encountered when the URL is incorrect or the resource has been deleted.

---

### 85. Single-Page Application (SPA)

**Question**: What is a single-page application (SPA)?

**Answer**: A single-page application (SPA) is a web application that loads a single HTML page and dynamically updates the content as the user interacts with the app, providing a smoother user experience without requiring full page reloads. Frameworks like React, Angular, and Vue.js are commonly used to build SPAs.

---

### 86. JavaScript Object Notation (JSON)

**Question**: What is JSON, and why is it used?

**Answer**: JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy to read and write for humans and machines. It's commonly used for transmitting data between a server and a web application, especially in REST APIs, due to its compatibility with JavaScript.

---

### 87. Static-Site Generation (SSG)

**Question**: What is Static-Site Generation (SSG)?

**Answer**: SSG is a web development approach where HTML pages are generated at build time, creating static files that can be served directly by a web server. This results in faster load times and improved SEO since the content is readily available without server processing. Examples include frameworks like Gatsby and Next.js (in SSG mode).

---

### 88. Hydration

**Question**: What is hydration in web development?

**Answer**: Hydration is the process of taking a server-rendered HTML page and attaching JavaScript event handlers and interactivity to it on the client side. This is commonly used in SPAs to enhance performance by serving pre-rendered content and then making it interactive.

---

### 89. First Contentful Paint (FCP) & Time to Interactive (TTI)

**Question**: What are FCP and TTI in web performance metrics?

**Answer**:
- **First Contentful Paint (FCP)**: The time it takes for the browser to render the first piece of content from the DOM, indicating the user can start viewing the page.
- **Time to Interactive (TTI)**: The time it takes for the page to become fully interactive, meaning all elements are clickable and responsive to user input.

---

### 90. Fullstack Framework

**Question**: What is a full-stack framework?

**Answer**: A full-stack framework is a web development framework that provides a complete solution for building both the frontend and backend of an application. Examples include Next.js (React) and Nuxt.js (Vue), which facilitate server-side rendering, routing, and API integration.

---

### 91. Module Bundlers

**Question**: What are module bundlers, and why are they important?

**Answer**: Module bundlers are tools that take modular JavaScript files and compile them into a single file (or a few files) for production. They help manage dependencies, optimize performance, and improve loading times. Popular examples include Webpack, Rollup, and Parcel.

---

### 92. Linter

**Question**: What is a linter, and what is its purpose?

**Answer**: A linter is a static code analysis tool that checks your code for errors, potential bugs, and stylistic issues. It helps maintain code quality, enforces coding standards, and improves collaboration among developers. Examples include ESLint for JavaScript and Pylint for Python.

---

### 93. Database

**Question**: What is a database, and what types are there?

**Answer**: A database is an organized collection of data that can be easily accessed, managed, and updated. The main types include:
- **Relational Databases** (e.g., MySQL, PostgreSQL): Use structured query language (SQL) for data management.
- **NoSQL Databases** (e.g., MongoDB, Cassandra): Use flexible schemas for unstructured data.

---

### 94. User Authentication

**Question**: What is user authentication, and why is it important?

**Answer**: User authentication is the process of verifying the identity of a user attempting to access a system. It is crucial for securing applications, protecting sensitive data, and ensuring that only authorized users can perform specific actions.

---

### 95. Web Server

**Question**: What is a web server?

**Answer**: A web server is a software or hardware that serves web content to clients over the Internet. It processes incoming HTTP requests and returns the appropriate resources, such as HTML files, images, or scripts. Popular web servers include Apache, Nginx, and Microsoft IIS.

---

### 96. Localhost

**Question**: What is localhost?

**Answer**: Localhost is a hostname that refers to the current computer used to access it. It is commonly used for testing and development, allowing developers to run web servers and applications locally. The default IP address for localhost is **127.0.0.1**.

---

### 97. Cloud

**Question**: What is cloud computing?

**Answer**: Cloud computing is the delivery of computing services (servers, storage, databases, networking, software, etc.) over the Internet (the cloud) to offer faster innovation, flexible resources, and economies of scale. Providers include AWS, Microsoft Azure, and Google Cloud Platform.

---

### 98. Containers

**Question**: What are containers in software development?

**Answer**: Containers are lightweight, portable units that package an application and its dependencies together, allowing it to run consistently across different environments. Docker is a popular tool for creating and managing containers, enabling easy deployment and scalability.

---

### 99. Infrastructure as a Service (IAAS) / Platform as a Service (PAAS) / Backend as a Service (BAAS) / Software as a Service (SAAS)

**Question**: What are IAAS, PAAS, BAAS, and SAAS?

**Answer**:
- **IAAS**: Provides virtualized computing resources over the Internet (e.g., AWS EC2).
- **PAAS**: Provides a platform allowing customers to develop, run, and manage applications without dealing with infrastructure (e.g., Heroku).
- **BAAS**: Provides backend services like databases and user authentication without needing to manage server infrastructure (e.g., Firebase).
- **SAAS**: Delivers software applications over the Internet on a subscription basis (e.g., Google Workspace, Salesforce).

---

### 100. World Wide Web based on Blockchain Technology (Web3)

**Question**: What is Web3?

**Answer**: Web3 refers to a decentralized version of the internet built on blockchain technology. It emphasizes user ownership, privacy, and control over personal data, allowing for peer-to-peer interactions without centralized authorities. Key concepts include decentralized applications (dApps), smart contracts, and cryptocurrencies.

---


