from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
import os

db = SQLAlchemy()
ma = Marshmallow()

def seed_sample_data():
    from app.models import Product, Customer, Order, OrderItem

    if Product.query.first() or Customer.query.first() or Order.query.first():
        return

    products = [
        Product(name='Lumen Smart Shelf', sku='LUM-SHLF-01', price=129.99, quantity=48),
        Product(name='Aero Stock Tracker', sku='ARO-TRKR-09', price=89.50, quantity=36),
        Product(name='Nimbus Packaging Kit', sku='NMB-PKG-12', price=23.75, quantity=114),
        Product(name='Pulse Inventory Beacon', sku='PUL-BEAC-08', price=49.00, quantity=29),
        Product(name='Quantum Barcode Lens', sku='QTN-LENS-17', price=199.95, quantity=12),
        Product(name='Helix Fulfillment Pod', sku='HLX-POD-31', price=399.00, quantity=22)
    ]

    customers = [
        Customer(name='Nova Labs', email='hello@novalabs.ai', phone='+1 (415) 555-0193'),
        Customer(name='Echelon Retail', email='operations@echelonretail.com', phone='+1 (212) 555-0148'),
        Customer(name='Helix Supply', email='team@helixsupply.co', phone='+1 (646) 555-0101'),
        Customer(name='Aurora Ventures', email='contact@auroraventures.io', phone='+1 (323) 555-0116'),
        Customer(name='Vortex Systems', email='orders@vortex.systems', phone='+1 (310) 555-0199')
    ]

    db.session.add_all(products + customers)
    db.session.commit()

    product_map = {product.sku: product for product in Product.query.all()}
    customer_map = {customer.email: customer for customer in Customer.query.all()}

    sample_orders = [
        {
            'customer': customer_map['hello@novalabs.ai'],
            'status': 'completed',
            'items': [
                {'product': product_map['ARO-TRKR-09'], 'quantity': 2},
                {'product': product_map['PUL-BEAC-08'], 'quantity': 1}
            ]
        },
        {
            'customer': customer_map['operations@echelonretail.com'],
            'status': 'pending',
            'items': [
                {'product': product_map['NMB-PKG-12'], 'quantity': 5},
                {'product': product_map['LUM-SHLF-01'], 'quantity': 2}
            ]
        },
        {
            'customer': customer_map['team@helixsupply.co'],
            'status': 'completed',
            'items': [
                {'product': product_map['QTN-LENS-17'], 'quantity': 1},
                {'product': product_map['NMB-PKG-12'], 'quantity': 3}
            ]
        },
        {
            'customer': customer_map['contact@auroraventures.io'],
            'status': 'pending',
            'items': [
                {'product': product_map['HLX-POD-31'], 'quantity': 1},
                {'product': product_map['ARO-TRKR-09'], 'quantity': 1}
            ]
        },
        {
            'customer': customer_map['orders@vortex.systems'],
            'status': 'completed',
            'items': [
                {'product': product_map['LUM-SHLF-01'], 'quantity': 3},
                {'product': product_map['QTN-LENS-17'], 'quantity': 1}
            ]
        }
    ]

    for order_data in sample_orders:
        total_amount = 0
        order = Order(
            customer_id=order_data['customer'].id,
            status=order_data['status']
        )
        db.session.add(order)
        db.session.flush()

        for item_data in order_data['items']:
            product = item_data['product']
            quantity = item_data['quantity']
            subtotal = product.price * quantity
            total_amount += subtotal

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                unit_price=product.price,
                subtotal=subtotal
            )
            db.session.add(order_item)
            product.quantity = max(product.quantity - quantity, 0)

        order.total_amount = total_amount
    db.session.commit()


def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///inventory.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JSON_SORT_KEYS'] = False
    
    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.routes import products_bp, customers_bp, orders_bp
    app.register_blueprint(products_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(orders_bp)
    
    # Create tables and seed sample data
    with app.app_context():
        db.create_all()
        seed_sample_data()
    
    return app
