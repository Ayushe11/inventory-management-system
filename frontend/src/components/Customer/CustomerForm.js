import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCustomer } from '../redux/slices/customerSlice';

export default function CustomerForm({ onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
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
      await dispatch(createCustomer(formData)).unwrap();
      setFormData({ name: '', email: '', phone: '' });
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
        <label>Full Name</label>
      </div>

      <div className="floating-field">
        <input
          className="floating-input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label>Email</label>
      </div>

      <div className="floating-field">
        <input
          className="floating-input"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label>Phone</label>
      </div>

      <button className="btn-gradient" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Customer'}
      </button>
    </form>
  );
}
