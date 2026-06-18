#!/bin/bash
# Quick start script for Inventory Management System

set -e

echo "🚀 Starting Inventory & Order Management System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker found"

# Create .env file from example
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
fi

echo "🐳 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "✅ Services started successfully!"
echo ""
echo "📊 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Database: localhost:5432"
echo ""
echo "📝 Database credentials:"
echo "   User: postgres"
echo "   Password: inventory_password"
echo "   Database: inventory_db"
echo ""
echo "💡 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Clean everything: docker-compose down -v"
