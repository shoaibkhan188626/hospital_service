# Hospital Service - Connected Healthcare Ecosystem

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

*A secure, compliant microservice for hospital management in healthcare*

[Features](#features) • [Quick Start](#quick-start) • [API Endpoints](#api-endpoints) • [Contributing](#contributing)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [API Endpoints](#api-endpoints)
- [Security & Compliance](#security--compliance)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Overview

The **Hospital Service** is a microservice within the Connected Healthcare Ecosystem, managing hospital data for integration with the User Service. Built with Node.js, Express, and MongoDB, it ensures compliance with **NDHM**, **DPDP Act**, and **Telemedicine Guidelines**, supporting offline-first operations, scalability, and robust security. It provides APIs to create, retrieve, and update hospital details, secured with `SERVICE_KEY` for inter-service communication.

---

## Features

- **Hospital Management**:
  - Create, retrieve, update hospital data (name, address, location, contact).
  - Validate `hospitalId` for User Service (e.g., doctor registration).
- **Security**:
  - `SERVICE_KEY` authentication for inter-service calls.
  - Rate limiting (100 reqs/15 min), Helmet headers.
- **Logging**:
  - Winston-based audit logs for all actions.
- **Offline-First**:
  - Core operations work with local MongoDB.
- **Testing**:
  - Unit tests for hospital endpoints using Jest and MongoMemoryServer.

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Installation
1. **Clone Repository**:
   ```bash
   git clone https://github.com/shoaibkhan188626/hospital_service.git
   cd hospital-service
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure `.env`**:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your credentials
   ```

4. **Start Server**:
   ```bash
   npm run dev  # Development with hot reload
   npm start    # Production
   ```

5. **Verify**:
   ```bash
   curl http://localhost:8082/health
   ```

---

## Docker Setup

1. **Build Image**:
   ```bash
   docker build -t hospital-service .
   ```

2. **Run Container**:
   ```bash
   docker run -p 8082:8082 --env-file .env hospital-service
   ```

---

## API Endpoints

### Hospitals (`/api/hospitals`)
| Method | Endpoint        | Description                | Auth Required |
|--------|-----------------|----------------------------|---------------|
| `POST` | `/`             | Create hospital            | ✅ (SERVICE_KEY) |
| `GET`  | `/:id`          | Get hospital by ID         | ✅ (SERVICE_KEY) |
| `PATCH`| `/:id`          | Update hospital            | ✅ (SERVICE_KEY) |
| `DELETE`| `/:id`         | Soft-delete hospital       | ✅ (SERVICE_KEY) |

**Example: Get Hospital**
```bash
curl -X GET http://localhost:8082/api/hospitals/507f191e810c19729de860ea \
  -H "Authorization: Bearer <SERVICE_KEY>"
```

---

## Security & Compliance

- **NDHM**:
  - Audit logs for all actions.
  - Interoperable data standards.
- **DPDP Act**:
  - Minimal data retention, soft deletes.
  - Secure MongoDB storage.
- **Telemedicine Guidelines**:
  - Hospital data validation for doctor affiliations.
- **Security**:
  - `SERVICE_KEY` for inter-service auth.
  - Rate limiting, Helmet, CORS protection.

---

## Testing

1. **Run Tests**:
   ```bash
   npm test
   ```

2. **Test Suite**:
   - `tests/hospital.test.js`: Hospital endpoint tests with MongoMemoryServer.
   - Future: Add integration tests.

3. **Coverage**:
   - Goal: >90% for critical endpoints.

---

## Project Structure

```
hospital-service/
├── .env                    # Environment variables
├── .gitignore              # Ignored files
├── README.md               # Documentation
├── app.js                  # Express setup
├── server.js               # Server startup
├── config/                 # Configuration
│   ├── database.js         # MongoDB connection
│   └── logger.js           # Winston logging
├── controllers/            # API logic
│   └── hospital.controller.js  # Hospital endpoints
├── middlewares/            # Request processing
│   ├── ErrorHandler.js     # Error handling
│   ├── auth.middleware.js  # SERVICE_KEY verification
│   └── logger.middleware.js# Request logging
├── models/                 # Schemas
│   └── hospital.js         # Hospital schema
├── routes/                 # API routes
│   └── hospital.routes.js  # Hospital routes
├── services/               # Business logic
│   └── hospital.service.js # Hospital operations
├── tests/                  # Tests
│   └── hospital.test.js    # Hospital tests
├── utils/                  # Utilities
│   ├── error.js            # Custom errors
│   └── httpClient.js       # HTTP client
├── package-lock.json       # Dependency lock
├── package.json            # Project metadata
```

---

## Environment Variables

```bash
NODE_ENV=development
PORT=8082
MONGO_URI_LOCAL=mongodb://localhost:27017/hospital-service
MONGO_URI_ATLAS=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/hospital-service
JWT_SECRET=your-secure-jwt-secret-32-chars
SERVICE_KEY=a7b9c2d8e4f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4
NOTIFICATION_SERVICE_URL=http://localhost:8081
```

---

## Contributing

1. **Fork** the repo: `https://github.com/shoaibkhan188626/hospital-service.git`
2. Create a branch: `git checkout -b feature/<name>`
3. Commit changes: `git commit -m "Add feature"`
4. Run tests: `npm test`
5. Push and open a PR.

**Standards**:
- Use ESLint/Prettier.
- Write tests for new features.
- Update README if needed.

---

## License

MIT License © 2025 Connected Healthcare Ecosystem

See [LICENSE](LICENSE) for details.

---

## Support

- **Email**: shoaibullakhan15@gmail.com
- **Issues**: Open a GitHub issue for bugs or features.

---

<div align="center">

**[⬆ Back to Top](#hospital-service---connected-healthcare-ecosystem)**

Built with ❤️ by Shoaib Khan

</div>

