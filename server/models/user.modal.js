const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullName : {type:String},
    email : {type:String},
    password : {type:String},
    createdOn : {type:Date,default: Date.now},
});

const User = mongoose.models.User || mongoose.model("User",UserSchema);
module.exports = User;