require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB=require('./db/connect');

const authRouter=require('./routes/auth');
const eventRouter=require('./routes/events');
const authentication=require('./middleware/authentication');

app.use(cors());
app.use(express.json()); 
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/events',authentication,eventRouter);

app.get('/', (req, res) => {
  res.send('mission impossible');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4500;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();