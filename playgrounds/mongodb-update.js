let {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoListApp",(error,database)=>{
    if(error){
        return console.log("OOPS there seems to be an error connecting to the database");
    }
    console.log("Database connected Successfully");

    database.collection("Users").findOneAndUpdate({
        _id:new ObjectID("5b9eb494f22a3131a2c1e973"),
    },{
        $set:{
            name:"Charan"
        },
        $inc:{
            age:5
        }
    },{
        returnOriginal:false,
    }).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    })
})