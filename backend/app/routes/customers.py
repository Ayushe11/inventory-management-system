from flask import request, jsonify
from app import db
from app.models import Customer
from app.schemas import customer_schema, customers_schema
from app.routes import customers_bp
from sqlalchemy.exc import IntegrityError

@customers_bp.route('', methods=['GET'])
def get_customers():
    try:
        customers = Customer.query.all()
        return jsonify({
            'success': True,
            'data': customers_schema.dump(customers),
            'count': len(customers)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@customers_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'success': False, 'message': 'Customer not found'}), 404
        return jsonify({'success': True, 'data': customer_schema.dump(customer)}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@customers_bp.route('', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not all(k in data for k in ['name', 'email', 'phone']):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Check for duplicate email
        if Customer.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'message': 'Customer with this email already exists'}), 400
        
        customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data['phone']
        )
        
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Customer created successfully',
            'data': customer_schema.dump(customer)
        }), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Email must be unique'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@customers_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'success': False, 'message': 'Customer not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            customer.name = data['name']
        if 'email' in data:
            # Check for duplicate email
            existing = Customer.query.filter_by(email=data['email']).first()
            if existing and existing.id != customer_id:
                return jsonify({'success': False, 'message': 'Email already in use'}), 400
            customer.email = data['email']
        if 'phone' in data:
            customer.phone = data['phone']
        
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Customer updated successfully',
            'data': customer_schema.dump(customer)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'success': False, 'message': 'Customer not found'}), 404
        
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Customer deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
