import requests

base_url = "https://inventory-backend-voww.onrender.com/api"

products = [
    {"name": "MacBook Pro 14", "description": "Apple M3 Pro chip 18GB RAM", "price": 1999.99, "quantity": 15, "category": "Electronics", "sku": "MBP14-001"},
    {"name": "iPhone 15 Pro", "description": "256GB Titanium Black", "price": 1199.99, "quantity": 30, "category": "Electronics", "sku": "IPH15-001"},
    {"name": "Sony WH-1000XM5", "description": "Noise Cancelling Headphones", "price": 349.99, "quantity": 50, "category": "Audio", "sku": "SNY-WH5-001"},
    {"name": "Samsung 4K Monitor", "description": "27 inch 144Hz Display", "price": 599.99, "quantity": 20, "category": "Electronics", "sku": "SAM-MON-001"},
    {"name": "Logitech MX Master 3", "description": "Wireless Mouse", "price": 99.99, "quantity": 75, "category": "Accessories", "sku": "LOG-MX3-001"},
]

customers = [
    {"name": "Rahul Sharma", "email": "rahul@gmail.com", "phone": "9876543210", "address": "Mumbai Maharashtra"},
    {"name": "Priya Singh", "email": "priya@gmail.com", "phone": "9876543211", "address": "Delhi India"},
    {"name": "Amit Kumar", "email": "amit@gmail.com", "phone": "9876543212", "address": "Bangalore Karnataka"},
    {"name": "Sneha Patel", "email": "sneha@gmail.com", "phone": "9876543213", "address": "Ahmedabad Gujarat"},
    {"name": "Vikram Mehta", "email": "vikram@gmail.com", "phone": "9876543214", "address": "Pune Maharashtra"},
]

for p in products:
    r = requests.post(f"{base_url}/products", json=p)
    print(f"Product: {p['name']} - {r.status_code}")

for c in customers:
    r = requests.post(f"{base_url}/customers", json=c)
    print(f"Customer: {c['name']} - {r.status_code}")
