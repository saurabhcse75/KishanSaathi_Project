const bcrypt = require("bcrypt");
const {createUser,findUserByMobile}=require("../models/userModel");
const generateToken = require ("../utils/generateToken");


//Registration Logic
exports.register =async(req,res)=>{
    const {name,mobile,password,role}=req.body;

    if(!name|| !mobile || !password || !role){
        return res.status(400).json({message:"All Fields are Required"});
    }

    // ✅ VALIDATE ROLE Someone Send Wrong Using Postman
    if (!['farmer', 'buyer'].includes(role)) {
        return res.status(400).json({message:"Invalid role. Must be 'farmer' or 'buyer'"});
    }

     findUserByMobile(mobile, async (err, results) => {
        if (err) {
            console.error("DB Error during registration:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword=await bcrypt.hash(password,10);  //salt rounds 10 is a common choice for bcrypt, balancing security and performance.

         createUser({ name, mobile, password: hashedPassword, role }, (err,result) => {

            if (err) return res.status(500).json(err);

            const newUser = {
                id: result.insertId,
                name,
                role
            };

            const token = generateToken(newUser);

            res.status(201).json({
                token,
                user: newUser
            });

        });
    });
};




//----------**Login Logic**----------

exports.login = (req, res) => {
    const { mobile, password } = req.body;

    findUserByMobile(mobile, async (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });
    });
};