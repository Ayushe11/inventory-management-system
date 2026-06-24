import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Alert } from 'react-bootstrap';
import { fetchProducts, deleteProduct, resetSuccess } from '../redux/slices/productSlice';
import ProductForm from './ProductForm';

export default function ProductList() {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector((state) => state.products);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowForm(false);
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="page-panel">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">A refined product catalog with immersive controls and crisp row interactions.</p>
        </div>
        <button className="btn-gradient" type="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && <div className="form-alert">{error}</div>}

      {showForm && (
        <div className="premium-panel">
          <ProductForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {loading && <p>Loading...</p>}

      {items.length === 0 ? (
        <div className="premium-panel">
          <p>No products found. Create one to get started!</p>
        </div>
      ) : (
        <div className="premium-panel table-responsive">
          <Table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button className="btn-gradient" type="button" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
