const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../db");

const router = express.Router();

router.post("/signup", async(req,res)=>{
	try{
		const{username, email, password} = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({
				message: "Username, email, and password are required"
			});
		}

		const existingUser = await pool.query(
			"SELECT id FROM users WHERE email = $1 OR username = $2",
			[email, username]
		);

		if (existingUser.rows.length > 0){
			return res.status(400).json({
				message: "User already exists"
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await pool.query(
			`INSERT INTO users
			(username,email,password_hash)
			VALUES ($1,$2,$3)
			RETURNING id,username,email`,
			[username,email,hashedPassword]
		);

		res.status(201).json({
			success: true,
			user: user.rows[0]
		});
	} catch (error){
		console.error(error);
		res.status(500).json({
			message: "Server error"
		});
	}
});


router.post("/login",async(req,res)=>{
	try{
		const {email, password} = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Email and password are required"
			});
		}

		const user = await pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email]
		);

		if(user.rows.length === 0){
			return res.status(400).json({
				message: "Invalid credentials"
			});
		}

		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].password_hash
		);

		if(!validPassword){
			return res.status(400).json({
				message: "Invalid credentials"
			});
		}

		const token = jwt.sign(
			{
				id: user.rows[0].id
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "7d"
			}
		);

		res.json({
			success: true,
			token,
			user: {
				id: user.rows[0].id,
				username: user.rows[0].username,
				email: user.rows[0].email
			}
		});

	} catch (error){
		console.error(error);
		res.status(500).json({
			message: "Server error"
		});
	}
});

module.exports = router;
