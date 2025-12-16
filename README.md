# Task Manager – Fullstack Mini Project

## Tech Stack
- Backend: Spring Boot, Java 17, JPA (Hibernate)
- Frontend: React + Tailwind CSS
- Database: PostgreSQL
- Auth: JWT
- Containerization: Docker & Docker Compose

## Features
- User authentication
- Project management
- Task management
- Project progress tracking

## How to Run (Backend)
```bash
docker-compose up
```

## How to Run (Frontend)
```bash
cd frontend
npm install
npm run dev
```


## Intent behind the backend folder structure:
I  applied Clean Architecture principles by isolating domain logic, keeping services as application use cases, and decoupling web concerns using DTOs.

