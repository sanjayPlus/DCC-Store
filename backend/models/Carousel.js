// CarouselModel.js
const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema({
image:String,
href:String
});

const Carousel = mongoose.model("Carousel", CarouselSchema);

module.exports = Carousel;
