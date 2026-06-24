import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { fetchCustomers, deleteCustomer, resetSuccess } from '../redux/slices/customerSlice';
import CustomerForm from './CustomerForm';

export default function CustomerList() {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector((state) => state.customers);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowForm(false);
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCustomer(id));
    }
  };

  return (
    <div className="page-panel">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p className="page-subtitle">A premium customer hub with smooth interactions and clean row styling.</p>
        </div>
        <button className="btn-gradient" type="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {error && <div className="form-alert">{error}</div>}

      {showForm && (
        <div className="premium-panel">
          <CustomerForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {loading && <p>Loading...</p>}

      {items.length === 0 ? (
        <div className="premium-panel">
          <p>No customers found. Create one to get started!</p>
        </div>
      ) : (
        <div className="premium-panel table-responsive">
          <Table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <button className="btn-gradient" type="button" onClick={() => handleDelete(customer.id)}>
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
