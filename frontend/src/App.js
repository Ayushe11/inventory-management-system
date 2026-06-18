import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { fetchProducts } from './redux/slices/productSlice';
import { fetchCustomers } from './redux/slices/customerSlice';
import { fetchOrders } from './redux/slices/orderSlice';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" expand="lg" sticky="top" className="navbar-dark">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              📦 Inventory Management
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/products">Products</Nav.Link>
                <Nav.Link as={Link} to="/customers">Customers</Nav.Link>
                <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>

        <footer className="bg-light text-center py-4 mt-5">
          <Container>
            <p className="mb-0">&copy; 2024 Inventory & Order Management System. All rights reserved.</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
