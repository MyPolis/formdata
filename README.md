# @mypolis.eu/formdata

A lightweight utility to process `FormData` into structured JavaScript objects. It supports nested objects and arrays using bracket notation, making it easier to handle complex form data.

## Installation

```bash
pnpm add @mypolis.eu/formdata
```

Or using npm:

```bash
npm install @mypolis.eu/formdata
```

## Features

- **Nested Objects**: Supports keys like `user[name]` and `user[address][city]`.
- **Arrays**: Supports empty bracket notation (`items[]`), index notation (`items[0]`), and repeated keys.
- **Sparse Arrays**: Correctly handles sparse arrays (e.g., `items[0]` and `items[2]` will result in `[val1, undefined, val2]`).
- **Complex Structures**: Handles nested combinations of objects and arrays.
- **TypeScript Support**: Built with TypeScript for excellent developer experience.

## Usage

### Basic Example

```typescript
import { formDataToObject } from "@mypolis.eu/formdata";

const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "john@example.com");

const result = formDataToObject(formData);
// { name: "John Doe", email: "john@example.com" }
```

### Nested Objects

```typescript
const formData = new FormData();
formData.append("user[name]", "John");
formData.append("user[address][city]", "Lisbon");

const result = formDataToObject(formData);
/*
{
  user: {
    name: "John",
    address: {
      city: "Lisbon"
    }
  }
}
*/
```

### Arrays

Supports multiple ways of defining arrays:

```typescript
const formData = new FormData();

// Index notation
formData.append("tags[0]", "news");
formData.append("tags[1]", "sport");

// Empty bracket notation
formData.append("categories[]", "tech");
formData.append("categories[]", "gadgets");

// Repeated names
formData.append("colors", "red");
formData.append("colors", "blue");

const result = formDataToObject(formData);
/*
{
  tags: ["news", "sport"],
  categories: ["tech", "gadgets"],
  colors: ["red", "blue"]
}
*/
```

### Complex Nested Structures

```typescript
const formData = new FormData();
formData.append("classes[0][name]", "10A");
formData.append("classes[0][students][0]", "Ana");
formData.append("classes[0][students][1]", "João");
formData.append("classes[1][name]", "11B");
formData.append("classes[1][students][0]", "Maria");

const result = formDataToObject(formData);
/*
{
  classes: [
    { name: "10A", students: ["Ana", "João"] },
    { name: "11B", students: ["Maria"] }
  ]
}
*/
```

## License

MIT
