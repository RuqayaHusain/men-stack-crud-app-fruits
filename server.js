const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const path = require("path");
const mongoose =  require('mongoose');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;
// DB CONNECTION
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
// MODELS
const Fruit = require('./models/fruit');// you don't have to write the file's extension (.js), when using the require function

// MIDDLEWARE
app.use(methodOverride('_method')); // we override the method before logging it using morgan
// app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));// a middleware that converts model into a javascript object
app.use(express.static(path.join(__dirname, "public"))); //added this to be able to add the css

// ROUTES
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/fruits', async (req, res) => {
    const msg = req.query.msg; // get the message passed by the delete route
    console.log(msg);
    const fruits = await Fruit.find({}); // or .find() which will print all of the fruits
    res.render('fruits/index.ejs', {
        fruits: fruits,
    });
});

app.post('/fruits', async (req, res) => {
    if(req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body); // passes the javascript object to be created using the exported Fruit model
    // console.log(req.body); // print the encoded object as javascript object
    res.redirect('/fruits'); //redirect triggers a get request (we add routes as an argument) to the index page if it exists
})
,
app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs');
});

app.get("/fruits/:fruitId", async (req, res) => {
    const fruitId = req.params.fruitId;
    const fruit = await Fruit.findById(fruitId);
    res.render('fruits/show.ejs', { fruit });
});

app.get("/fruits/:fruitId/edit", async (req, res) => {
    const fruitId = req.params.fruitId;
    const fruit = await Fruit.findById(fruitId);
    res.render('fruits/edit.ejs', { fruit });
});

app.delete('/fruits/:fruitId', async (req, res) => {
    const fruitId = req.params.fruitId;
    const fruit = await Fruit.findByIdAndDelete(fruitId); // findByIdAndDelete() gets the object, then deletes it, you can access the deleted object by storing it 
    res.redirect(`/fruits?msg='${fruit.name} record deleted'`); // send a message containing the details of the deleted object
});

app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
