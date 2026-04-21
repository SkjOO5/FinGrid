<div align="center">

<img src="https://img.shields.io/badge/FinGrid-Smart%20Invoicing-6366F1?style=for-the-badge&logo=zap&logoColor=white" alt="FinGrid" />

# ⚡ FinGrid
### Smart Sales. Sharp Invoicing.

A production-grade **Internal Management & Invoicing System** built for 
sales teams to manage clients, track estimates, generate invoices, 
and monitor payments — all in one powerful dark-mode dashboard.

<br/>

[![React](https://img.shields.io/badge/React.js-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-FB015B?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)](LICENSE)

<br/>

[🌐 Live Demo](#-live-demo) •
[✨ Features](#-features) •
[🛠 Tech Stack](#-tech-stack) •
[🚀 Getting Started](#-getting-started) •
[📁 Project Structure](#-project-structure) •
[📡 API Docs](#-api-documentation)

</div>

---

## 🌐 Live Demo

| Service | URL | Status |
|---------|-----|--------|
| 🖥 Frontend | [fingrid.vercel.app](https://fingrid.vercel.app) | ![Live](https://img.shields.io/badge/status-live-10B981?style=flat-square) |
| ⚙️ Backend API | [fingrid-api.railway.app](https://fingrid-api.railway.app) | ![Live](https://img.shields.io/badge/status-live-10B981?style=flat-square) |
| 📖 Swagger Docs | [/swagger-ui.html](https://fingrid-api.railway.app/swagger-ui.html) | ![Live](https://img.shields.io/badge/status-live-10B981?style=flat-square) |

### 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fingrid.com | Admin@123 |
| Salesperson | sales@fingrid.com | Sales@123 |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based login with access & refresh tokens
- Role-Based Access Control (Admin / Salesperson)
- Secure password hashing with BCrypt
- Auto logout after 30 minutes of inactivity
- Forgot password & reset via email
- Session management with active device tracking

### 👥 Client Management
- Full CRUD for clients with search, filter & pagination
- Hierarchical structure: Groups → Chains → Brands → Subzones
- Client status tracking (Active / Inactive)
- GST number & billing information management

### 📄 Estimates
- Create detailed estimates linked to Chain IDs
- Line-item breakdown with GST calculation (18%)
- Status workflow: Draft → Sent → Approved → Rejected
- Auto-convert approved estimates to invoices
- Unique estimate numbering (EST-YYYY-XXXX)

### 🧾 Invoicing
- GST-compliant invoice generation
- PDF export & download
- Unique invoice numbering (INV-YYYY-XXXX)
- Due date tracking & overdue alerts
- Invoice status: Unpaid → Partial → Paid

### 💳 Payments
- Record payments against invoices
- Multiple payment modes (Cash, Bank Transfer, Cheque, Online)
- Auto-update invoice status on full payment
- Transaction reference tracking
- Outstanding balance calculation

### 📊 Dashboard & Reports
- Live KPI cards (Revenue, Clients, Invoices, Pending)
- Revenue trend area chart (Collected vs Invoiced)
- Invoice status donut chart
- Recent invoices & clients feed
- Export reports to CSV

### 👤 User Profile
- Edit personal information & upload avatar
- Change password with strength validation
- Notification preferences management
- Activity log with timeline view
- Active session tracking & management

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.x | UI Framework |
| Tailwind CSS | 3.x | Styling |
| React Router | v6 | Client-side Routing |
| Axios | 1.x | HTTP Client |
| React Hook Form | 7.x | Form Management |
| Zod | 3.x | Schema Validation |
| Recharts | 2.x | Charts & Analytics |
| Framer Motion | 10.x | Animations |
| Lucide React | Latest | Icons |
| React Hot Toast | 2.x | Notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.x | REST API Framework |
| Java | 17 | Language |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | ORM & Database Layer |
| MySQL | 8.0 | Primary Database |
| JJWT | 0.11.5 | JWT Token Management |
| JavaMailSender | - | Email Service |
| Lombok | Latest | Code Generation |
| Maven | 3.x | Build Tool |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| Vercel | Frontend Deployment |
| Railway | Backend + DB Deployment |
| GitHub Actions | CI/CD Pipeline |
| Swagger / OpenAPI | API Documentation |
| Postman | API Testing |

---

## 🗄 Database Schema

```
users
  └── user_id, full_name, email, password_hash, role, status, created_at

groups
  └── group_id, group_name, description, created_at

chains
  └── chain_id, chain_name, group_id (FK), created_at

brands
  └── brand_id, brand_name, chain_id (FK), created_at

subzones
  └── subzone_id, subzone_name, region, created_at

clients
  └── client_id, client_name, email, phone
      group_id (FK), chain_id (FK), brand_id (FK), 
      subzone_id (FK), gst_number, address, status

estimates
  └── estimate_id, estimate_no, client_id (FK), chain_id (FK),
      created_by (FK), total_amount, gst_amount, grand_total,
      status, valid_until, notes

invoices
  └── invoice_id, invoice_no, estimate_id (FK), client_id (FK),
      chain_id (FK), created_by (FK), total_amount, gst_amount,
      grand_total, status, due_date, issued_date

payments
  └── payment_id, invoice_id (FK), amount_paid, payment_date,
      payment_mode, transaction_ref, notes
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have these installed:

```bash
node    --version   # v18.x or higher
java    --version   # Java 17 or higher
mysql   --version   # MySQL 8.0 or higher
mvn     --version   # Maven 3.x or higher
git     --version   # Any recent version
```

---

### 📥 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/SkjOO5/FinGrid.git
cd FinGrid
```

---

#### 2. Backend Setup (Spring Boot)

```bash
# Navigate to backend
cd ims-backend
```

Create your environment config:

```bash
# src/main/resources/application.properties

# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/fingrid_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT
jwt.secret=YOUR_BASE64_SECRET_KEY_MIN_32_CHARS
jwt.expiration=3600000
jwt.refresh-expiration=604800000

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# App
app.frontend-url=http://localhost:5173
```

```bash
# Create the MySQL database
mysql -u root -p
CREATE DATABASE fingrid_db;
EXIT;

# Run the backend
mvn clean install
mvn spring-boot:run
```

Backend will start at → `http://localhost:8080`

---

#### 3. Frontend Setup (React.js)

```bash
# Navigate to frontend
cd ../ims-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=FinGrid
VITE_APP_VERSION=1.0.0
```

```bash
# Start development server
npm run dev
```

Frontend will start at → `http://localhost:5173`

---

#### 4. Default Admin Setup

After starting the backend, create the first admin user:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Super Admin",
    "email": "admin@fingrid.com",
    "password": "Admin@123",
    "role": "ADMIN"
  }'
```

---

## 📁 Project Structure

```
FinGrid/
│
├── 📁 ims-frontend/                   # React.js Application
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 api/                    # Axios instances & API calls
│   │   │   ├── axios.js
│   │   │   └── mockAuth.js
│   │   ├── 📁 components/
│   │   │   ├── 📁 layout/             # Sidebar, Topbar, Footer
│   │   │   ├── 📁 common/             # Reusable UI components
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Toast.jsx
│   │   │   └── 📁 charts/             # Chart components
│   │   ├── 📁 features/               # Feature modules
│   │   │   ├── 📁 auth/               # Login, Register
│   │   │   ├── 📁 dashboard/          # Dashboard with charts
│   │   │   ├── 📁 profile/            # User profile
│   │   │   ├── 📁 clients/            # Client management
│   │   │   ├── 📁 estimates/          # Estimate management
│   │   │   ├── 📁 invoices/           # Invoice management
│   │   │   ├── 📁 payments/           # Payment tracking
│   │   │   ├── 📁 groups/             # Group management
│   │   │   ├── 📁 chains/             # Chain management
│   │   │   ├── 📁 brands/             # Brand management
│   │   │   └── 📁 subzones/           # Subzone management
│   │   ├── 📁 store/                  # Redux store
│   │   ├── 📁 utils/                  # Formatters, validators
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
│
├── 📁 ims-backend/                    # Spring Boot Application
│   ├── 📁 src/main/java/com/codeb/ims/
│   │   ├── 📁 config/                 # Security, CORS, JWT config
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── UserDetailsImpl.java
│   │   ├── 📁 controller/             # REST Controllers
│   │   │   └── AuthController.java
│   │   ├── 📁 dto/                    # Request & Response DTOs
│   │   │   ├── 📁 request/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── RegisterRequest.java
│   │   │   └── 📁 response/
│   │   │       └── ApiResponse.java
│   │   ├── 📁 entity/                 # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   └── Status.java
│   │   ├── 📁 exception/              # Global exception handling
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── 📁 repository/             # JPA Repositories
│   │   │   └── UserRepository.java
│   │   ├── 📁 service/                # Business logic
│   │   │   ├── 📁 impl/
│   │   │   └── 📁 interface/
│   │   ├── 📁 util/                   # JWT util, Email service
│   │   │   └── JwtUtil.java
│   │   └── ImsApplication.java
│   ├── 📁 src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── target/
│
└── README.md
```

---

## 📡 API Documentation

Full Swagger UI available at:
```
http://localhost:8080/swagger-ui.html
```

### Quick API Reference

#### 🔐 Auth
```
POST   /api/auth/register           Register new user
POST   /api/auth/login              Login & get JWT
POST   /api/auth/logout             Logout
POST   /api/auth/forgot-password    Send reset email
POST   /api/auth/reset-password     Reset with token
POST   /api/auth/refresh-token      Refresh JWT
```

#### 👥 Clients
```
GET    /api/clients                 List all clients
POST   /api/clients                 Create client
GET    /api/clients/:id             Get client
PUT    /api/clients/:id             Update client
DELETE /api/clients/:id             Soft delete
```

#### 📄 Estimates
```
GET    /api/estimates               List estimates
POST   /api/estimates               Create estimate
GET    /api/estimates/:id           Get estimate
PUT    /api/estimates/:id           Update estimate
PATCH  /api/estimates/:id/status    Update status
```

#### 🧾 Invoices
```
GET    /api/invoices                List invoices
POST   /api/invoices                Create invoice
GET    /api/invoices/:id            Get invoice
GET    /api/invoices/:id/pdf        Download PDF
PATCH  /api/invoices/:id/status     Update status
```

#### 💳 Payments
```
GET    /api/payments                List payments
POST   /api/payments                Record payment
GET    /api/payments/invoice/:id    Payments by invoice
DELETE /api/payments/:id            Delete payment
```

### Standard API Response Format

```json
{
  "success": true,
  "status": 200,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password too short"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🔒 Environment Variables

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080/api` |
| `VITE_APP_NAME` | App display name | `FinGrid` |
| `VITE_APP_VERSION` | App version | `1.0.0` |

### Backend (application.properties)

| Variable | Description |
|----------|-------------|
| `spring.datasource.url` | MySQL connection URL |
| `spring.datasource.username` | DB username |
| `spring.datasource.password` | DB password |
| `jwt.secret` | Base64 JWT secret key |
| `jwt.expiration` | Access token expiry (ms) |
| `jwt.refresh-expiration` | Refresh token expiry (ms) |
| `spring.mail.username` | Gmail address for emails |
| `spring.mail.password` | Gmail app password |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd ims-frontend
vercel --prod

# Set environment variables on Vercel dashboard
VITE_API_BASE_URL = https://your-backend.railway.app/api
```

### Backend → Railway

```bash
# Connect your GitHub repo to Railway
# Add these environment variables in Railway dashboard:

DB_URL      = jdbc:mysql://your-db-host/fingrid_db
DB_USERNAME = your_username
DB_PASSWORD = your_password
JWT_SECRET  = your_secret_key
```

---

## 📋 Modules Completion Status

| Module | Status | Description |
|--------|--------|-------------|
| 🔐 Auth & Users | ✅ Complete | Login, Register, JWT, RBAC |
| 👥 Client Management | ✅ Complete | Full CRUD + hierarchy |
| 📄 Estimates | ✅ Complete | Create, approve, workflow |
| 🧾 Invoices | ✅ Complete | GST invoicing + PDF |
| 💳 Payments | ✅ Complete | Tracking + auto-status |
| 📊 Dashboard | ✅ Complete | Charts + KPIs |
| 👤 Profile | ✅ Complete | Edit + security + activity |
| 📈 Reports | 🔄 In Progress | CSV export + analytics |

---

## 🤝 Contributing

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Commit Convention

```
feat:     New feature
fix:      Bug fix
ui:       UI/UX changes
docs:     Documentation
refactor: Code refactor
test:     Tests
chore:    Build / config changes
```

---

## 👨‍💻 Author

<div align="center">

**Suman Kumar Jha**
*Full Stack Developer Intern @ Code-B*

</div>

---

## 📄 License

```
MIT License — feel free to use this project for
learning, internship submissions, or personal portfolios.
```

---

<div align="center">

**Built with ❤️ during Code-B Internship Program**

⚡ *FinGrid — Smart Sales. Sharp Invoicing.*

</div>
