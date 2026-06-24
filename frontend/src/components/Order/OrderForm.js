import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../redux/slices/orderSlice';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchCustomers } from '../redux/slices/customerSlice';

export default function OrderForm({ onSuccess }) {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { items: customers } = useSelector((state) => state.customers);

  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const addItem = () => {
    setItems((current) => [...current, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setItems((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!customerId) throw new Error('Please select a customer');
      if (items.length === 0) throw new Error('Please add at least one item');

      const orderItems = items.map((item) => ({
        product_id: parseInt(item.productId, 10),
        quantity: parseInt(item.quantity, 10)
      }));

      await dispatch(createOrder({
        customer_id: parseInt(customerId, 10),
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
    <form onSubmit={handleSubmit}>
      {error && <div className="form-alert">{error}</div>}

      <div className="floating-field">
        <select
          className="floating-select"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select a customer...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{`${c.name} (${c.email})`}</option>
          ))}
        </select>
        <label>Customer</label>
      </div>

      <h3 style={{ color: '#f3f7ff', marginBottom: '16px' }}>Order Items</h3>
      <div className="premium-panel table-responsive">
        <table className="premium-table" style={{ minWidth: '760px' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = products.find((p) => p.id === parseInt(item.productId, 10));
              const subtotal = product ? product.price * item.quantity : 0;

              return (
                <tr key={index}>
                  <td>
                    <select
                      className="floating-select"
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{`${p.name} (Stock: ${p.quantity})`}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      className="floating-input"
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
                    <button className="btn-gradient" type="button" onClick={() => removeItem(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '20px' }}>
        <button type="button" className="btn-gradient" onClick={addItem}>
          Add Item
        </button>
        <button type="submit" className="btn-gradient" disabled={loading}>
          {loading ? 'Creating Order...' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}
