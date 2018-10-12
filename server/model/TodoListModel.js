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
    },
    _userCreatedId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }   
});

module.exports= {TodoModel};