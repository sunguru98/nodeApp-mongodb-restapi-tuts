let request = require("supertest");
let expect = require("expect");
let {app} = require("./../server");
let {TodoModel} = require("./../model/TodoListModel");
let {ObjectID} = require("mongodb");
let {UserModel} = require("./../model/UserModel");
let {dummyUsers,dummyTodos,populateTodos,populateUsers} = require("./seeds/seeds");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST/todos",()=>{
    it("should return a valid object from database when valid data is given",done=>{
        let noteName = "Vanakkam Coimbatore";
        request(app)
            .post("/todos")
            .set("x-auth",dummyUsers[0].tokens[0].token)
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
            .set("x-auth",dummyUsers[0].tokens[0].token)
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
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res=>{
                expect(res.body.results.length).toBe(1) ;
            })
            .end(done);
    });
});

describe("GET/todos/:id",()=>{
    it("should return the correct todo when passing correct id",(done)=>{
        request(app)
            .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.noteName).toBe(dummyTodos[0].noteName);
            })
            .end(done);
    });

    it("should not return the todo when passing some user's id",(done)=>{
        request(app)
            .get(`/todos/${dummyTodos[1]._id.toHexString()}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(400) 
            .end(done);
    });

    it("should return 400 if given id doesn't exist",(done)=>{
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it("should return 404 if it is not a syntactical correct id",(done)=>{
        request(app)
            .get(`/todos/123}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});


describe("DELETE/todos/:id",()=>{
    it("should delete a document successfully with the help of id",(done)=>{
        let inputtedId = dummyTodos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${inputtedId}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo._id).toBe(inputtedId);
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
                TodoModel.findById(inputtedId).then((res)=>{
                    expect(res).toBeFalsy();
                    done();
                }).catch(e=>{done(e)})
            });
    });

    it("should not delete a document of some other id",(done)=>{
        let inputtedId = dummyTodos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${inputtedId}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(404)
            .end((err,res)=>{
                if(err)
                    return done(err);
                TodoModel.findById(inputtedId).then((res)=>{
                    expect(res).toBeTruthy();
                    done();
                }).catch(e=>{done(e)})
            });
    });

    it("doesnt delete when no id is present even if it is valid",(done)=>{
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should not delete when given an invalid id",(done)=>{
        request(app)
        .delete(`/todos/123}`)
        .set("x-auth",dummyUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    })
});

