const {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoListApp",(error,database)=>{
    if(error){
        return console.log("OOPS there seems to be a problem in connecting to the database");
    }
    console.log("Database connected succesfully");
    database.collection("Users").find({name:"R.Sundeep Charan"}).toArray().then((resultObj)=>{
        console.log(JSON.stringify(resultObj,undefined,2));
    },(err)=>{
        console.log("OOPS! An unexpected error occured",err);
    })

    database.close();
})