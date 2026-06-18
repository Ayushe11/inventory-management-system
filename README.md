# Inventory & Order Management System

A full-stack web application for managing products, customers, and orders with real-time inventory tracking.

## Features

✨ **Product Management**
- Create, read, update, and delete products
- Track inventory levels
- Unique SKU/code validation
- Real-time stock updates

👥 **Customer Management**
- Add and manage customers
- Unique email validation
- Contact information storage

📦 **Order Management**
- Create orders with multiple items
- Automatic inventory reduction
- Automatic order total calculation
- Order status tracking
- Insufficient inventory protection

📊 **Dashboard**
- Summary statistics
- Total products, customers, and orders
- Total revenue tracking
- Low stock alerts (≤10 items)

## Tech Stack

**Backend**
- Flask
- SQLAlchemy ORM
- PostgreSQL
- Marshmallow (validation)

**Frontend**
- React 18
- Redux Toolkit
- React Bootstrap
- Axios

**Containerization**
- Docker
- Docker Compose

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── products.py
│   │       ├── customers.py
│   │       └── orders.py
│   ├── run.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .dockerignore
```

## Setup & Installation

### Prerequisites
- Docker & Docker Compose installed
- Git

### Running Locally with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd inventory-management-system
```

2. Copy environment files:
```bash
cp backend/.env.example backend/.env
```

3. Start all services:
```bash
docker-compose up -d
```

4. Initialize the database:
```bash
docker-compose exec backend python -c "from app import create_app; app = create_app(); app.app_context().push()"
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - PostgreSQL: localhost:5432

### API Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/<id>` - Update product
- `DELETE /api/products/<id>` - Delete product

#### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/<id>` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/<id>` - Update customer
- `DELETE /api/customers/<id>` - Delete customer

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/<id>` - Get order by ID
- `POST /api/orders` - Create order
- `DELETE /api/orders/<id>` - Delete order
- `PUT /api/orders/<id>/status` - Update order status

## Sample API Requests

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP001",
    "price": 999.99,
    "quantity": 10
  }'
```

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

### Create Order
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

## Deployment

### Backend Deployment (Railway)

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Create a new project:
```bash
railway init
```

4. Set environment variables:
```bash
railway variable set DATABASE_URL=<your-postgres-url>
railway variable set SECRET_KEY=<your-secret-key>
```

5. Deploy:
```bash
railway up
```

### Frontend Deployment (Netlify)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login and deploy:
```bash
netlify deploy
```

3. Set environment variables in Netlify dashboard:
   - `REACT_APP_API_URL=<your-backend-url>`

## Environment Variables

### Backend (.env)
```
FLASK_APP=run.py
FLASK_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url/api
```

## Database Schema

### Products Table
- id (PK)
- name (VARCHAR)
- sku (VARCHAR, UNIQUE)
- price (FLOAT)
- quantity (INTEGER)
- created_at (DATETIME)
- updated_at (DATETIME)

### Customers Table
- id (PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- phone (VARCHAR)
- created_at (DATETIME)
- updated_at (DATETIME)

### Orders Table
- id (PK)
- customer_id (FK)
- total_amount (FLOAT)
- status (VARCHAR)
- created_at (DATETIME)
- updated_at (DATETIME)

### Order Items Table
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity (INTEGER)
- unit_price (FLOAT)
- subtotal (FLOAT)

## Business Logic

1. **SKU Uniqueness**: Each product must have a unique SKU/code
2. **Email Uniqueness**: Each customer must have a unique email
3. **Inventory Management**: 
   - Cannot create orders with insufficient inventory
   - Stock automatically reduces when order is created
   - Stock is restored when order is deleted
4. **Order Calculations**: Total amount is calculated server-side
5. **Validation**: All inputs are validated before processing

## Troubleshooting

### Database Connection Issues
- Check if PostgreSQL container is running: `docker-compose ps`
- Verify credentials in docker-compose.yml
- Check logs: `docker-compose logs postgres`

### API Connection Issues
- Ensure backend container is running: `docker-compose logs backend`
- Check if port 5000 is available
- Verify API URL in frontend .env file

### Frontend Build Issues
- Clear node_modules: `rm -rf frontend/node_modules`
- Clear npm cache: `npm cache clean --force`
- Rebuild: `docker-compose build --no-cache frontend`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For support, email support@inventorymanagement.local or open an issue in the repository.
