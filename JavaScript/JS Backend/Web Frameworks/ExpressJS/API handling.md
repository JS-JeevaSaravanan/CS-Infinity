


### **3. Using `Express.js` to Create APIs** or Rounting 
   - **Purpose**: Express.js is a minimal web framework for building RESTful APIs.
   - Routing is handled differe http exposed func .. with specified path and handler func
   - **Common Methods**:
     - `app.get()`: Handles HTTP GET requests.
     - `app.post()`: Handles HTTP POST requests.
     - `app.put()`: Handles HTTP PUT requests.
     - `app.delete()`: Handles HTTP DELETE requests.

   **Question**: *How do you create a simple GET API in Express.js?*
   - **Answer**:
     ```javascript
     const express = require('express');
     const app = express();

     app.get('/api/data', (req, res) => {
       res.json({ message: "Hello, World!" });
     });

     app.listen(3000, () => console.log('Server running on port 3000'));
     ```
   - **Explanation**: Creates a simple GET route `/api/data` that sends a JSON response.

---

