# iTech - Deployment Guide

## Project Overview

- **Frontend**: Next.js 15 application optimized for Vercel deployment
- **Backend**: Spring Boot 3.5.3 Java application optimized for Render deployment
- **Database**: PostgreSQL (production) / MySQL (development)
- **Cache**: Redis (optional)

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### 1. Environment Variables Setup

Copy and configure these environment variables in Vercel dashboard:

#### Required Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-backend-url.onrender.com/ws
NEXT_PUBLIC_HEALTH_CHECK_URL=https://your-backend-url.onrender.com/api/health

NEXTAUTH_SECRET=your-secure-nextauth-secret-min-32-chars
JWT_SECRET_KEY=your-jwt-secret-key

NEXT_PUBLIC_RAZORPAY_KEY_ID=your-production-razorpay-key
```

#### Optional Variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_ANALYTICS_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 2. Build Configuration

Vercel should automatically detect Next.js. The included `vercel.json` contains:
- Security headers
- Cache optimization
- Performance settings
- Region configuration (India/Singapore)

### 3. Deploy Steps

1. Push code to your GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

### 4. Custom Domains (Optional)

In Vercel dashboard:
- Add your custom domain
- Configure DNS records
- Enable HTTPS (automatic)

---

## 🚀 Backend Deployment (Render)

### Prerequisites
- Render account
- GitHub repository

### 1. Database Setup

#### Option A: Render PostgreSQL
1. Create PostgreSQL database in Render
2. Note the connection details

#### Option B: External Database
Use any PostgreSQL provider (AWS RDS, etc.)

### 2. Environment Variables Setup

Configure these in Render dashboard:

#### Database Configuration:
```
DATABASE_URL=postgresql://username:password@host:port/database
SPRING_PROFILES_ACTIVE=prod

# Database credentials (if not using full DATABASE_URL)
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
```

#### Security Configuration:
```
JWT_SECRET=your-jwt-secret-min-256-bits
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### External Services:
```
# Payment gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# SMS services (Optional)
MSG91_API_KEY=your-msg91-api-key
MSG91_TEMPLATE_ID=your-template-id
MSG91_SENDER_ID=ITMLTD

# Verification services (Optional)
GST_VERIFICATION_ENABLED=true
PAN_VERIFICATION_ENABLED=true
```

#### Optional Services:
```
# Redis (if using external Redis)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# File storage
FILE_UPLOAD_DIR=/tmp/uploads
```

### 3. Render Service Configuration

Create a new Web Service in Render with:

#### Build Configuration:
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/itech-backend-0.0.1-SNAPSHOT.jar`
- **Environment**: `Java 21`

#### Advanced Settings:
- **Health Check Path**: `/actuator/health`
- **Port**: `8080` (Render auto-detects from Spring Boot)

### 4. Deploy Steps

1. Push code to GitHub repository
2. Create new Web Service in Render
3. Connect GitHub repository
4. Configure environment variables
5. Set build and start commands
6. Deploy

---

## 🔧 Configuration Synchronization

Ensure these configurations match between frontend and backend:

### CORS Settings
Backend `application-prod.properties`:
```properties
spring.web.cors.allowed-origins=https://your-frontend-domain.vercel.app
```

Frontend environment:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.onrender.com
```

### Security Headers
Both should use HTTPS in production with proper security headers.

---

## 🧪 Testing Deployment

### 1. Health Checks

Backend health endpoint:
```
GET https://your-backend-domain.onrender.com/actuator/health
```

Frontend API connection test:
```
Check browser console for any CORS or connection errors
```

### 2. Database Connection

Verify database connectivity through backend logs in Render dashboard.

### 3. API Integration

Test critical endpoints:
- User authentication
- Product listings
- Category management
- File uploads

---

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Verify backend CORS configuration
   - Check frontend API URL configuration

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check database server status
   - Review connection pool settings

3. **Build Failures**
   - Check Java version (requires Java 21)
   - Verify Maven dependencies
   - Review build logs

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify sensitive data is properly escaped

---

## 📊 Monitoring

### Backend Monitoring (Render)
- Use Render dashboard for logs and metrics
- Health check endpoint: `/actuator/health`
- Metrics endpoint: `/actuator/metrics`

### Frontend Monitoring (Vercel)
- Use Vercel Analytics
- Configure Sentry for error tracking
- Monitor Core Web Vitals

---

## 🚨 Production Checklist

### Before Going Live:

#### Security:
- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS for all communications
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Enable security headers

#### Performance:
- [ ] Configure database connection pooling
- [ ] Enable Redis caching (optional)
- [ ] Optimize image loading
- [ ] Set up CDN for static assets

#### Monitoring:
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up backup strategies
- [ ] Enable logging and monitoring

#### Testing:
- [ ] Test all critical user flows
- [ ] Verify payment gateway integration
- [ ] Test email and SMS notifications
- [ ] Validate mobile responsiveness

---

## 📞 Support

For deployment issues, check:
1. Render/Vercel documentation
2. Application logs in respective dashboards
3. Environment variable configurations
4. Database connectivity

---

**Last Updated**: August 2025
**Version**: 2.0.0
