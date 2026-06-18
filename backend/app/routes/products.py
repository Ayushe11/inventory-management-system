from flask import request, jsonify
from app import db
from app.models import Product
from app.schemas import product_schema, products_schema
from app.routes import products_bp
from sqlalchemy.exc import IntegrityError

@products_bp.route('', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify({
            'success': True,
            'data': products_schema.dump(products),
            'count': len(products)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        return jsonify({'success': True, 'data': product_schema.dump(product)}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@products_bp.route('', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not all(k in data for k in ['name', 'sku', 'price', 'quantity']):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Validate price is positive
        if float(data['price']) < 0:
            return jsonify({'success': False, 'message': 'Price cannot be negative'}), 400
        
        # Validate quantity is non-negative
        if int(data['quantity']) < 0:
            return jsonify({'success': False, 'message': 'Quantity cannot be negative'}), 400
        
        # Check for duplicate SKU
        if Product.query.filter_by(sku=data['sku']).first():
            return jsonify({'success': False, 'message': 'Product with this SKU already exists'}), 400
        
        product = Product(
            name=data['name'],
            sku=data['sku'],
            price=float(data['price']),
            quantity=int(data['quantity'])
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product created successfully',
            'data': product_schema.dump(product)
        }), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Product SKU must be unique'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'name' in data:
            product.name = data['name']
        if 'price' in data:
            if float(data['price']) < 0:
                return jsonify({'success': False, 'message': 'Price cannot be negative'}), 400
            product.price = float(data['price'])
        if 'quantity' in data:
            if int(data['quantity']) < 0:
                return jsonify({'success': False, 'message': 'Quantity cannot be negative'}), 400
            product.quantity = int(data['quantity'])
        if 'sku' in data:
            # Check for duplicate SKU
            existing = Product.query.filter_by(sku=data['sku']).first()
            if existing and existing.id != product_id:
                return jsonify({'success': False, 'message': 'Product with this SKU already exists'}), 400
            product.sku = data['sku']
        
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Product updated successfully',
            'data': product_schema.dump(product)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Product deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
