# Personal Finance Management System

A comprehensive personal finance management application with a FastAPI backend and React Native (Expo) mobile app.

## 📋 Table of Contents
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Mobile App Setup](#mobile-app-setup)
  - [Docker Setup](#docker-setup)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)

## 📁 Project Structure

```
CBU_CODING/
├── backend/          # FastAPI backend
│   ├── app/         # Application code
│   ├── alembic/     # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
├── mobile/          # React Native (Expo) mobile app
│   ├── src/        # Mobile app source code
│   ├── assets/     # Images and assets
│   └── package.json
├── frontend/       # (Currently empty)
└── docker-compose.yml
```

## ⚙️ Prerequisites

Before running this project, ensure you have the following installed:

- **Python 3.12+** (for backend)
- **Node.js 18+** and **npm** (for mobile app)
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Git**

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   - Copy the `.env.example` from the root directory:
     ```bash
     cp ../.env.example .env
     ```
   - Update the `.env` file with your configuration (change the `SECRET_KEY` for production)

6. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

### Mobile App Setup

1. **Navigate to the mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   - Update the API base URL in your mobile app configuration to point to your backend
   - Default backend URL: `http://localhost:8000`

## ▶️ Running the Project

### Running the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Activate the virtual environment** (if not already activated):
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

3. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at: **http://localhost:8000**

### Running the Mobile App

1. **Navigate to the mobile directory:**
   ```bash
   cd mobile
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   ```

3. **Run on specific platform:**
   - **Android:**
     ```bash
     npm run android
     ```
   - **iOS:**
     ```bash
     npm run ios
     ```
   - **Web:**
     ```bash
     npm run web
     ```

4. **Using Expo Go:**
   - Install the **Expo Go** app on your mobile device
   - Scan the QR code displayed in the terminal
   - Make sure your device is on the same network as your development machine

### Docker Setup (Alternative)

Run the entire backend using Docker:

1. **Navigate to the project root:**
   ```bash
   cd CBU_CODING
   ```

2. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

   The backend will be available at: **http://localhost:8000**

3. **Stop the containers:**
   ```bash
   docker-compose down
   ```

## 📚 API Documentation

Once the backend is running, you can access the interactive API documentation:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🛠 Technologies Used

### Backend
- **FastAPI** - Modern web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **SQLite** - Lightweight database (aiosqlite for async)
- **Pydantic** - Data validation
- **Python-JOSE** - JWT authentication
- **Bcrypt** - Password hashing
- **Uvicorn** - ASGI server

### Mobile
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Axios** - HTTP client
- **React Native Chart Kit** - Data visualization
- **React Native Calendars** - Calendar components

## 📝 Features

- 🔐 User authentication (JWT)
- 💰 Account management
- 📊 Transaction tracking
- 💸 Transfer management
- 🏷️ Category management
- 💳 Debt tracking
- 📅 Budget planning
- 📈 Analytics and insights

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ for CBU_CODING**
