# Lion API - Employee Management System

A complete NestJS REST API for employee management with JWT authentication, RBAC (Role-Based Access Control), Prisma ORM with MySQL, and scheduled reports.

## Tech Stack

- **Node.js** + **TypeScript** + **NestJS**
- **MySQL** database
- **Prisma ORM**
- **JWT** authentication
- **RBAC** (ADMIN and USER roles)
- **@nestjs/schedule** for cron jobs

## Project Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
├── auth/                            # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/jwt.strategy.ts
│   ├── guards/jwt-auth.guard.ts
│   └── dto/login.dto.ts
├── common/                          # Shared guards and decorators
│   ├── decorators/roles.decorator.ts
│   └── guards/roles.guard.ts
├── employees/                       # Employees CRUD module
│   ├── employees.module.ts
│   ├── employees.controller.ts
│   ├── employees.service.ts
│   └── dto/
│       ├── create-employee.dto.ts
│       └── update-employee.dto.ts
├── users/                           # Users module
│   ├── users.module.ts
│   └── users.service.ts
├── prisma/                          # Prisma module
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── reports/                         # Scheduled reports module
    ├── reports.module.ts
    └── reports.service.ts

prisma/
├── schema.prisma                    # Database schema
├── seed.ts                          # Database seed script
└── migrations/                      # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DATABASE_URL="mysql://user:password@localhost:3306/lion_db"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="1d"
TZ="America/Sao_Paulo"
PORT=3000
```

### 3. Create Database

```bash
# Create the database (MySQL)
mysql -u root -p -e "CREATE DATABASE lion_db;"
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database

```bash
npx prisma db seed
```

This creates:
- **ADMIN user**: admin@local.com / Admin@123
- **USER user**: user@local.com / User@123
- 3 sample employees

### 6. Start the Server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login and get JWT token |
| GET | `/auth/me` | Yes | Get current user info |

### Employees

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/employees` | Yes | Any | List all employees |
| GET | `/employees/:id` | Yes | Any | Get employee by ID |
| POST | `/employees` | Yes | ADMIN | Create employee |
| PUT | `/employees/:id` | Yes | ADMIN | Update employee |
| DELETE | `/employees/:id` | Yes | ADMIN | Delete employee |

## Usage Examples

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local.com","password":"Admin@123"}'
```

Response:
```json
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Get Current User

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List Employees

```bash
curl http://localhost:3000/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Employee (ADMIN only)

```bash
curl -X POST http://localhost:3000/employees \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@company.com","position":"Developer"}'
```

### Update Employee (ADMIN only)

```bash
curl -X PUT http://localhost:3000/employees/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"position":"Senior Developer","active":true}'
```

### Delete Employee (ADMIN only)

```bash
curl -X DELETE http://localhost:3000/employees/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation errors |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate email |

## Scheduled Jobs

The system includes a daily cron job that runs at 09:00 (America/Sao_Paulo timezone):

- Counts active employees
- Simulates sending an email report (logs to console)

To test the cron job manually, check the server logs at 09:00 or modify the cron expression temporarily.

## Database Schema

### User

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Auto-increment primary key |
| name | String | User's name |
| email | String | Unique email address |
| passwordHash | String | Bcrypt hashed password |
| role | Enum | ADMIN or USER |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Employee

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Auto-increment primary key |
| name | String | Employee's name |
| email | String | Unique email address |
| position | String | Job position |
| active | Boolean | Active status (default: true) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Development

### Generate Prisma Client

```bash
npx prisma generate
```

### Create New Migration

```bash
npx prisma migrate dev --name migration_name
```

### View Database (Prisma Studio)

```bash
npx prisma studio
```

### Run Tests

```bash
npm run test
npm run test:e2e
```

## Docker (MySQL)

To run MySQL in Docker:

```bash
docker run -d \
  --name lion-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=lion_db \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=password \
  -p 3306:3306 \
  mysql:8.0
```

This creates a MySQL container with credentials matching `.env.example`.

## License

UNLICENSED
