# Quick Test Commands Reference

## Backend (.NET) Tests

### Run all tests
```powershell
dotnet test
```

### Run tests with detailed output
```powershell
dotnet test --verbosity detailed
```

### Run specific test class
```powershell
dotnet test --filter "FullyQualifiedName~AuthServiceTests"
dotnet test --filter "FullyQualifiedName~AccountControllerTests"
```

### Run with coverage
```powershell
dotnet test /p:CollectCoverage=true
```

### Watch mode (re-run on file changes)
```powershell
dotnet watch test
```

---

## Frontend (React) Tests

### Install test dependencies first
```powershell
cd Factify
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

### Run all tests
```powershell
npm test
```

### Run tests with UI
```powershell
npm run test:ui
```

### Run tests with coverage
```powershell
npm run test:coverage
```

### Run specific test file
```powershell
npm test Login.test.tsx
```

### Run tests in CI mode (single run, no watch)
```powershell
npm test -- --run
```

---

## Important Notes

⚠️ **Before running backend tests**: Stop the API server to avoid file locking issues

✅ **Test files location**:
- Backend: `api.Tests/*.cs`
- Frontend: `Factify/src/**/*.test.tsx`

📊 **Coverage reports**:
- Backend: Console output or use coverage tools
- Frontend: `Factify/coverage/` directory

🔄 **Watch mode**: Tests automatically re-run when files change (default for frontend)
