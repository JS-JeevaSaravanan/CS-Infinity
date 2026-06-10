

### **4. Database & ORM**

- Connecting to databases (PostgreSQL, MySQL, MongoDB)
- TypeORM with NestJS (`@nestjs/typeorm`)
- Mongoose for MongoDB (`@nestjs/mongoose`)
- Repository pattern & Entities



# **4. Database & ORM in NestJS**

NestJS supports multiple databases, including **PostgreSQL, MySQL, and MongoDB**, using **TypeORM** (for SQL databases) and **Mongoose** (for MongoDB).

---

## **1. Connecting to Databases (PostgreSQL, MySQL, MongoDB)**

NestJS integrates seamlessly with relational and NoSQL databases.

### **🔹 Connecting to PostgreSQL / MySQL using TypeORM**

1️⃣ **Install TypeORM and the database driver:**

```sh
npm install @nestjs/typeorm typeorm pg  # For PostgreSQL
npm install @nestjs/typeorm typeorm mysql2  # For MySQL
```

2️⃣ **Configure database connection in `app.module.ts`:**

```ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // or 'mysql'
      host: 'localhost',
      port: 5432, // Change to 3306 for MySQL
      username: 'root',
      password: 'password',
      database: 'mydb',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production!
    }),
  ],
})
export class AppModule {}
```

### **🔹 Connecting to MongoDB using Mongoose**

1️⃣ **Install Mongoose for MongoDB:**

```sh
npm install @nestjs/mongoose mongoose
```

2️⃣ **Configure MongoDB connection in `app.module.ts`:**

```ts
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'),
  ],
})
export class AppModule {}
```

**📌 Interview Tip:** Be prepared to explain the **difference between SQL (PostgreSQL/MySQL) and NoSQL (MongoDB)** and when to use each.

---

## **2. TypeORM with NestJS (`@nestjs/typeorm`)**

TypeORM is an **Object-Relational Mapper (ORM)** for working with SQL databases in NestJS.

### **🔹 Creating an Entity (Table)**

- An **entity** represents a table in the database.
- Use **decorators** to define columns and relationships.

```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
```

### **🔹 Creating a Repository for Database Operations**

- Repositories handle database queries.
- Use `TypeOrmModule.forFeature()` to register entities.

```ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
```

**📌 Interview Tip:** Be ready to explain **how TypeORM manages entities, migrations, and relationships (One-to-One, One-to-Many, Many-to-Many).**

---

## **3. Mongoose for MongoDB (`@nestjs/mongoose`)**

Mongoose is used to interact with MongoDB in NestJS.

### **🔹 Defining a Schema (Equivalent to an Entity in SQL)**

```ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### **🔹 Creating a Service to Handle Database Operations**

```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  create(user: User): Promise<User> {
    return new this.userModel(user).save();
  }
}
```

**📌 Interview Tip:** Be ready to explain **the difference between TypeORM and Mongoose** (TypeORM is SQL-based, while Mongoose is for NoSQL).

---

## **4. Repository Pattern & Entities**

### **🔹 What is the Repository Pattern?**

- The **repository pattern** abstracts database queries, **encapsulating data logic inside repositories** rather than directly using ORM functions.
- This ensures better **code maintainability and testability**.

### **🔹 Implementing the Repository Pattern in TypeORM**

- Instead of using `entityManager` directly, repositories handle data access:

```ts
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ where: { email } });
  }
}
```

**📌 Interview Tip:** Be ready to discuss **why the repository pattern is important (it helps with code modularity, separation of concerns, and easier testing).**

---

## **Key Takeaways for Interviews**

✅ **SQL vs NoSQL:** TypeORM (SQL) for relational data, Mongoose (NoSQL) for flexible schemas.  
✅ **TypeORM Entities:** Represent tables, use decorators like `@Entity()`, `@Column()`.  
✅ **Mongoose Schemas:** Define document structure, use `@Schema()`, `@Prop()`.  
✅ **Repository Pattern:** Encapsulates database logic for maintainability.

🔥 **Pro Tip:** Be prepared to explain **when to use PostgreSQL vs MongoDB** in real-world applications and how NestJS supports both seamlessly! 🚀


---

### **Using Drizzle ORM with NestJS**

[Drizzle ORM](https://orm.drizzle.team/) is a **lightweight, type-safe ORM** for SQL databases, offering **better performance** and **TypeScript-first support** compared to TypeORM. It's a great alternative for **PostgreSQL, MySQL, SQLite**, and other SQL databases.

---

## **1. Installing Drizzle ORM in NestJS**

1️⃣ **Install Drizzle and database driver**

```sh
npm install drizzle-orm @nestjs/config pg  # For PostgreSQL
npm install drizzle-orm @nestjs/config mysql2  # For MySQL
```

2️⃣ **Install Drizzle CLI for migrations**

```sh
npm install drizzle-kit --save-dev
```

3️⃣ **Initialize Drizzle ORM**

```sh
npx drizzle-kit init
```

---

## **2. Setting Up Drizzle in NestJS**

### **🔹 Database Connection Setup (`database.ts`)**

```ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema'; // Import schema

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/mydb',
});

