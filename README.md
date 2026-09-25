# SupportDesk CRM

A simple and responsive Support CRM system for creating, managing, searching, and updating customer support tickets.

## Live Application

* **Frontend:** https://supportdesk-crm-five.vercel.app/
* **Backend API:** https://supportdesk-crm-api.onrender.com
* **GitHub Repository:** https://github.com/Ahmad-Adnan/supportdesk-crm

## Project Overview

SupportDesk CRM allows support teams to manage customer tickets through a simple web-based interface.

Users can create new tickets, view all tickets, search tickets, filter tickets by status, view ticket details, update ticket status, and add notes or comments.

The project was developed as part of the Datastraw Technologies hiring assignment.

## Features

* Create support tickets
* Automatically generate ticket IDs
* Automatically record ticket creation timestamps
* View all support tickets
* Search tickets by:

  * Customer name
  * Customer email
  * Ticket ID
  * Title
  * Description
* Filter tickets by status:

  * Open
  * In Progress
  * Closed
* View complete ticket details
* Update ticket status
* Add notes or comments to tickets
* REST API-based backend
* Responsive user interface
* Production deployment using Vercel and Render

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST API

### Database and ORM

* SQLite
* Prisma ORM

### Deployment

* Vercel for frontend hosting
* Render for backend hosting

### Version Control

* Git
* GitHub

## Application Architecture

User
 │
 ▼
React Frontend
Hosted on Vercel
 │
 │ HTTP Requests
 ▼
Express.js REST API
Hosted on Render
 │
 ▼
Prisma ORM
 │
 ▼
SQLite Database


## Project Structure

supportdesk-crm/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── server.js
│   ├── prisma7.config.ts
│   ├── package.json
│   ├── .env.example
│   └── dev.db
│
├── .gitignore
└── README.md

## Database Design

The application uses SQLite with Prisma ORM.

The database stores ticket information such as:

* Ticket ID
* Customer name
* Customer email
* Ticket title
* Ticket description
* Ticket status
* Creation timestamp
* Update timestamp

Notes or comments are associated with the relevant ticket.

## API Endpoints

### Create a Ticket

POST /api/tickets

Creates a new support ticket.

### Get All Tickets

GET /api/tickets

Returns all tickets.

### Filter Tickets by Status

GET /api/tickets?status=OPEN

Returns tickets matching the selected status.

Supported statuses:

OPEN
IN_PROGRESS
CLOSED

### Search Tickets

```http
GET /api/tickets?search=login
```

Searches tickets using relevant ticket and customer information.

### Get a Ticket by ID

```http
GET /api/tickets/:ticketId
```

Returns the details of a specific ticket.

### Update a Ticket

```http
PUT /api/tickets/:ticketId
```

Updates ticket information, including its status and notes.

## Local Setup

### Prerequisites

Install the following tools:

* Node.js
* npm
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/Ahmad-Adnan/supportdesk-crm.git
cd supportdesk-crm
```

## Backend Setup

Move into the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
PORT=5000
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Run the database migration:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

## Frontend Setup

Open a new terminal and move into the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## Environment Variables

### Backend

```env
DATABASE_URL="file:./dev.db"
PORT=5000
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

For production, the frontend uses the deployed Render backend URL through the `VITE_API_URL` environment variable.

## Prisma ORM

Prisma ORM acts as a bridge between the Node.js application and the database.

It allows the backend to perform database operations using JavaScript instead of writing SQL queries manually.

Prisma is used for:

* Defining the database schema
* Creating and updating database tables
* Generating the Prisma Client
* Creating, reading, updating, and deleting records
* Managing database migrations
* Simplifying database access from the backend

## Deployment

### Frontend

The React frontend is deployed on Vercel.

The frontend communicates with the production backend through the configured `VITE_API_URL` environment variable.

### Backend

The Express.js backend is deployed on Render.

The backend uses SQLite and Prisma ORM for database operations.

## Security and Configuration

* Environment files are excluded from Git using `.gitignore`.
* Sensitive configuration values are stored in environment variables.
* `.env.example` is provided for configuration reference.
* The application uses separate frontend and backend deployments.
* The frontend communicates with the backend through REST API requests.

## Key Design Decisions

### React and Vite

React provides a component-based user interface, while Vite offers a fast and simple development environment.

### Express.js

Express.js was selected to build a lightweight REST API with a clear backend structure.

### Prisma ORM

Prisma simplifies database operations and reduces the need to write raw SQL queries.

### SQLite

SQLite was selected because it is lightweight, easy to configure, and suitable for a small CRM assignment.

### Vercel and Render

Vercel and Render provide simple deployment options for the frontend and backend separately.

## Challenges and Solutions

### Frontend and Backend Deployment

During deployment, the frontend initially used the local backend URL.

This was resolved by:

1. Moving the API URL into the `VITE_API_URL` environment variable.
2. Configuring the production API URL in Vercel.
3. Deploying the backend separately on Render.
4. Updating the frontend to communicate with the production backend.

This allowed the deployed frontend and backend to communicate successfully.

## Future Improvements

Possible future enhancements include:

* User authentication and role-based access
* Ticket priority levels
* File attachments
* Email notifications
* Pagination
* Dashboard analytics
* Advanced ticket sorting
* Improved note history
* Automated testing
* PostgreSQL support for larger-scale deployments

## Demo Video

The demo video will demonstrate:

* Creating a support ticket
* Viewing the ticket list
* Searching for tickets
* Filtering tickets by status
* Viewing ticket details
* Updating ticket status
* Adding notes or comments
* Brief code and architecture explanation

## Project Author

**Adnan Ahmad**

* GitHub: https://github.com/Ahmad-Adnan
* LinkedIn: Add your LinkedIn profile URL

## License

This project was developed for educational and hiring-assignment purposes.
