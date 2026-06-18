# Development Guide

This guide covers local development setup and best practices.

## Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+
- Docker & Docker Compose (optional but recommended)

## Option 1: Using Docker Compose (Recommended)

### Start All Services
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop Services
```bash
docker-compose down
```

### Clean Everything (reset database)
```bash
docker-compose down -v
```

## Option 2: Local Development

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection details
```

5. **Create database**
```bash
# Assuming PostgreSQL is running locally
createdb inventory_db
```

6. **Run the server**
```bash
python run.py
```

Server will be available at http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF
```

4. **Start development server**
```bash
npm start
```

App will open at http://localhost:3000

## API Development

### Adding a New Endpoint

1. **Define model in `app/models.py`**
```python
class NewEntity(db.Model):
    __tablename__ = 'new_entities'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
```

2. **Create schema in `app/schemas.py`**
```python
class NewEntitySchema(ma.Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
```

3. **Create routes in `app/routes/new_entities.py`**
```python
from flask import Blueprint

new_entities_bp = Blueprint('new_entities', __name__, url_prefix='/api/new-entities')

@new_entities_bp.route('', methods=['GET'])
def get_new_entities():
    # Implementation
    pass
```

4. **Register blueprint in `app/__init__.py`**
```python
from app.routes import new_entities_bp
app.register_blueprint(new_entities_bp)
```

## Frontend Development

### Adding a New Page

1. **Create page component in `src/pages/NewPage.js`**
```javascript
import React from 'react';

export default function NewPage() {
  return <div>New Page</div>;
}
```

2. **Add route in `src/App.js`**
```javascript
<Route path="/new-page" element={<NewPage />} />
```

3. **Add navigation link in navbar**
```javascript
<Nav.Link as={Link} to="/new-page">New Page</Nav.Link>
```

### Adding a Redux Slice

1. **Create slice in `src/redux/slices/newSlice.js`**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNewItems = createAsyncThunk(
  'newItems/fetch',
  async (_, { rejectWithValue }) => {
    // API call
  }
);

const newSlice = createSlice({
  name: 'newItems',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    // Reducer logic
  }
});

export default newSlice.reducer;
```

2. **Add to store in `src/redux/store.js`**
```javascript
reducer: {
  newItems: newReducer
}
```

## Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Code Style

### Backend
- Follow PEP 8
- Use meaningful variable names
- Add docstrings to functions
- Keep functions under 50 lines

### Frontend
- Use ES6+ syntax
- Follow React best practices
- Use functional components with hooks
- Keep components focused

## Database Migrations

Using Flask-Migrate (optional setup):

```bash
pip install Flask-Migrate
flask db init
flask db migrate -m "Description"
flask db upgrade
```

## Common Tasks

### Reset Database
```bash
# Docker
docker-compose down -v
docker-compose up -d postgres
docker-compose up backend

# Local
dropdb inventory_db
createdb inventory_db
python run.py
```

### Debug Backend
```bash
# Add to code
import pdb; pdb.set_trace()

# Run with debugging
python -m pdb run.py
```

### Debug Frontend
- Use React DevTools extension
- Use Redux DevTools extension
- Check browser console (F12)

## Performance Tips

1. **Database**
   - Add indexes for frequently queried columns
   - Use pagination for large result sets
   - Profile slow queries

2. **Frontend**
   - Use React.memo for expensive components
   - Implement code splitting
   - Optimize images

3. **Backend**
   - Cache responses
   - Use connection pooling
   - Implement rate limiting

## Security Best Practices

1. **Never commit secrets**
   - Use .env files
   - Add sensitive files to .gitignore

2. **Validate all inputs**
   - Backend validation is mandatory
   - Frontend validation is UX enhancement

3. **Use HTTPS in production**
   - Railway/Netlify provide free SSL

4. **Keep dependencies updated**
   ```bash
   # Backend
   pip list --outdated

   # Frontend
   npm outdated
   ```

## Useful Commands

```bash
# Backend
python run.py              # Run development server
pip freeze > requirements.txt  # Update requirements

# Frontend
npm start                  # Start dev server
npm run build              # Create production build
npm test                   # Run tests
npm run eject              # Expose webpack config

# Docker
docker-compose up -d       # Start services
docker-compose down        # Stop services
docker-compose logs -f     # View logs
docker-compose ps          # List services
docker-compose exec backend bash  # Shell in container
```

## IDE Setup

### VS Code
Recommended extensions:
- Python
- Pylance
- Flask
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint

### PyCharm
- Built-in Flask support
- Integrated debugger

## Getting Help

- Check README.md for API documentation
- Review existing code for patterns
- Check Flask documentation
- Check React documentation
- Ask team members
