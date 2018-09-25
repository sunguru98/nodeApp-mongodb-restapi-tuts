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
    noteName:"Goodbye ALL of you present !",
    noteCompleted:true,
    noteToBeCompletedAt:234346,
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


describe("DELETE/todos/:id",()=>{
    it("should delete a document successfully with the help of id",(done)=>{
        let inputtedId = dummyTodos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${inputtedId}`)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo._id).toBe(inputtedId);
            })
            .end((err,res)=>{
                if(err)
                    done(err);
                TodoModel.findById(inputtedId).then((res)=>{
                    expect(res).toBeFalsy();
                    done();
                }).catch(e=>{done(e)})
            });
    });

    it("doesnt delete when no id is present even if it is valid",(done)=>{
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should not delete when given an invalid id",(done)=>{
        request(app)
        .delete(`/todos/123}`)
        .expect(404)
        .end(done);
    })
});

describe("PATCH /todos/:id",()=>{
    it("should update the todo",(done)=>{
        let noteName = "Test Running through mocha";
        let inputtedId = dummyTodos[2]._id.toHexString();
        request(app)
            .patch(`/todos/${inputtedId}`)
            .send({noteName,noteCompleted:true})
            .expect(200)
            .expect(res=>{
                expect(res.body.todoResult.noteName).toBe(noteName);
                expect(res.body.todoResult.noteCompleted).toBe(true);
                expect(typeof res.body.todoResult.noteToBeCompletedAt).toBe('number');
                
            })
            .end((err,res)=>{
                if(err)
                    done(err);
                    TodoModel.findById(inputtedId).then(todo=>{
                        expect(todo.noteName).toBe(noteName);
                        expect(todo.noteCompleted).toBe(true);
                        expect(typeof res.body.todoResult.noteToBeCompletedAt).toBe('number');
                    done();
                }).catch(e=>{done(e)})
            });
        });

    it("should clear completedAt when todo is not completed",(done)=>{
        inputtedId = dummyTodos[1]._id.toHexString();
        let noteName = "Updated Text for testing";
        request(app)
            .patch(`/todos/${inputtedId}`)
            .send({noteName,noteCompleted:false})
            .expect(200)
            .expect(res=>{
                expect(res.body.todoResult.noteName).toBe(noteName);
                expect(res.body.todoResult.noteCompleted).toBe(false);
                expect(res.body.todoResult.noteToBeCompletedAt).toBeFalsy();
                
            })
            .end((err,res)=>{
                if(err)
                    done(err);
                    TodoModel.findById(inputtedId).then(todo=>{
                        expect(todo.noteName).toBe(noteName);
                        expect(todo.noteCompleted).toBe(false);
                        expect(res.body.todoResult.noteToBeCompletedAt).toBeFalsy();
                    done();
                }).catch(e=>{done(e)})
            });
    });
});