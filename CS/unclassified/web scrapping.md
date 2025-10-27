
**`x-ray`** is a **Node.js web scraping library** designed to make it easy to extract structured data from web pages using simple CSS selectors. It’s **lightweight**, **promise/stream-friendly**, and **great for small to medium scraping tasks**.

---

### 🔧 What Does `x-ray` Do?

It lets you:

- Scrape data from HTML pages
    
- Use **CSS selectors** to define what you want
    
- Scrape lists, nested objects, or deeply nested structures
    
- Output as JSON, save to files, or pipe to streams
    

---

### ✨ Key Features

- 📦 Zero dependencies (originally)
    
- 💡 Simple, chainable syntax
    
- 🧠 Supports pagination
    
- ⚙️ Easily scrape lists or single elements
    
- 🔄 Works with both callbacks and streams
    

---

### 📦 Installation

```bash
npm install x-ray
```

---

### 🧪 Basic Example

Let's say you want to scrape Hacker News titles:

```js
const Xray = require('x-ray');
const x = Xray();

x('https://news.ycombinator.com/', 'a.storylink')
  .paginate('.morelink@href') // optional for pagination
  .limit(3) // scrape 3 pages
  .then(console.log)
  .catch(console.error);
```

**Output:**

```json
[
  "Show HN: I built a thing...",
  "Ask HN: Is X worth it?",
  "Launch HN: A new startup..."
]
```

---

### 🔁 Example with Structure

```js
x('https://example.com/products', '.product', [{
  name: '.title',
  price: '.price',
  url: 'a@href'
}])
.then(console.log);
```

**Output:**

```json
[
  {
    "name": "Product A",
    "price": "$19.99",
    "url": "/product/a"
  },
  ...
]
```

---

### 🧠 When to Use `x-ray`?

✅ Perfect for:

- Quick scraping jobs
    
- Prototyping data extraction
    
- Learning projects
    

❌ Not ideal for:

- Heavy JavaScript sites (use Playwright or Puppeteer instead)
    
- Sites with anti-scraping protection
    

---

### 🚨 Heads-up

`x-ray` hasn’t been updated in a while. It **still works** for many use cases, but if you're scraping **JS-heavy** websites or need **headless browser automation**, consider:

- [`puppeteer`](https://pptr.dev/)
    
- [`playwright`](https://playwright.dev/)
    
- [`cheerio`](https://cheerio.js.org/) (jQuery-like HTML parser for static HTML)
    

---

Want a working example scraping a real site, or a comparison vs `puppeteer`/`cheerio`?

