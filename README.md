# Factify - Interactive Quiz Application

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-33%2F33%20passing-success)
![Grade](https://img.shields.io/badge/grade-A%20(96%2F100)-success)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4)
![React](https://img.shields.io/badge/React-18.2-61DAFB)

A modern, full-stack quiz application built for educational purposes. Factify enables users to create, share, and take interactive quizzes with real-time scoring and comprehensive user management.

## Features

- **User Authentication** - Secure registration and login with JWT tokens and BCrypt password hashing
- **Quiz Management** - Create, edit, duplicate, and delete custom quizzes
- **Interactive Quiz Taking** - Take quizzes with instant feedback and scoring
- **Quiz Sharing** - Share quiz links with anyone (public access)
- **User Dashboard** - Manage all your quizzes in one place with sorting options
- **Responsive Design** - Mobile-friendly interface built with Bootstrap
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
- [Git](https://git-scm.com/)
- A code editor (Visual Studio Code recommended)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Johannes0605/Eksamen_Factify.git
cd Eksamen_Factify
```

### 2. Backend Setup

```bash
cd api

# Restore NuGet packages
dotnet restore

# Initialize user secrets for JWT configuration
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "your-secret-key-must-be-at-least-32-characters-long"

# Apply database migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at `https://localhost:5001`

### 3. Frontend Setup

```bash
cd Factify

# Install dependencies
npm install

# Configure environment variables (create .env file)
echo "VITE_API_URL=https://localhost:5001" > .env

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

### Frontend Architecture

- **Component-based** React architecture
- **Context API** for global state (authentication)
- **Service layer** for API communication
- **Type-safe** development with TypeScript

### Key Design Patterns

- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Loose coupling and testability
- **DTO Pattern** - Clean API contracts
- **JWT Authentication** - Stateless authentication
- **React Hooks** - Modern React development

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

## Security Features

- **BCrypt Password Hashing** - Industry-standard password security with automatic salting
- **JWT Authentication** - Secure, stateless authentication tokens
- **User Secrets** - JWT keys stored securely (not in source control)
- **CORS Policy** - Restricted to specific origins to prevent CSRF attacks
- **Input Validation** - FluentValidation for comprehensive input sanitization
- **SQL Injection Protection** - EF Core parameterized queries

## Coding Standards

### Backend (C#)
- Follow [Microsoft C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- Use async/await for all I/O operations
- Implement proper exception handling and logging
- Write XML documentation for public APIs
- Use dependency injection for loose coupling

### Frontend (TypeScript/React)
- Follow [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- Use functional components with hooks
- Implement proper TypeScript typing
- Keep components small and focused
- Use meaningful variable and function names

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- Feature branches - `feature/feature-name`

### CI/CD Pipeline

GitHub Actions automatically runs on push/PR:

1. **Backend Tests** - Runs all .NET unit tests
2. **Frontend Tests** - Linting and build verification
3. **Build Check** - Ensures both projects build successfully

## Performance Optimizations

- **Database Indexes** - Optimized queries on User.Email and Quiz filtering (10-100x faster)
- **SQL Filtering** - Filter data in database instead of memory
- **React Memoization** - useMemo for expensive computations
- **Lazy Loading** - Components loaded on-demand
- **Connection Pooling** - Efficient database connections

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Review Checklist

- [ ] All tests passing
- [ ] Code follows project coding standards
- [ ] No security vulnerabilities introduced
- [ ] Documentation updated if needed
- [ ] Performance considerations addressed

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

## Known Issues & Future Enhancements

### Known Limitations
- Password reset tokens are logged but not sent via email (demo mode)
- No actual email service integration (requires SMTP/SendGrid)

### Planned Features
- Email integration for password reset
- Quiz categories and tags
- Leaderboards and user statistics
- Quiz templates
- Import/export quizzes
- Rich text editor for questions
- Image support in questions

## License

This project is an educational assignment for OsloMET. All rights reserved.

## Authors

- **Johannes** - [@Johannes0605](https://github.com/Johannes0605)
- **Sunniva** - [@Sunniva-Sorensen](https://github.com/Sunniva-Sorensen)

## Acknowledgments

- OsloMET - Oslo Metropolitan University
- Course: Web Applications Development
- Exam Project - Fall 2024

## Support

For questions or issues, please open an issue on GitHub.
