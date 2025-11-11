const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title:{type:String , required:true},
    content : {type:String,required:true},
    tags:{type:[String],default:[]},
    isPinned : {type:Boolean,default:false},
    createdOn:{type:Date,default:Date.now},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Note = mongoose.models.Note || mongoose.model("Note",noteSchema) ;

module.exports = Note;