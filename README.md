# Email Application

This project is a simple email application that allows users to send, receive, and manage emails. It consists of a backend built with FastAPI and a frontend built with React, utilizing Redux for state management.

## Project Structure

- **Backend**: Located in the `backend` branch.
- **Frontend**: Located in the `frontend` branch.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

To get started, you need to set up the backend server first. Follow the instructions below:

### 1. Clone the Repository

```bash
git clone https://your-repo-url.git
cd your-repo-directory
```

### 2. Switch to the Backend Branch

```bash
git checkout backend
```

### 3. Set Up the Database

Before running the server, ensure you have PostgreSQL installed. You can use Docker to run PostgreSQL as well.

If you're using Docker, you can define your database in the `docker-compose.yml` file. Here’s an example configuration:

```yaml
version: '3.8'
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
      POSTGRES_DB: email_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 4. Start the Backend Server

Make sure you're in the backend directory with the `docker-compose.yml` file, then run:

```bash
docker-compose up --build
```

This will start the backend server along with the PostgreSQL database.

### 5. Switch to the Frontend Branch

After the backend server is running, switch to the frontend branch:

```bash
git checkout frontend
```

### 6. Install Frontend Dependencies

Make sure you have Node.js and npm installed. Then, install the frontend dependencies:

```bash
npm install
```

### 7. Start the Frontend Server

You can start the frontend application using:

```bash
npm start
```

This will run the application on `http://localhost:3000`.

## Docker Option

To run both the backend and frontend applications using Docker, you can create a multi-service `docker-compose.yml` file that incorporates both projects.

### Sample Docker Compose Configuration

```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - db

  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
      POSTGRES_DB: email_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Database

The application uses PostgreSQL as the database to store user information, emails, and attachments. The database schema is defined to support functionalities such as:

- Storing user email addresses.
- Storing email metadata including subject, body, sender, and receiver details.
- Supporting file attachments in Base64 format.

Make sure to create the necessary database tables according to your schema requirements.

## Usage

1. **Send Emails**: Users can compose and send emails to other users.
2. **View Emails**: Users can view their received emails.
3. **Attachments**: Users can attach files to their emails.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
