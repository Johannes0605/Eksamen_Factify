# Factify - Interactive Quiz Application

![Tests](https://img.shields.io/badge/tests-33%2F33%20passing-success)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4)
![React](https://img.shields.io/badge/React-18.2-61DAFB)

A modern, full-stack quiz application built for educational purposes. Factify enables users to create, share, and take interactive quizzes with real-time scoring and comprehensive user management.

## Features

- **User Authentication** - Secure registration and login with JWT tokens and BCrypt password hashing
- **Quiz Management** - Create, edit, duplicate, and delete custom quizzes
- **Interactive Quiz Taking** - Take quizzes with instant feedback and scoring
- **Quiz Sharing** - Share quiz links with anyone (public access)
- **User Dashboard** - Manage all your quizzes in one place with sorting options
- **Password Recovery** - Forgot password functionality with email notifications

## Technology Stack

### Backend
- **Framework:** ASP.NET Core 8.0 Web API
- **Database:** SQLite with Entity Framework Core 8.0.10
- **Authentication:** JWT Bearer tokens with BCrypt password hashing
- **Validation:** FluentValidation 11.3.1
- **API Documentation:** Swagger/OpenAPI
- **Testing:** xUnit with Moq 4.20.72

### Frontend
- **Framework:** React 18.2
- **Language:** TypeScript
- **Build Tool:** Vite 7.2
- **Routing:** React Router 6.30
- **UI Framework:** Bootstrap 5.3
- **State Management:** React Context API

### DevOps
- **CI/CD:** GitHub Actions
- **Version Control:** Git
- **Package Management:** npm (frontend), NuGet (backend)

## Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- A code editor (Visual Studio Code recommended)

## Installation & Setup

### 1. Download the .zip file

```bash
Open the .zip file in VScode.
```

### 2. Backend Setup

```bash
cd api

#Restore NuGet packages
dotnet restore

# Apply database migrations
dotnet ef database update 
#If ef is not installed you have to run dotnet tool install --global dotnet-ef

# Run the API
dotnet run
```

The API will be available at `https://localhost:5001`

### 3. Frontend Setup

```bash
cd Factify

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Run Everything Together

From the `Factify` directory:

```bash
npm run dev
```

This uses `concurrently` to run both backend and frontend servers simultaneously.

## Project Structure

```
Eksamen_Factify/
├── api/                          # Backend ASP.NET Core Web API
│   ├── Controllers/              # API endpoints
│   ├── DAL/                      # Data Access Layer (Repository pattern)
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Migrations/               # EF Core database migrations
│   ├── Models/                   # Domain models
│   ├── Services/                 # Business logic (AuthService)
│   ├── Validators/               # FluentValidation rules
│   └── Program.cs                # Application entry point
├── api.Tests/                    # Backend unit tests (xUnit)
│   ├── AccountControllerTests.cs
│   ├── AuthServiceTests.cs
│   └── QuizControllerTests.cs
├── Factify/                      # Frontend React application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── contexts/             # React Context (AuthContext)
│   │   ├── home/                 # Home/Dashboard page
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layer
│   │   └── types/                # TypeScript type definitions
│   └── vite.config.js            # Vite configuration
├── docs/                         # Documentation
├── .github/workflows/            # CI/CD workflows
└── Eksamen_Factify.sln          # Visual Studio solution file
```

## Architecture

Factify follows a **3-tier architecture** with clear separation of concerns:

### Backend Architecture

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  (Controllers - API Endpoints)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│          Business Logic Layer           │
│  (Services, Validators)                 │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│          Data Access Layer              │
│  (Repository Pattern + EF Core)         │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│          Database (SQLite)              │
└─────────────────────────────────────────┘
```


## Testing

### Running Backend Tests

```bash
cd api.Tests
dotnet test
```

**Test Coverage:**
- 33/33 tests passing (100%)
- AccountController: 9 tests
- QuizController: 24 tests
- AuthService: 5 tests

### Test Categories

1. **Authentication Tests** - Registration, login, password reset
2. **Quiz CRUD Tests** - Create, read, update, delete operations
3. **Authorization Tests** - User ownership verification
4. **Service Layer Tests** - Password hashing, JWT generation


## API Documentation

Once the backend is running, visit:
- **Swagger UI:** `https://localhost:5001/swagger`

### Main Endpoints

**Authentication:**
- `POST /api/account/register` - Register new user
- `POST /api/account/login` - User login
- `POST /api/account/forgot-password` - Password reset

**Quiz Management:**
- `GET /api/quiz` - Get user's quizzes
- `GET /api/quiz/{id}` - Get specific quiz
- `POST /api/quiz` - Create new quiz
- `PUT /api/quiz/{id}` - Update quiz
- `DELETE /api/quiz/{id}` - Delete quiz
- `POST /api/quiz/{id}/duplicate` - Duplicate quiz

**Quiz Taking:**
- `GET /api/takequiz/{id}` - Get quiz for taking
- `POST /api/takequiz/submit` - Submit quiz answers

## License

This project is an educational assignment for OsloMET. All rights reserved.


## Acknowledgments

- OsloMET - Oslo Metropolitan University
- Course: ITPE3200 web applications
- Exam Project - Fall 2025


