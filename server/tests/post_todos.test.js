let request = require("supertest");
let expect = require("expect");
let {app} = require("./../server");
let {TodoModel} = require("./../model/TodoListModel");

let dummyTodos = [{
    noteName:"Hello There"
},{
    noteName:"Hi Everyone !"
},{
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