describe("PATCH /todos/:id",()=>{
    it("should update the todo",(done)=>{
        let noteName = "Test Running through mocha";
        let inputtedId = dummyTodos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${inputtedId}`)
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .send({noteName,noteCompleted:true})
            .expect(200)
            .expect(res=>{
                expect(res.body.todoResult.noteName).toBe(noteName);
                expect(res.body.todoResult.noteCompleted).toBe(true);
                expect(typeof res.body.todoResult.noteToBeCompletedAt).toBe('number');
                
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
                    TodoModel.findById(inputtedId).then(todo=>{
                        expect(todo.noteName).toBe(noteName);
                        expect(todo.noteCompleted).toBe(true);
                        expect(typeof res.body.todoResult.noteToBeCompletedAt).toBe('number');
                    done();
                }).catch(e=>{done(e)})
            });
        });

        it("should not update the todo when given some other id",(done)=>{
            let noteName = "Test Running through mocha";
            let inputtedId = dummyTodos[1]._id.toHexString();
            request(app)
                .patch(`/todos/${inputtedId}`)
                .set("x-auth",dummyUsers[0].tokens[0].token)
                .send({noteName,noteCompleted:true})
                .expect(404)
                .end((err,res)=>{
                    if(err)
                        return done(err);
                        TodoModel.findById(inputtedId).then(todo=>{
                            expect(todo.noteName).not.toBe(noteName);
                            expect(todo.noteCompleted).not.toBe(true);
                        done();
                    }).catch(e=>{done(e)})
                });
            });

    it("should clear completedAt when todo is not completed",(done)=>{
        inputtedId = dummyTodos[1]._id.toHexString();
        let noteName = "Updated Text for testing";
        request(app)
            .patch(`/todos/${inputtedId}`)
            .set("x-auth",dummyUsers[1].tokens[0].token)
            .send({noteName,noteCompleted:false})
            .expect(200)
            .expect(res=>{
                expect(res.body.todoResult.noteName).toBe(noteName);
                expect(res.body.todoResult.noteCompleted).toBe(false);
                expect(res.body.todoResult.noteToBeCompletedAt).toBeFalsy();
                
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
                TodoModel.findById(inputtedId).then(todo=>{
                    expect(todo.noteName).toBe(noteName);
                    expect(todo.noteCompleted).toBe(false);
                    expect(res.body.todoResult.noteToBeCompletedAt).toBeFalsy();
                    done();
                }).catch(e=>{done(e)})
            });
    });
});

describe("GET users/me",()=>{
    it("should authenticate when given correct token format",(done)=>{
        request(app)
            .get("/users/me")
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res=>{
                
                expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
                expect(res.body.email).toBe(dummyUsers[0].email);
            })
            .end(done);
    });

    it("should give a 401 if a wrong or no token is given",(done)=>{
        request(app)
            .get("/users/me")
            .set("x-auth","")
            .expect(401)
            .end(done);
    });
});

describe("/POST/users",()=>{
    it("should successfully create a unique user",(done)=>{
        let testEmail = "sunguru98@gmail.com";
        let testPassword = "Sundeep1998";
        request(app)
            .post("/users")
            .send({email:testEmail,password:testPassword})
            .expect(200)
            .expect(res=>{
                expect(res.headers["x-auth"]).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(testEmail)
            })
            .end(err=>{
                if(err)
                    done(err);
                UserModel.findOne({email:testEmail}).then(user=>{
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(testPassword);
                    done();
                }).catch(e=>done(e));
            });
    });

    it("should return bad request for invalid email and password",(done)=>{
        let testEmail = "sundeepCharan";
        let testPassword = "te";
        request(app)
            .post("/users")
            .send({email:testEmail,password:testPassword})
            .expect(400)
            .end(done)
    });

    it("should return a bad request if given an already existed email",(done)=>{
        request(app)
            .post("/users")
            .send({email:dummyUsers[0].email,password:dummyUsers[0].password})
            .expect(400)
            .end(done)
    });
});

describe("POST/users/login",()=>{
    it("should successfully login if given valid credentials",done=>{
        let resultHeader;
        request(app)
            .post("/users/login")
            .send({email:dummyUsers[1].email,password:dummyUsers[1].password})
            .expect(200)
            .expect(result=>{
                resultHeader = result.headers["x-auth"];
                expect(result.headers["x-auth"]).toBeTruthy();
            })
            .end(err=>{
                if(err)
                   return done(err);
                UserModel.findById(dummyUsers[1]._id).then(user=>{
                    expect(user.toObject().tokens[1]).toMatchObject({
                        "access":"auth",
                        "token":resultHeader,
                    });
                    done();
                }).catch(e=>done(e));
            });
    });

    it("should give an invalid response when invalid credentials are given",done=>{
        request(app)
        .post("/users/login")
        .send({email:dummyUsers[1].email,password:"aassds"})
        .expect(401)
        .expect(result=>{
            expect(result.headers["x-auth"]).toBeFalsy();
        })
        .end(err=>{
            if(err)
               return done(err);
            UserModel.findById(dummyUsers[1]._id).then(user=>{
                expect(user.tokens.length).toBe(1);
                done();
            }).catch(e=>done(e));
        });
    });
});

describe("DELETE/users/me/token",()=>{
    it("should deletle the token when logging off",(done)=>{
        request(app)
            .delete("/users/me/token")
            .set("x-auth",dummyUsers[0].tokens[0].token)
            .expect(200)
            .end(err=>{
                if(err)
                    return done(err);
                UserModel.findById(dummyUsers[0]._id).then(user=>{
                    expect(user.tokens.length).toBe(0);
                    done()
                }).catch(err=>done(err));
            });
    });
});