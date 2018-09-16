const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoListApp",(error,database)=>{
    if(error)
        return console.log("OOPS !! There seems to be an error connecting to the database");
    console.log("Connected To database successfully");
    // database.collection("TodoNotes").insert({
    //     text:"The first note",
    //     completed:false
    // },(error,resultObject)=>{
    //     if(error){
    //         return console.log("OOPS !! There seems to be a problem in inserting the document ");
    //     }
    //     console.log(JSON.stringify(resultObject.ops,undefined,2));
    // })

    database.collection("Users").insertOne({
        name:"R.Sundeep Charan",
        age:20,
        location:"Coimbatore"
    },(error,resultObject)=>{
        if(error){
            console.log("OOPS !! There seems to be an error in inserting the data ");
        }
        console.log(JSON.stringify(resultObject.ops,undefined,2));
    })
    //database.close();


});