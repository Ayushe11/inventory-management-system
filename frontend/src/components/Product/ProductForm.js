import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../redux/slices/productSlice';

export default function ProductForm({ onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await dispatch(createProduct({
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      })).unwrap();

      setFormData({ name: '', sku: '', price: '', quantity: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-alert">{error}</div>}

      <div className="floating-field">
        <input
          className="floating-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label>Product Name</label>
      </div>

      <div className="floating-field">
        <input
          className="floating-input"
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label>SKU/Code</label>
      </div>

      <div className="floating-field">
        <input
          className="floating-input"
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label>Price</label>
      </div>

      <div className="floating-field">
        <input
          className="floating-input"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label>Quantity</label>
      </div>

      <button className="btn-gradient" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
