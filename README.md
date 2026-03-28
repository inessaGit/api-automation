# 🔌 API Automation Framework

> REST API test suite using **TypeScript + Axios + Jest** targeting the [JSONPlaceholder](https://jsonplaceholder.typicode.com) and [ReqRes](https://reqres.in) public APIs — demonstrating full CRUD coverage, schema validation, and CI/CD integration.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)
- [Sample Test Output](#sample-test-output)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Strongly-typed test code |
| Jest | Test runner & assertions |
| Axios | HTTP client |
| Zod | JSON schema validation |
| Allure | HTML test reports |
| GitHub Actions | CI pipeline |

---

## Project Structure

```
api-automation/
├── src/
│   ├── clients/
│   │   ├── baseClient.ts        # Axios instance with interceptors
│   │   ├── postsClient.ts       # Posts endpoint methods
│   │   └── usersClient.ts       # Users endpoint methods
│   ├── schemas/
│   │   ├── post.schema.ts       # Zod schema for Post
│   │   └── user.schema.ts       # Zod schema for User
│   └── utils/
│       ├── dataFactory.ts       # Test data generators
│       └── reporter.ts          # Custom Allure helpers
├── tests/
│   ├── posts/
│   │   ├── posts.get.test.ts    # GET /posts tests
│   │   ├── posts.post.test.ts   # POST /posts tests
│   │   ├── posts.put.test.ts    # PUT /posts/:id tests
│   │   └── posts.delete.test.ts # DELETE /posts/:id tests
│   ├── users/
│   │   ├── users.get.test.ts
│   │   └── users.auth.test.ts   # ReqRes login/register tests
│   └── contract/
│       └── schema.test.ts       # Contract/schema validation tests
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── jest.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- Internet access (tests hit public APIs)

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/inessaGit/api-automation.git
cd api-automation

# 2. Install dependencies
npm install

# 3. Copy environment config
cp .env.example .env
```

---

## Configuration

Edit `.env` to set base URLs and timeouts:

```env
JSONPLACEHOLDER_BASE_URL=https://jsonplaceholder.typicode.com
REQRES_BASE_URL=https://reqres.in/api
REQUEST_TIMEOUT_MS=10000
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific suite
npm test -- --testPathPattern=posts

# Run and generate Allure report
npm run test:allure
npx allure open allure-report
```

---

## Test Coverage

### JSONPlaceholder — Posts API

| Test | Method | Endpoint | Assertion |
|------|--------|----------|-----------|
| Get all posts | GET | /posts | 200, array of 100 |
| Get single post | GET | /posts/1 | 200, schema valid |
| Get non-existent post | GET | /posts/999 | 404 |
| Create post | POST | /posts | 201, body echoed |
| Update post | PUT | /posts/1 | 200, fields updated |
| Patch post | PATCH | /posts/1 | 200, partial update |
| Delete post | DELETE | /posts/1 | 200 |

### ReqRes — Auth API

| Test | Method | Endpoint | Assertion |
|------|--------|----------|-----------|
| Login success | POST | /login | 200, token returned |
| Login missing password | POST | /login | 400, error message |
| Register success | POST | /register | 200, id + token |
| Register undefined user | POST | /register | 400 |

### Contract / Schema Tests

- All response fields validated against Zod schemas
- Unexpected fields flagged
- Type coercion errors caught

---

## CI/CD Integration

GitHub Actions runs on every push and PR:

```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-report
          path: allure-report/
```

---

## Sample Test Output

```
PASS  tests/posts/posts.get.test.ts
  GET /posts
    ✓ returns 200 status (312ms)
    ✓ returns array of 100 posts (298ms)
    ✓ each post matches schema (301ms)
    ✓ GET /posts/1 returns correct post (89ms)
    ✓ GET /posts/999 returns 404 (91ms)

PASS  tests/users/users.auth.test.ts
  POST /login
    ✓ valid credentials return token (201ms)
    ✓ missing password returns 400 with error (88ms)

Test Suites: 7 passed, 7 total
Tests:       34 passed, 34 total
Time:        8.4s
```

---

## Key Source Files

### `src/clients/baseClient.ts`

```typescript
import axios, { AxiosInstance } from 'axios';

export function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: Number(process.env.REQUEST_TIMEOUT_MS) || 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error(`[API ERROR] ${err.config?.method?.toUpperCase()} ${err.config?.url} → ${err.response?.status}`);
      return Promise.reject(err);
    }
  );

  return client;
}
```

### `tests/posts/posts.post.test.ts`

```typescript
import { postsClient } from '../../src/clients/postsClient';
import { postSchema } from '../../src/schemas/post.schema';

describe('POST /posts', () => {
  it('creates a new post and returns 201', async () => {
    const payload = { title: 'QA Post', body: 'Testing create', userId: 1 };
    const res = await postsClient.create(payload);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject(payload);
    expect(typeof res.data.id).toBe('number');
    postSchema.parse(res.data); // Zod schema validation
  });
});
```

---

*Built as part of a QA portfolio demonstrating API testing expertise. See sibling repos for Playwright, Java/TestNG, and scripting skills.*
