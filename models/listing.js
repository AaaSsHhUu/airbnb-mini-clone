const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required :true
    },
    description : String,
    image : {
        type : String,
        default : "https://media.istockphoto.com/id/1466527775/photo/ponquogue-beach-in-the-hamptons.webp?b=1&s=170667a&w=0&k=20&c=Ppxl9896aQQoOixGQlTxiwAajE6S2zaU86F_a8qQGBQ=",

        set : (v) => v === "" ? "https://media.istockphoto.com/id/1466527775/photo/ponquogue-beach-in-the-hamptons.webp?b=1&s=170667a&w=0&k=20&c=Ppxl9896aQQoOixGQlTxiwAajE6S2zaU86F_a8qQGBQ=" : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;