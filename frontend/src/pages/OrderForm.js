import React, { useState, useEffect } from 'react';

const OrderForm = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    product_id: '',
    quantity: '',
    status: 'pending',
  });

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{order ? 'Edit Order' : 'Add Order'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="customer_id" placeholder="Customer ID" value={formData.customer_id} onChange={handleChange} required />
          <input name="product_id" placeholder="Product ID" value={formData.product_id} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
