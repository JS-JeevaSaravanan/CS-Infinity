
reffered : https://youtu.be/G9gHZpaJNfM?si=ZHOmrGmvLWVTMkU9


**Building a Custom Widget in Mendix: A Step-by-Step Guide**

Creating custom widgets in Mendix can enhance your app’s functionality and user experience. This guide walks you through building a simple counter widget that increments and decrements a value.

### **1. Setting Up the Project**

1. Open your Mendix project.
2. Navigate to **App** > **Show App Directory in Explorer**.
3. Create a new folder named **myWidgets**.
4. Open a terminal in this folder.

### **2. Installing Required Tools**

Ensure you have Node.js and npm installed:

```sh
npm -v  # Check npm version (should be >7)
node -v # Check Node.js version (should be >16)
```

Install the necessary tools:

```sh
npm install -g yo
npm install -g @mendix/generator-widget
```

### **3. Generating the Widget**

Run the generator and follow the prompts:

```sh
yo @mendix/widget count
```

- Name: `count`
- Description: `Counter widget`
- Programming Language: `JavaScript`
- Type: `Function Component`
- Usage: `Web`
- Unit & End-to-End Tests: `No`

### **4. Adding the Widget to Mendix**

1. Navigate to your widget folder:
    
    ```sh
    cd count
    ```
    
2. Open it in **Visual Studio Code**.
3. In Mendix Studio, update the project (`F4`). You should see the widget under the **Addons** tab.
4. Drag and drop the widget onto a page.

### **5. Modifying the Widget’s Behavior**

#### **Update Component Structure**

1. Open **src/components/HelloWorldSample.jsx**.
    
2. Rename it to **Count.jsx**.
    
3. Update the function:
    
    ```jsx
    import { useState } from "react";
    
    export function CountButton({ initialValue }) {
        const [count, setCount] = useState(initialValue);
    
        const increment = () => setCount(prev => prev + 1);
        const decrement = () => setCount(prev => prev - 1);
    
        return (
            <div>
                <p>Value: {count}</p>
                <button onClick={increment}>+</button>
                <button onClick={decrement}>-</button>
            </div>
        );
    }
    ```
    
4. Update **src/Count.xml**:
    
    ```xml
    <property key="initialValue" type="integer" required="true" default="0">
        <caption>Initial Value</caption>
        <description>Initial value of the counter</description>
    </property>
    ```
    

### **6. Running and Testing the Widget**

```sh
npm start
```

1. In Mendix Studio, press **F4** to synchronize.
2. Update the widget if prompted.
3. Run the app and verify the counter increments and decrements.

### **7. Packaging and Sharing**

To package the widget:

```sh
npm run build
```

The final widget will be available in the **widgets** folder, ready for distribution or publishing on the Mendix Marketplace.

