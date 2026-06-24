import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { fetchOrders, deleteOrder, resetSuccess } from '../redux/slices/orderSlice';
import { fetchCustomers } from '../redux/slices/customerSlice';
import OrderForm from './OrderForm';

export default function OrderList() {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector((state) => state.orders);
  const { items: customers } = useSelector((state) => state.customers);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowForm(false);
      dispatch(resetSuccess());
      dispatch(fetchOrders());
    }
  }, [success, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteOrder(id));
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="page-panel">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">Order flows with polished rows, status clarity, and premium controls.</p>
        </div>
        <button className="btn-gradient" type="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Order'}
        </button>
      </div>

      {error && <div className="form-alert">{error}</div>}

      {showForm && (
        <div className="premium-panel">
          <OrderForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {loading && <p>Loading...</p>}

      {items.length === 0 ? (
        <div className="premium-panel">
          <p>No orders found. Create one to get started!</p>
        </div>
      ) : (
        <div className="premium-panel table-responsive">
          <Table className="premium-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{getCustomerName(order.customer_id)}</td>
                  <td>{order.items ? order.items.length : 0}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>{getStatusLabel(order.status)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-gradient" type="button" onClick={() => handleDelete(order.id)}>
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
