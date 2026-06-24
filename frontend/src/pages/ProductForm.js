import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

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
        <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
