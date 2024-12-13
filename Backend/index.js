import mongoose from "mongoose";

mongoose.connect("mongodb+srv://navod:navod2002@mern.acr5oqy.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB: ", error.message);
    });