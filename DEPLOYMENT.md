# POS System — AWS Deployment Guide

A Point-of-Sale system built with **Spring Boot 3.2.4** (Java 17) and **React 19** (Vite).

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   CloudFront    │     │   EC2 Instance   │     │   RDS MySQL 8   │
│   (CDN + HTTPS) │────▶│  (Spring Boot)   │────▶│   (posdb)       │
│                 │     │   Port 8080      │     │   Port 3306     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
   S3 Bucket
  (React static)
```

---

## 🚀 Quick Start (Local Development)

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up -d --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- Health: http://localhost:8080/actuator/health

### Option 2: Manual

**Backend:**
```bash
cd backend
# Set environment variables or use defaults in application.properties
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

**Frontend:**
```bash
cd react-frontend
npm install
npm run dev
```

---

## ☁️ AWS Deployment

### Prerequisites
- AWS Account
- AWS CLI installed and configured (`aws configure`)
- Docker installed (for building images)

### Step 1: Create RDS MySQL Instance

1. Go to **AWS Console → RDS → Create Database**
2. Engine: **MySQL 8.0**
3. Template: **Free tier**
4. DB Instance: `posdb-instance`
5. Master username: `posadmin`
6. Password: **use a strong password**
7. Instance class: `db.t3.micro`
8. Storage: 20 GB
9. Public access: **No**
10. Initial DB name: `posdb`
11. Note down the **RDS Endpoint** (e.g., `posdb-instance.xxxxx.ap-south-1.rds.amazonaws.com`)

### Step 2: Launch EC2 Instance

1. **AMI:** Amazon Linux 2023 or Ubuntu 22.04
2. **Instance type:** t2.micro (free tier) or t3.micro
3. **Security Group:**
   - SSH (22) → Your IP only
   - Custom TCP (8080) → 0.0.0.0/0
   - Custom TCP (3000) → 0.0.0.0/0 (if serving frontend from EC2)
4. **Key pair:** Create/select one

### Step 3: Setup EC2 & Deploy

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@<EC2-PUBLIC-IP>

# Run setup script
chmod +x deploy/ec2-setup.sh
./deploy/ec2-setup.sh

# Clone your repo
git clone <your-repo-url> ~/pos-system
cd ~/pos-system

# Create environment file
cat > .env <<EOF
DB_URL=jdbc:mysql://<RDS-ENDPOINT>:3306/posdb?useSSL=true&requireSSL=true
DB_USER=posadmin
DB_PASS=<your-rds-password>
CORS_ORIGINS=http://<EC2-PUBLIC-IP>:3000,https://your-cloudfront-url.cloudfront.net
DDL_AUTO=update
SHOW_SQL=false
SPRING_PROFILES_ACTIVE=prod
EOF

# Deploy with Docker Compose
docker-compose up -d --build
```

### Step 4: Deploy Frontend to S3 (Optional — for production CDN)

```bash
# Set your variables
export S3_BUCKET=pos-system-frontend-yourname
export AWS_REGION=ap-south-1
export BACKEND_URL=http://<EC2-PUBLIC-IP>:8080/api

# Run deployment script
chmod +x deploy/deploy-frontend-s3.sh
./deploy/deploy-frontend-s3.sh
```

### Step 5: Update CORS After Deployment

Update `CORS_ORIGINS` environment variable on EC2 to include your frontend URL:
```bash
CORS_ORIGINS=http://<EC2-IP>:3000,http://<S3-WEBSITE-URL>,https://<CLOUDFRONT-URL>
```

Then restart:
```bash
docker-compose restart backend
```

---

## 📁 Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/posdb?...` |
| `DB_USER` | Database username | `posuser` |
| `DB_PASS` | Database password | `password123` |
| `SERVER_PORT` | Backend port | `8080` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `DDL_AUTO` | Hibernate DDL mode | `update` |
| `SHOW_SQL` | Show SQL queries | `true` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | (none) |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api` |

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Add product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/carts/:userId` | Get user's cart |
| POST | `/api/carts/:userId/items` | Add item to cart |
| PUT | `/api/carts/:userId/items/:itemId` | Update item quantity |
| DELETE | `/api/carts/:userId/items/:itemId` | Remove item |
| DELETE | `/api/carts/:userId/clear` | Clear cart |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/user/:userId` | Get user's orders |
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET | `/api/reports/product-sales` | Product sales report |
| GET | `/api/reports/low-stock` | Low stock products |
| GET | `/actuator/health` | Health check |

---

## 💰 Estimated AWS Costs

| Service | Monthly Cost |
|---------|-------------|
| EC2 t2.micro | Free tier / ~$8 |
| RDS db.t3.micro | ~$13 |
| S3 | ~$0.50 |
| CloudFront | ~$1 |
| **Total** | **~$15-23/month** |
