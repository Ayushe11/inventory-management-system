from flask import Blueprint

# Create blueprints
products_bp = Blueprint('products', __name__, url_prefix='/api/products')
customers_bp = Blueprint('customers', __name__, url_prefix='/api/customers')
orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

from . import products, customers, orders
