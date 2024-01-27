const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");

main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req,res)=>{
    res.send("Root is wotking");
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})