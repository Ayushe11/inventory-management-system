import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert, Table, Row, Col, Container } from 'react-bootstrap';
import { fetchProducts, fetchProducts as getProducts } from '../redux/slices/productSlice';
import { fetchCustomers, fetchCustomers as getCustomers } from '../redux/slices/customerSlice';
import { createOrder } from '../redux/slices/orderSlice';

export default function OrderForm({ onSuccess }) {
  const dispatch = useDispatch();
  const { items: products } = useSelector(state => state.products);
  const { items: customers } = useSelector(state => state.customers);
  
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!customerId) throw new Error('Please select a customer');
      if (items.length === 0) throw new Error('Please add at least one item');

      const orderItems = items.map(item => ({
        product_id: parseInt(item.productId),
        quantity: parseInt(item.quantity)
      }));

      await dispatch(createOrder({
        customer_id: parseInt(customerId),
        items: orderItems
      })).unwrap();

      setCustomerId('');
      setItems([{ productId: '', quantity: 1 }]);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Customer</Form.Label>
        <Form.Select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select a customer...</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
          ))}
        </Form.Select>
      </Form.Group>

      <h5>Order Items</h5>
      <div className="table-responsive mb-3">
        <Table bordered>
          <thead>
            <tr>
              <th>Product</th>
              <th style={{ width: '150px' }}>Quantity</th>
              <th style={{ width: '100px' }}>Price</th>
              <th style={{ width: '100px' }}>Subtotal</th>
              <th style={{ width: '80px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = products.find(p => p.id === parseInt(item.productId));
              const subtotal = product ? product.price * item.quantity : 0;
              
              return (
                <tr key={index}>
                  <td>
                    <Form.Select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.quantity})
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      required
                    />
                  </td>
                  <td>${product ? product.price.toFixed(2) : '0.00'}</td>
                  <td>${subtotal.toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Button variant="secondary" onClick={addItem} className="me-2 mb-3">
        Add Item
      </Button>

      <div>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating Order...' : 'Create Order'}
        </Button>
      </div>
    </Form>
  );
}
