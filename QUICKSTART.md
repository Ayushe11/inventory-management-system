# Quick Start Guide

Get your Inventory & Order Management System up and running in 5 minutes!

## Prerequisites
- Docker & Docker Compose installed ([Install](https://www.docker.com/products/docker-desktop))
- OR Python 3.9+, Node.js 16+, PostgreSQL 12+ for manual setup

## 🚀 Option 1: Docker (Easiest - Recommended)

### Windows
```powershell
# 1. Open PowerShell in the project directory
cd path\to\inventory-management-system

# 2. Run the setup script
.\start.bat

# 3. Wait for services to start...
# Services will be ready in about 15-20 seconds
```

### macOS/Linux
```bash
# 1. Navigate to project directory
cd path/to/inventory-management-system

# 2. Run the setup script
chmod +x start.sh
./start.sh

# 3. Wait for services to start...
```

### Manual Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Wait 15 seconds for services to initialize

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Access the Application
Once services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Web application |
| **Backend API** | http://localhost:5000/api | REST API |
| **Database** | localhost:5432 | PostgreSQL |

**Database Credentials:**
- Username: `postgres`
- Password: `inventory_password`
- Database: `inventory_db`

## 🛑 Option 2: Local Development Setup

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
# Copy from .env.example and update DATABASE_URL if needed
copy .env.example .env

# 5. Start the server
python run.py
```

Backend will run on: http://localhost:5000

### Frontend Setup (in another terminal)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Frontend will open on: http://localhost:3000

### Database Setup (if not using Docker)

```bash
# Create database
createdb inventory_db

# The application will create tables automatically on first run
```

## 📱 Using the Application

### Dashboard
The home page shows:
- Total number of products
- Total number of customers
- Total number of orders
- Total revenue
- Low stock alerts (products with ≤10 items)

### Products Page
- **View all products** - See list of all products with SKU, price, and quantity
- **Add product** - Click "Add Product" button
  - Fill in: Name, SKU, Price, Quantity
  - Click "Create Product"
- **Delete product** - Click "Delete" button next to product

**Rules:**
- SKU must be unique
- Price and quantity must be valid numbers
- Negative quantities not allowed

### Customers Page
- **View all customers** - See list of all customers
- **Add customer** - Click "Add Customer" button
  - Fill in: Name, Email, Phone
  - Click "Create Customer"
- **Delete customer** - Click "Delete" button next to customer

**Rules:**
- Email must be unique and valid
- Name and phone are required

### Orders Page
- **View all orders** - See all orders with customer, items, total, and status
- **Create order** - Click "Create Order" button
  1. Select a customer
  2. Click "Add Item" to add products
  3. Select product and quantity for each item
  4. System shows available stock for each product
  5. System calculates total automatically
  6. Click "Create Order"

**Rules:**
- Cannot order more than available stock
- Stock automatically reduces when order is created
- Total is calculated server-side
- Orders can only be deleted if pending

## 🧪 Test the API with cURL

### Create a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99,
    "quantity": 5
  }'
```

### Create a Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      }
    ]
  }'
```

## 🛠️ Useful Commands

### Docker
```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop services
docker-compose down

# Stop and remove volumes (cleans database)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Execute command in container
docker-compose exec backend bash
```

### Local Development
```bash
# Backend logs
# Check terminal where you ran `python run.py`

# Frontend logs
# Check terminal where you ran `npm start`

# Stop services
# Press Ctrl+C in each terminal

# Reset database
# Delete backend/__pycache__ and run again
```

## 🔍 Troubleshooting

### Services won't start
```bash
# Check if ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :5432

# Kill process using port (example for port 3000)
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>
```

### Database connection error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify connection string in backend/.env
# Should be: postgresql://postgres:inventory_password@postgres:5432/inventory_db
```

### Frontend shows blank page
```bash
# Check browser console (F12)
# Check frontend logs
docker-compose logs frontend

# Clear browser cache (Ctrl+Shift+Delete)
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

# Check API URL in .env
# Should be: http://localhost:5000/api
```

### API returns 404
```bash
# Check backend is running
docker-compose ps backend

# Check API URL is correct
# Try: curl http://localhost:5000/api/products

# Check logs for errors
docker-compose logs backend
```

## 📚 Next Steps

1. **Explore the API** - Test all endpoints with cURL or Postman
2. **Create test data** - Add products, customers, and orders
3. **Review code** - Explore the codebase to understand structure
4. **Read documentation** - Check DEVELOPMENT.md for dev setup
5. **Deploy** - See DEPLOYMENT.md for production deployment

## 📖 Documentation

- **README.md** - Project overview and API documentation
- **DEVELOPMENT.md** - Local development setup and guidelines
- **DEPLOYMENT.md** - Production deployment to Railway and Netlify

## ❓ Common Questions

**Q: Can I modify the port numbers?**
A: Yes, in docker-compose.yml change the port mappings (e.g., "3001:3000")

**Q: How do I add more fields to products?**
A: Edit `backend/app/models.py` to add columns to Product model

**Q: Can I use SQLite instead of PostgreSQL?**
A: Yes, change DATABASE_URL to "sqlite:///inventory.db" but not recommended for production

**Q: How do I reset the database?**
A: Run `docker-compose down -v` to remove volumes

**Q: Can I deploy to a different platform?**
A: Yes, see DEPLOYMENT.md for multiple platform options

## 🎉 You're Ready!

Your application is now running. Start by:
1. Creating a few products
2. Creating some customers
3. Creating orders and watching inventory update
4. Exploring the dashboard

## 💬 Support

Need help? Check the full documentation in README.md, DEVELOPMENT.md, or DEPLOYMENT.md

Enjoy using the Inventory & Order Management System! 🚀
