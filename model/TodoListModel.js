let mongoose = require("mongoose");

let TodoModel = mongoose.model("TodoModel",{
    noteName:{
        type:String,
        minlength:1,
        required:true
    },
    noteCompleted:{
        type:Boolean,
        default:false,

    },
    noteToBeCompletedAt:{
        type:Number,
        default:null
    }   
});

module.exports= {TodoModel};