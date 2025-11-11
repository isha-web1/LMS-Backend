# Project LMS (NestJS)

A  Learning Management System (LMS) built with NestJS, Mongoose and JWT-based authentication. Clean modular architecture with Users, Courses and Auth features.


---

## Key Features

- ✅ JWT Authentication with login & register flows — see [`AuthService`](src/auth/auth.service.ts) and [`AuthController`](src/auth/auth.controller.ts)  
- ✅ Route protection via guards:
  - Access control with [`AuthGuard`](src/auth/auth.guard.ts) (validates JWTs)
  - Role-based access via [`RolesGuard`](src/auth/roles.guard.ts) and [`Roles` decorator](src/auth/roles.decorator.ts)
- ✅ User management (`UserModule`) with Mongoose schemas and unique email constraint — [`UserService`](src/user/user.service.ts), [`User` schema](src/user/schemas/user.schema.ts)
- ✅ Course CRUD operations with validation DTOs — [`CourseController`](src/course/course.controller.ts), [`CourseService`](src/course/course.service.ts), [`CreateCourseDto`](src/course/dto/create-course.dto.ts)
- ✅ Config-driven DB connection using [`ConfigModule`] and Mongoose async setup in [`AppModule`](src/app.module.ts)
- ✅ Unit and e2e test setup (Jest + ts-jest) — see [`test/jest-e2e.json`](test/jest-e2e.json) and test scripts in [`package.json`](package.json)

---

## Tech Stack

- NestJS (modular server framework) — [`AppModule`](src/app.module.ts)  
- Mongoose (MongoDB ODM) — schemas in [`src/user/schemas/user.schema.ts`](src/user/schemas/user.schema.ts) and [`src/course/schemas/course.schema.ts`](src/course/schemas/course.schema.ts)  
- JWT Authentication — [`@nestjs/jwt`](src/auth/auth.module.ts) with [`jwtConstants`](src/auth/constants.ts)  
- Validation with `class-validator` & `ValidationPipe` — DTOs like [`RegisterUserDto`](src/auth/dto/registerUser.dto.ts) and [`LoginUserDto`](src/auth/dto/loginUser.dto.ts)  
- Testing with Jest & Supertest (`test/app.e2e-spec.ts`) — config in [`package.json`](package.json) and [`test/jest-e2e.json`](test/jest-e2e.json)

---

## Getting Started (Quick Start)

1. Install
```sh
npm install
```

2. Create environment file
- Copy `.env.local` (ignored by git) and set at least:
  - `MONGODB_URL=mongodb://<user>:<pass>@host:port/db`
  - `JWT_SECRET=your_secret_here`

3. Run in development
```sh
npm run start:dev
```

4. Run tests
```sh
npm run test       # unit tests
npm run test:e2e   # e2e tests (uses test/jest-e2e.json)
```

Files to check:
- App bootstrap: [`src/main.ts`](src/main.ts)  
- API routes: [`src/app.controller.ts`](src/app.controller.ts), [`src/auth/auth.controller.ts`](src/auth/auth.controller.ts), [`src/course/course.controller.ts`](src/course/course.controller.ts)

---

## Architecture Overview

- src/
  - auth/
    - [`auth.module.ts`](src/auth/auth.module.ts) — wires up [`AuthService`](src/auth/auth.service.ts) and JWT
    - [`auth.guard.ts`](src/auth/auth.guard.ts) — extracts/validates bearer token and attaches `user` payload to request
    - [`roles.guard.ts`](src/auth/roles.guard.ts) & [`roles.decorator.ts`](src/auth/roles.decorator.ts) — role-based access
    - DTOs: [`registerUser.dto.ts`](src/auth/dto/registerUser.dto.ts), [`loginUser.dto.ts`](src/auth/dto/loginUser.dto.ts)
  - user/
    - [`user.module.ts`](src/user/user.module.ts)
    - [`user.service.ts`](src/user/user.service.ts)
    - Schema: [`user.schema.ts`](src/user/schemas/user.schema.ts) (includes [`Role`](src/user/user.types.ts))
  - course/
    - [`course.module.ts`](src/course/course.module.ts)
    - [`course.service.ts`](src/course/course.service.ts)
    - [`course.controller.ts`](src/course/course.controller.ts)
    - DTOs: [`create-course.dto.ts`](src/course/dto/create-course.dto.ts), [`update-course.dto.ts`](src/course/dto/update-course.dto.ts)

---

## Authentication & Authorization

- Registration hashes passwords using bcrypt in [`AuthService`](src/auth/auth.service.ts).  
- JWT token payload includes `sub` (user id), `email`, and `role`. Token signing is configured in [`src/auth/auth.module.ts`](src/auth/auth.module.ts) using `jwtConstants` from [`src/auth/constants.ts`](src/auth/constants.ts).  
- Protect routes by applying guards:
  - `@UseGuards(AuthGuard)` ensures a valid token is present — [`src/auth/auth.guard.ts`](src/auth/auth.guard.ts)
  - `@Roles(Role.Admin)` + `RolesGuard` restricts actions to specific roles — see [`roles.decorator.ts`](src/auth/roles.decorator.ts) and [`roles.guard.ts`](src/auth/roles.guard.ts)

---

## Validation & DTOs

- Use DTOs with `class-validator` for request payload validation.
  - Registration: [`RegisterUserDto`](src/auth/dto/registerUser.dto.ts)
  - Login: [`LoginUserDto`](src/auth/dto/loginUser.dto.ts)
  - Course: [`CreateCourseDto`](src/course/dto/create-course.dto.ts), [`UpdateCourseDto`](src/course/dto/update-course.dto.ts)
- Global validation pipe is enabled in [`src/main.ts`](src/main.ts).

---

## Scripts

See runnable scripts in [`package.json`](package.json):
- npm run start, start:dev, start:prod
- npm run test, test:e2e, test:cov

---

## Testing

- Unit tests live next to modules (e.g. [`src/course/course.service.spec.ts`](src/course/course.service.spec.ts)).  
- e2e tests use [`test/app.e2e-spec.ts`](test/app.e2e-spec.ts) and `test/jest-e2e.json` config.

---

