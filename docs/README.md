# Factify Documentation

This folder contains all documentation for the Factify project.

## Contents

- **[TESTING_SETUP.md](TESTING_SETUP.md)** - Comprehensive guide for setting up and running automated tests
- **[TEST_COMMANDS.md](TEST_COMMANDS.md)** - Quick reference for common test commands

## Project Structure

```
Eksamen_Factify/
├── api/                          # Backend API (.NET 8.0)
├── api.Tests/                    # Backend unit tests (xUnit)
├── Factify/                      # Frontend React app
│   └── src/
│       ├── components/
│       │   └── *.test.tsx       # Component tests (Vitest)
│       └── test/                # Test setup files
├── test-data/                    # Manual test data (JSON)
├── docs/                         # Documentation (you are here)
└── .github/workflows/            # CI/CD configuration
```

## Testing

### Backend Tests
Located in `api.Tests/` - follows .NET convention of `ProjectName.Tests`

### Frontend Tests  
Located next to components in `Factify/src/components/*.test.tsx` - follows React best practice

### Test Data
Manual test payloads in `test-data/` folder
