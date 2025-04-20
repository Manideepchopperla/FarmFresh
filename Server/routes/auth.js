import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register

router.post("/register", async (req, res) => {
  try {
    const { name, role, emailId, password } = req.body;
    // Validation of the data
    if (!name || !emailId || !password) {
      return res.status(400).send("Please fill all the fields");
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    // Bcrypt Password
    const passwordHash = await bcrypt.hash(password, 10);
  

    // Create new user
    const user = new UserModel({
      name,
      role,
      emailId,
      password: passwordHash
    });

    let x = await user.save();


    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie with JWT token
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    });

    // Send response with user details
    res.status(201).send({
      user: {
        id: user._id,
        emailId: user.emailId,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send(`Error occurred: ${err.message}`);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { emailId, password } = req.body;

  try {
    // Find user
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie("jwtToken",token,{
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7 
  })

    res.json({
      user: {
        name: user.name,
        id: user._id,
        emailId: user.emailId,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.post("/logout",authenticateToken ,async(req,res)=>{
  try{
      res.clearCookie("jwtToken",{ httpOnly: true, secure: true, sameSite: "Strict" });
      res.send("User Logged Out Successfully")
  }catch(err){
      res.status(404).send("Error occured : "+err.message)
  }
})


router.post("/session",authenticateToken,async(req,res)=>{
   // Generate token
  const token = jwt.sign(
    { id: req.user.id, emailId:req.user.emailId, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.cookie("jwtToken",token,{
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 1000 * 60 * 60 * 24 * 7 
})

  res.json({
    user:{
      id:req.user.id,
      emailId:req.user.emailId,
      role:req.user.role
    },
    token: token
  });
  

})

export default router;
