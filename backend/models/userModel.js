const db=require("../config/db");

const createUser = (userData,callback)=>{
    const {name,mobile,password,role}=userData;
    const query="INSERT INTO users (name, mobile, password, role) VALUES (?, ?, ?, ?)";
    db.query(query,[name,mobile,password,role],callback);
};

const findUserByMobile = (mobile, callback) => {
    const query = "SELECT * FROM users WHERE mobile = ?";
    db.query(query, [mobile], callback);
};

module.exports ={
    createUser,
    findUserByMobile
}