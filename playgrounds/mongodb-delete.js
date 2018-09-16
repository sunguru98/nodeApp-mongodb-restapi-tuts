const {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoListApp",(error,database)=>{
    if(error){
        return console.log("OOPS there seems to be a problem in connecting to the database");
    }
    console.log("Database connected succesfully");
    database.collection("Users").deleteMany({name:"R.Sundeep Charan"}).then((result)=>{
        console.log(result)
    })

    database.collection("Users").deleteOne({_id:new ObjectID("5b9eb49c840a0e31a3ddf491")}).then((result)=>{
        console.log(result);
    })

    //database.close();
})