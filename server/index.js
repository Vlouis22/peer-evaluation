const express = require("express");
const mongoose = require("mongoose");
const {MongoClient} = require("mongodb")
const PORT = 3001;
const connectionString = "mongodb://localhost:27017"
const client = new MongoClient(connectionString);

const rubric_data = [{
    categoryName: 'Quality of Work' ,
    categoryDescription: 'Consider the degree to which the student team member provides work that is accurate and complete.',
    scaleDescription:[
        'Produces unacceptable work, fails to meet minimum group or project requirements.',
        'Occasionally produces work that meets minimum group or project requirements.',
        'Meets minimum group or project requirements.',
        'Regularly produces work that meets minimum requirements and sometimes exceeds project or group requirements.',
        'Produces work that consistently exceeds established group or project requirements.'
    ]
},{
    categoryName: 'Timeliness of Work',
    categoryDescription: 'Consider the student team member\'s timeliness of work.',
    scaleDescription:[
        'Fails to meet deadlines set by group.',
        'Occasionally misses deadlines set by group.',
        'Regularly meets deadlines set by group.',
        'Consistently meets deadlines set by group and occasionally completes work ahead of schedule.',
        'Consistently completes work ahead of schedule.'
    ]
},{
    categoryName: 'Task Support' ,
    categoryDescription: 'Consider the amount of task support the student team member gives to other team members.',
    scaleDescription:[
        'Gives no task support to other members.',
        'Sometimes gives task support to other members.',
        'Occasionally provides task support to other group members.',
        'Consistently provides task support to other group members.',
        'Consistently gives more task support than expected.'
    ]
},{
    categoryName: 'Interaction' ,
    categoryDescription: 'Consider how the student team member relates and communicates to other team members.',
    scaleDescription:[
        'Behavior is detrimental to group.',
        'Behavior is inconsistent and occasionally distracts group meetings.',
        'Regularly projects appropriate team behavior including: listening to others, and allowing his/her ideas to be criticized.',
        'Consistently demonstrates appropriate team behavior.',
        'Consistently demonstrates exemplary team behavior.'
    ]
},{
    categoryName: 'Attendance' ,
    categoryDescription: 'Consider the student team member\'s attendance at the group meetings.  (This includes in class meetings.)',
    scaleDescription:[
        'Failed to attend the group meetings.',
        'Attended 1%-32% of the group meetings.',
        'Attended 33%-65% of the group meetings.',
        'Attended 66%-99% of the group meetings.',
        'Attended 100% of the group meetings.'
    ]
},{
    categoryName: 'Responsibility' ,
    categoryDescription: 'Consider the ability of the student team member to carry out a chosen or assigned task, the degree to which the student can be relied upon to complete a task.',
    scaleDescription:[
        'Is unwilling to carry out assigned tasks.',
        'Sometimes carries out assigned tasks but never volunteers to do a task.',
        'Carries out assigned tasks but never volunteers to do a task.',
        'Consistently carries out assigned tasks and occasionally volunteers for other tasks.',
        'Consistently carries out assigned tasks and always volunteers for other tasks.'
    ]
},{
    categoryName: 'Involvement' ,
    categoryDescription: 'Consider the extent to which the student team member participates in the exchange of information (does outside research, brings outside knowledge to group).',
    scaleDescription:[
        'Fails to participate in group discussions and fails to share relevant material.',
        'Sometimes participates in group discussions and rarely contributes relevant material for the project.',
        'Takes part in group discussions and shares relevant information.',
        'Regularly participates in group discussion and sometimes exceeds expectations.',
        'Consistently exceeds group expectations for participation and consistently contributes relevant material to project.'
    ]
},{
    categoryName: 'Leadership' ,
    categoryDescription: 'Consider how the team member engages in leadership activities.',
    scaleDescription:[
        'Does not display leadership skills.',
        'Displays minimal leadership skills in team.',
        'Occasionally assumes leadership role.',
        'Regularly displays good leadership skills.',
        'Consistently demonstrates exemplary leadership skills.'
    ]
},{
    categoryName: 'Overall Performance Rating' ,
    categoryDescription: 'Consider the overall performance of the student team member while in the group.',
    scaleDescription:[
        'Performance significantly fails to meet group requirements.',
        'Performance fails to meet some group requirements.',
        'Performance meets all group requirements.',
        'Performance meets all group requirements consistently and sometimes exceeds requirements.',
        'Performance consistently exceeds all group requirements.'
    ]
}];

const group = ['student 1', 'student 2', 'student 3', 'student 4'];

const studentSchema = mongoose.Schema({
    sid: Number,
    lastName: String,
    firstName: String,
    email: String
});

const Student = mongoose.model("Student", studentSchema);

// async function db_connect(){
//     let conn;
//     try{
//         conn = await MongoClient.connect(db_connect);
//     }catch(e){
//         console.log(e);
//     }
//     let db = conn.db("peerAssessment");
//     return db.collection('student');
// }

// const db = await db_connect();





const app = express();

app.use(express.urlencoded({extended: false}));

app.get("/peer", (req,res) => {
    res.json({rubric: rubric_data, group: group});
});

app.post('/peer', (req,res) => {
    console.log(req.body);
    res.send('<p>Thank you!</p>');

});

app.post('/processStudent', async (req, res)=>{
    try{
        let conn = await client.connect()
        db = conn.db("peerAssessment")
            let collection = await db.collection("student");
            let newDocument = req.body;
            let results = await collection.findOne({email: req.body.email});
            if(results){
                res.send("Not Added: Student exists!")
            }
            let result = await collection.insertOne(newDocument);
            res.send(result).status(204);
    }
    catch(error){
        res.send("Error: " + error)
    }
})

app.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`);
})