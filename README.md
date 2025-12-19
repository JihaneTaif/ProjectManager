# Task Manager – Fullstack Mini Project
A fullstack task management application allowing users to manage projects and tasks with secure authentication.

## Tech Stack
- Backend: 
   Java 17
   Spring Boot
   Spring Security (JWT authentication)
   JPA / Hibernate
   PostgreSQL
- Frontend: 
   React 
   Tailwind CSS
- Infrastructure
   Docker & Docker Compose
   GitHub Actions (CI)

## Core Features
- User authentication with JWT
-Project creation and management
-Task creation, completion, and filtering
-Project progress calculation
-Secure ownership checks (users can only access their own data)

## backend Architecture
The backend follows a Clean Architecture–inspired structure, with a simplified layering approach:
-Domain layer: entities and repository interfaces containing core business rules
-Application layer: services implementing use cases and business logic
-Web layer: REST controllers and DTOs handling HTTP requests and responses
-Security layer: JWT authentication, filters, and security configuration

Persistence concerns are accessed through repositories defined in the domain layer, keeping business logic independent from web concerns.

## API Documentation (Swagger)
The backend exposes interactive API documentation using Swagger / OpenAPI.
Once the backend is running, access it at:
```bash
http://localhost:8081/swagger-ui/index.html
``` 
This allows easy testing of endpoints and inspection of request/response schemas.


## Running the Application

## Backend (Backend)
From the project root:
```bash
docker-compose up
```
The backend will be available at:
```bash
http://localhost:8081
```

## Frontend (local currently)
```bash
cd frontend
npm install
npm run dev
```


## CI / CD
A simple GitHub Actions CI workflow is configured to automatically:
-Build the backend
-Run unit and integration tests
    The workflow runs on every push and pull request to ensure code quality and prevent regressions.
