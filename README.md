# AskNest

A robust, modular **Q&A platform** built with **NestJS**, **GraphQL**, and **MongoDB**.  
It supports user registration, authentication, question categorization, answering, bulk CSV import, and more.  
This project is designed for scalability, security, and developer productivity.

---

## Features

- **User Management**
  - User registration with strong validation
  - Secure authentication (JWT)
  - Answer submission and answer history with timestamps (UTC & local time support)

- **Question Management**
  - Create, update, delete, and fetch questions
  - Each question has content, four options, a correct option, and belongs to one or more categories
  - Bulk question import via CSV (with automatic category creation if needed)

- **Category Management**
  - Create, update, delete, and list categories
  - Fetch categories with question counts
  - Fetch questions by category

- **File Uploads**
  - CSV file upload for bulk question import using GraphQL file upload

- **Validation & Security**
  - Global input validation with class-validator and ValidationPipe
  - Password and email validation
  - JWT-based guards for protected routes

---

## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/) (TypeScript, modular architecture)
- **API:** [GraphQL](https://graphql.org/) (code-first approach)
- **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Authentication:** JWT
- **Validation:** class-validator, class-transformer
- **File Upload:** graphql-upload

---

## Project Structure

```
src/
  app.module.ts
  main.ts
  user/
    user.module.ts
    user.schema.ts
    user.type.ts
    user.input.ts
    user.service.ts
    user.resolver.ts
  question/
    question.module.ts
    question.schema.ts
    question.type.ts
    question.input.ts
    question.service.ts
    question.resolver.ts
  category/
    category.module.ts
    category.schema.ts
    category.type.ts
    category.input.ts
    category.service.ts
    category.resolver.ts
  auth/
    auth.module.ts
    auth.guard.ts
    auth.service.ts
    ...
uploads/
  (CSV files for bulk import)
```

---

## Key Endpoints & Operations

### User

- **Register:**  
  `mutation { registerUser(input: { ... }) { ... } }`
- **Login:**  
  `mutation { login(email: "...", password: "...") { ... } }`
- **Submit Answer:**  
  `mutation { submitAnswer(input: { questionId: "...", answerMarked: "A" }) { ... } }`
- **Get Answer By Question:**  
  `query { userAnswerByQuestion(userId: "...", questionId: "...", timezone: "Asia/Kolkata") { ... } }`

### Question

- **CRUD Operations:**  
  `mutation { createQuestion(input: { ... }) { ... } }`
- **Bulk Import (CSV):**  
  `mutation { csvUpload(file: Upload) { success, errors } }`

### Category

- **CRUD Operations:**  
  `mutation { createCategory(input: { ... }) { ... } }`
- **Get Categories with Question Count:**  
  `query { categoriesWithQuestionCount { id, name, questionsCount } }`
- **Get Categories with Questions:**  
  `query { categoriesWithQuestions { id, name, questions { ... } } }`

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/akhtarnasim1990/asknest.git
cd ask-nest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root with the following:

```
MONGODB_URI=mongodb://localhost:27017/asknest
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4. Set Up Uploads Directory

```bash
mkdir uploads
```

### 5. Run the Application

```bash
npm run start:dev
```

### 6. Access GraphQL Playground

Visit [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser.

---

## CSV Bulk Import Format

Example CSV for questions:

```csv
content,options,correctOption,categories
"What is 2+2?","A.1,B.2,C.3,D.4","B","Math,Basic Arithmetic"
"What is capital of France?","A.London,B.Paris,C.Berlin,D.Madrid","B","Geography,Europe"
```

- **options**: Comma-separated list of four options
- **categories**: Comma-separated category names (will be created if not present)

---

## Validation & Security

- All inputs are validated globally using NestJS `ValidationPipe`
- Passwords must be strong (min length, upper/lowercase, number, special character)
- Emails are validated for format and uniqueness
- JWT is used for authentication and route protection

---

## Contribution

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

---

## Author

- [Nasim Akhtar]

---

## Notes

- For file upload, the project uses `graphql-upload@13` for compatibility.
- All dates are stored in UTC; client can request answer times in their local timezone.
- For any questions or issues, please open an issue on GitHub.