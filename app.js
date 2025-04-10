require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const eventRouter = require('./routes/events');
const authentication = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();
const server = http.createServer(app);

// Create socket.io server instance
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for security (e.g., 'https://your-frontend.com')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Share `io` instance globally using middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/events', authentication, eventRouter);

app.get('/', (req, res) => {
  res.send('mission impossible');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4500;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () =>
      console.log(`Server with Socket.IO is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
