let request = require("supertest");
let expect = require("expect");
let {app} = require("./../server");
let {TodoModel} = require("./../model/TodoListModel");

beforeEach(done=>{
    TodoModel.deleteOne({}).then(()=>done());
})
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
                TodoModel.find().then(results=>{
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
                    expect(results.length).toBe(0);
                    done();
                }).catch(e=>{done(e);})
            });
    })
})