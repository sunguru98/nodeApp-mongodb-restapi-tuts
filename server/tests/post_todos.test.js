let request = require("supertest");
let expect = require("expect");
let {app} = require("./../server");
let {TodoModel} = require("./../model/TodoListModel");
let {ObjectID} = require("mongodb");

let dummyTodos = [{
    _id:new ObjectID(),
    noteName:"Hello There"
},{
    _id:new ObjectID(),
    noteName:"Hi Everyone !"
},{
    _id:new ObjectID(),
    noteName:"Goodbye ALL of you present !"
}];

beforeEach(done=>{
    TodoModel.deleteMany({}).then(()=>{
        TodoModel.insertMany(dummyTodos)
    }).then(()=>done());
}); 
describe("POST/todos",()=>{
    it("should return a valid object from database when valid data is given",done=>{
        let noteName = "Vanakkam Coimbatore";
        request(app)
            .post("/todos")
            .send({noteName})
            .expect(200)
            .expect(result=>{
                expect(result.body.noteName).toBe(noteName);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                TodoModel.find({noteName}).then(results=>{
                    expect(results.length).toBe(1);
                    expect(results[0].noteName).toBe(noteName);
                    done();
                }).catch(e=>{done(e);})
            });
    });

    it("should not create a row when no Object is inputted",done=>{
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                TodoModel.find().then(results=>{
                    expect(results.length).toBe(3);
                    done();
                }).catch(e=>{done(e);})
            });
    });
});

describe("GET /todos",()=>{
    it("should return all todo lists",(done)=>{
        
        request(app)
            .get("/todos")
            .expect(200)
            .expect(res=>{
                expect(res.body.results.length).toBe(3) ;
            })
            .end(done);
    });
});

describe("GET/todos/:id",()=>{
    it("should return the correct todo when passing correct id",(done)=>{
        request(app)
            .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.noteName).toBe(dummyTodos[0].noteName);
            })
            .end(done);
    });

    it("should return 404 if given id doesn't exist",(done)=>{
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 if it is not a syntactical correct id",(done)=>{
        request(app)
            .get(`/todos/123}`)
            .expect(404)
            .end(done);
    });
});