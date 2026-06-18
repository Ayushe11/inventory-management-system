import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Button, Alert, Row, Col } from 'react-bootstrap';
import { fetchCustomers, deleteCustomer, resetSuccess } from '../redux/slices/customerSlice';
import CustomerForm from './CustomerForm';

export default function CustomerList() {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector(state => state.customers);
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
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Customers</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Customer'}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <div className="card p-4 mb-4">
          <CustomerForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {loading && <p>Loading...</p>}

      {items.length === 0 ? (
        <Alert variant="info">No customers found. Create one to get started!</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
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
