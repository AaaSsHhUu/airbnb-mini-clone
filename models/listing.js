const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

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
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

// post middleware of mongoose to delete all review if listing is deleted
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;