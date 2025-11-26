# Automated Testing Setup Guide for Factify

This guide explains how to set up and run automated unit tests for both the backend (.NET API) and frontend (React) of the Factify application.

## Backend Testing (.NET/C#)

### Prerequisites
- .NET 8.0 SDK
- The API should be stopped before running tests (to avoid file locking issues)

### Test Project Structure
```
api.Tests/
├── AuthServiceTests.cs           # Tests for password hashing and JWT generation
├── AccountControllerTests.cs     # Tests for registration and login endpoints
└── api.Tests.csproj              # Test project configuration
```

### Installed Testing Packages
- **xUnit** - Testing framework
- **Moq** - Mocking library for dependencies
- **Microsoft.EntityFrameworkCore.InMemory** - In-memory database for testing
- **Microsoft.AspNetCore.Mvc.Testing** - Integration testing for ASP.NET Core

### Running Backend Tests

#### Option 1: Run all tests
```powershell
cd "c:\Users\sunns\OneDrive\Dokumenter vgs\OsloMET\Webapplikasjoner\Eksamen_Factify"
dotnet test
```

#### Option 2: Run tests from test project only
```powershell
cd "c:\Users\sunns\OneDrive\Dokumenter vgs\OsloMET\Webapplikasjoner\Eksamen_Factify\api.Tests"
dotnet test
```

#### Option 3: Run specific test class
```powershell
cd api.Tests
dotnet test --filter "FullyQualifiedName~AuthServiceTests"
```

#### Option 4: Run with detailed output
```powershell
dotnet test --verbosity detailed
```

#### Option 5: Run with code coverage
```powershell
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

### Important Note About Running Tests
**You must stop the API server before running tests!** The build process will fail if `api.exe` is locked by a running process. Stop any running instances of the API, then run the tests.

### What's Being Tested

#### AuthService Tests
- ✅ Password hashing produces non-plaintext output
- ✅ Same password produces consistent hash
- ✅ Password verification with correct password
- ✅ Password verification with incorrect password
- ✅ JWT token generation

#### AccountController Tests
- ✅ User registration with valid data
- ✅ Registration fails with existing email
- ✅ Registration fails with existing username
- ✅ Login with valid credentials
- ✅ Login fails with invalid email
- ✅ Login fails with invalid password

### Adding More Tests

To add more tests, create new files in the `api.Tests` folder:

```csharp
using Xunit;
using Moq;
// ... other imports

namespace api.Tests
{
    public class YourNewTests
    {
        [Fact]
        public void YourTest_Scenario_ExpectedResult()
        {
            // Arrange
            // ... setup

            // Act
            // ... execute

            // Assert
            Assert.True(condition);
        }
    }
}
```

---

## Frontend Testing (React/TypeScript)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setting Up Frontend Tests

1. **Install testing dependencies:**
```powershell
cd Factify
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest @vitest/ui jsdom
```

2. **Create test configuration file** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

3. **Update package.json** to add test scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Running Frontend Tests

```powershell
cd Factify

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (default)
npm test
```

### Example Test Structure

Create tests in `src/` folder alongside your components:

**Example: `src/components/Login.test.tsx`**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    const mockLogin = vi.fn();
    render(
      <BrowserRouter>
        <Login onLogin={mockLogin} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mockLogin).toHaveBeenCalled();
  });
});
```

---

## Continuous Integration (CI/CD)

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 8.0.x
      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Run tests
        run: dotnet test --no-build --verbosity normal

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        working-directory: ./Factify
        run: npm ci
      - name: Run tests
        working-directory: ./Factify
        run: npm test -- --run
```

---

## VS Code Integration

### Recommended Extensions

1. **.NET Core Test Explorer** - View and run .NET tests in VS Code
2. **Vitest** - Better Vitest integration for frontend tests

### Running Tests from VS Code

- **Backend**: Use the Testing sidebar (flask icon) to view and run .NET tests
- **Frontend**: Use the integrated terminal to run `npm test`

### Keyboard Shortcuts

Add to your `keybindings.json`:
```json
[
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.tasks.test"
  }
]
```

---

## Best Practices

### Backend (C#)
1. Use descriptive test names: `Method_Scenario_ExpectedResult`
2. Follow AAA pattern: Arrange, Act, Assert
3. Use in-memory database for database tests
4. Mock external dependencies using Moq
5. Test both success and failure scenarios

### Frontend (React)
1. Test user behavior, not implementation details
2. Use `screen` queries from `@testing-library/react`
3. Mock API calls using `vi.mock()`
4. Test accessibility (screen readers, keyboard navigation)
5. Snapshot tests for UI components

---

## Troubleshooting

### Backend Issues

**Problem**: "The process cannot access the file 'api.exe'"
**Solution**: Stop the running API before running tests

**Problem**: "Package is not compatible with net8.0"
**Solution**: Ensure you're using compatible package versions (8.0.x for .NET 8)

### Frontend Issues

**Problem**: "Cannot find module '@testing-library/react'"
**Solution**: Run `npm install` in the Factify directory

**Problem**: "ReferenceError: document is not defined"
**Solution**: Add `environment: 'jsdom'` to vite.config.js

---

## Summary

You now have a complete testing setup for both backend and frontend:

- **Backend**: xUnit tests with Moq and InMemory database
- **Frontend**: Vitest with React Testing Library
- **CI/CD**: GitHub Actions workflow (optional)
- **IDE Integration**: VS Code Test Explorer

Run `dotnet test` for backend and `npm test` for frontend to verify everything works!
