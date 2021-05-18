const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');



// set the view engine to ejs
app.set('view engine', 'ejs');

//Middlewares
app.use(cors());
app.use(express.json());


const authRoute = require('./routes/auth');
app.use('/api/users', authRoute);

const uploadRoute = require('./routes/file');
app.use('/api/files', uploadRoute);


//Connect to db
mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING, 
    {  useNewUrlParser: true }, 
    () => console.log('Conntected to db'));

// PORT Environment variable
const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
});