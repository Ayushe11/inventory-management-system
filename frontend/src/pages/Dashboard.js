import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { fetchProducts, fetchCustomers, fetchOrders } from '../redux/slices/productSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: products } = useSelector(state => state.products);
  const { items: customers } = useSelector(state => state.customers);
  const { items: orders } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
    dispatch(fetchOrders());
  }, [dispatch]);

  const lowStockProducts = products.filter(p => p.quantity <= 10);
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 bg-primary text-white">
            <Card.Body>
              <h5>Total Products</h5>
              <h2>{products.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 bg-success text-white">
            <Card.Body>
              <h5>Total Customers</h5>
              <h2>{customers.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 bg-info text-white">
            <Card.Body>
              <h5>Total Orders</h5>
              <h2>{orders.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 bg-warning text-white">
            <Card.Body>
              <h5>Total Revenue</h5>
              <h2>${totalRevenue.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {lowStockProducts.length > 0 && (
        <Alert variant="warning">
          <h5>Low Stock Alert</h5>
          <p>{lowStockProducts.length} product(s) have quantity ≤ 10:</p>
          <ul className="mb-0">
            {lowStockProducts.map(product => (
              <li key={product.id}>{product.name} - Stock: {product.quantity}</li>
            ))}
          </ul>
        </Alert>
      )}
    </Container>
  );
}
