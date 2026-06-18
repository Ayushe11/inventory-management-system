import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { fetchOrders, deleteOrder, resetSuccess } from '../redux/slices/orderSlice';
import { fetchCustomers } from '../redux/slices/customerSlice';
import OrderForm from './OrderForm';

export default function OrderList() {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector(state => state.orders);
  const { items: customers } = useSelector(state => state.customers);
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
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Orders</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create Order'}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <div className="card p-4 mb-4">
          <OrderForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {loading && <p>Loading...</p>}

      {items.length === 0 ? (
        <Alert variant="info">No orders found. Create one to get started!</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
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
              {items.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{getCustomerName(order.customer_id)}</td>
                  <td>{order.items ? order.items.length : 0}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}
