# QuizBlitz ⚡

A real-time multiplayer quiz application built with React, TypeScript, Node.js, Socket.IO, PostgreSQL, Prisma, and Zustand.

## Features

* Real-time multiplayer quiz rooms
* Create and join rooms using a room code
* Live participant list
* Host-controlled quiz start
* Synchronized 3-second countdown
* Real-time question broadcasting
* Synchronized timer across all clients
* Answer submission and validation
* Automatic score calculation
* Live leaderboard and winner announcement
* Quiz result persistence using PostgreSQL

---

## Tech Stack

- Frontend: http://localhost:5137
- Backend:  http://localhost:5500

### Frontend

* React with Vite
* TypeScript
* React Router
* Zustand
* Tailwind CSS
* Socket.IO Client

### Backend

* Node.js
* Express
* Socket.IO
* TypeScript

### Database

* PostgreSQL
* Prisma ORM
* Neon Database

---

## Architecture

```text
Client (React + Zustand)
            │
            │ Socket.IO
            ▼
Backend (Node.js + Express)
            │
            ├── In-Memory Room State
            ├── Quiz State
            │
            ▼
PostgreSQL + Prisma
```

### Room State

Active rooms and quiz state are stored in memory for low-latency access.

### Persistent Data

Quiz results and player scores are stored in PostgreSQL using Prisma.

---

## Real-Time Synchronization

The server acts as the source of truth.

### Quiz Flow

1. Host creates a room
2. Players join using a room code
3. Host starts the quiz
4. Server broadcasts a synchronized countdown
5. Questions are sent to all participants simultaneously
6. Players submit answers
7. Server validates answers and updates scores
8. Results are displayed at the end of the quiz

### Timer Synchronization

Instead of sending timer updates every second, the server sends:

```ts
{
  startTime: Date.now(),
  duration: 10
}
```

Clients calculate the remaining time locally:

```ts
Date.now() - startTime
```

This reduces network traffic while keeping all players synchronized.

---

## Project Structure

```text
client/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── socket/
│   ├── store/
│   └── types/

server/
├── src/
│   ├── socket/
│   ├── rooms/
│   ├── quiz/
│   ├── services/
│   ├── lib/
│   └── types/
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Backend

```bash
cd server

npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_database_url
PORT=5500
```

Run migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start backend:

```bash
npm run dev
```

### Frontend

```bash
cd client

npm install

npm run dev
```

---

## Future Improvements

* Redis for distributed room state
* JWT authentication
* Question categories
* Difficulty levels
* Chat functionality
* Persistent rooms
* Admin dashboard
* Docker deployment

---

## Challenges Faced

### Real-Time Synchronization

Ensuring all users received questions and countdowns simultaneously.

### Timer Accuracy

Implemented server timestamps instead of sending timer updates every second.

### Duplicate Answer Prevention

Used server-side validation to prevent users from submitting multiple answers for the same question.

---

## Scaling Strategy

For production-scale deployment:

```text
Load Balancer
      │
Multiple Node.js Servers
      │
Socket.IO Redis Adapter
      │
Redis
      │
PostgreSQL
```

This would allow horizontal scaling while maintaining synchronized room state across servers.

---

## Author

Shubham Mishra

Full Stack Developer