client.connect();

export const db = drizzle(client, { schema });
```

---

## **3. Defining a Model (Drizzle Schema)**

Unlike TypeORM, Drizzle ORM uses a **functional approach** for defining schemas.

### **🔹 Define a User Table (`schema.ts`)**

```ts
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', 255).notNull().unique(),
});
```

---

## **4. Running Migrations**

Generate SQL migration files based on schema:

```sh
npx drizzle-kit generate
```

Apply the migration:

```sh
npx drizzle-kit migrate
```

---

## **5. Creating a Repository for Users**

Drizzle ORM works with **functional queries**, making it **efficient and type-safe**.

### **🔹 Creating a User Repository (`user.repository.ts`)**

```ts
import { db } from '../database';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

export class UserRepository {
  async getUsers() {
    return await db.select().from(users);
  }

  async getUserById(id: number) {
    return await db.select().from(users).where(eq(users.id, id));
  }

  async createUser(name: string, email: string) {
    return await db.insert(users).values({ name, email }).returning();
  }
}
```

---

## **6. Using the Repository in a Service (`user.service.ts`)**

```ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUsers() {
    return this.userRepo.getUsers();
  }

  async createUser(name: string, email: string) {
    return this.userRepo.createUser(name, email);
  }
}
```

---

## **7. Creating a Controller (`user.controller.ts`)**

```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() body: { name: string; email: string }) {
    return this.userService.createUser(body.name, body.email);
  }
}
```

---

## **Why Use Drizzle ORM Over TypeORM?**

|Feature|Drizzle ORM|TypeORM|
|---|---|---|
|**Performance**|Faster, lightweight|Slower due to heavy decorators|
|**Type Safety**|Fully type-safe queries|TypeScript support but less strict|
|**Migration System**|Simple, SQL-first|Complex, annotation-heavy|
|**Query Performance**|Optimized, functional API|ORM overhead in large apps|

---

## **Interview Key Takeaways**

✅ **Drizzle ORM** is **lighter, faster, and type-safe** compared to TypeORM.  
✅ **Functional queries** make it efficient and avoid ORM overhead.  
✅ **Schema-first migrations** ensure better control over database structure.  
✅ **Great for PostgreSQL, MySQL, and SQLite**, making it a strong alternative to TypeORM.

🔥 **Pro Tip:** Be prepared to explain **how Drizzle ORM improves performance and type safety compared to TypeORM!** 🚀


---

Yes — in Drizzle ORM, views can end up being re-created in generated migrations even when you modify unrelated tables, depending on how the schema snapshot changes.

Typical reasons:

- Drizzle compares the current schema definition with its previous snapshot.
    
- If a view depends on a table that changed, Drizzle may emit:
    
    ```sql
    DROP VIEW ...
    CREATE VIEW ...
    ```
    
- Sometimes even formatting/order differences in generated SQL can trigger a view recreation.
    

This is especially common with:

- `pgView(...)`
    
- materialized views
    
- views using `SELECT *`
    
- renamed columns/types/indexes in dependent tables
    

Example:

```ts
export const activeUsers = pgView("active_users").as((qb) =>
  qb.select().from(users).where(eq(users.active, true))
);
```

If `users` changes, Drizzle may regenerate the view migration.

Ways to reduce unnecessary view regeneration:

1. Avoid `SELECT *` in views
    
2. Keep view SQL deterministic
    
3. Use manual SQL migrations for stable views
    
4. Separate frequently-changing tables from view dependencies
    
5. Review generated migration before applying
    

You can safely edit generated migrations manually if the view recreation is unnecessary.

---
