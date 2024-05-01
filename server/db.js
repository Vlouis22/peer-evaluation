const {MongoClient} = require("mongodb")
const connectionString = "mongodb://localhost:27017"
const client = new MongoClient(connectionString);

let conn;
try{
    conn = await client.connect();
}catch(e){
    console.log(e);
}
let db = conn.db("peerAssessment");
export default db;