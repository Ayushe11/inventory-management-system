from flask import request, jsonify
from app import db
from app.models import Order, OrderItem, Product, Customer
from app.schemas import order_schema, orders_schema
from app.routes import orders_bp

@orders_bp.route('', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify({
            'success': True,
            'data': orders_schema.dump(orders),
            'count': len(orders)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404
        return jsonify({'success': True, 'data': order_schema.dump(order)}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@orders_bp.route('', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'customer_id' not in data or 'items' not in data:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Check if customer exists
        customer = Customer.query.get(data['customer_id'])
        if not customer:
            return jsonify({'success': False, 'message': 'Customer not found'}), 404
        
        # Validate items
        if not isinstance(data['items'], list) or len(data['items']) == 0:
            return jsonify({'success': False, 'message': 'Order must contain at least one item'}), 400
        
        # Check inventory and calculate total
        total_amount = 0
        items_to_create = []
        
        for item in data['items']:
            if 'product_id' not in item or 'quantity' not in item:
                return jsonify({'success': False, 'message': 'Item missing product_id or quantity'}), 400
            
            product = Product.query.get(item['product_id'])
            if not product:
                return jsonify({'success': False, 'message': f'Product {item["product_id"]} not found'}), 404
            
            quantity = int(item['quantity'])
            if quantity <= 0:
                return jsonify({'success': False, 'message': 'Quantity must be greater than 0'}), 400
            
            # Check inventory
            if product.quantity < quantity:
                return jsonify({
                    'success': False,
                    'message': f'Insufficient inventory for {product.name}. Available: {product.quantity}, Requested: {quantity}'
                }), 400
            
            subtotal = product.price * quantity
            total_amount += subtotal
            items_to_create.append({
                'product': product,
                'quantity': quantity,
                'unit_price': product.price,
                'subtotal': subtotal
            })
        
        # Create order
        order = Order(
            customer_id=data['customer_id'],
            total_amount=total_amount,
            status='pending'
        )
        
        db.session.add(order)
        db.session.flush()  # Flush to get order ID without committing
        
        # Create order items and reduce inventory
        for item_data in items_to_create:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product'].id,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                subtotal=item_data['subtotal']
            )
            db.session.add(order_item)
            
            # Reduce inventory
            item_data['product'].quantity -= item_data['quantity']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order created successfully',
            'data': order_schema.dump(order)
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@orders_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404
        
        # Only allow deletion of pending orders
        if order.status != 'pending':
            return jsonify({'success': False, 'message': f'Cannot delete order with status: {order.status}'}), 400
        
        # Restore inventory
        for item in order.items:
            product = Product.query.get(item.product_id)
            if product:
                product.quantity += item.quantity
        
        db.session.delete(order)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Order deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404
        
        data = request.get_json()
        if 'status' not in data:
            return jsonify({'success': False, 'message': 'Status field required'}), 400
        
        status = data['status']
        if status not in ['pending', 'completed', 'cancelled']:
            return jsonify({'success': False, 'message': 'Invalid status'}), 400
        
        order.status = status
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order status updated',
            'data': order_schema.dump(order)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
