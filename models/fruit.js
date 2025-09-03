const mongoose = require('mongoose');

const fruitSchema = mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
});

const Fruit = mongoose.model('Fruit', fruitSchema);//model's name is always in starts with a capital letter

module.exports = Fruit; //export the Fruit model