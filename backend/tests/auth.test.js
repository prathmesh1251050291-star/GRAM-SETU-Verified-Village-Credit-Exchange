const request = require("supertest");
const app = require("../server");
const pool = require("../db");

beforeAll(async () =>{
	await pool.query(`
	CREATE TABLE IF NOT EXISTS users (
		id BIGSERIAL PRIMARY KEY,
		username VARCHAR(50) NOT NULL UNIQUE,
		email VARCHAR(255) NOT NULL UNIQUE,
		password_hash VARCHAR(255) NOT NULL,
		created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`);
});

afterEach(async () => {
	await pool.query("DELETE FROM users");
});

afterAll(async () =>{
	await pool.end();
});

describe("Auth API", () =>{
	test("Signup creates user", async () =>{
		const res = await request(app)
		.post("/api/auth/signup")
		.send({
			username: "testuser",
			email: "test@example.com",
			password: "123456"
		});
		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.user.email).toBe("test@example.com");
	});

	test("Prevents duplicate signup", async () =>{
		await request(app).post("/api/auth/signup").send({
			username: "a",
			email: "dup@example.com",
			password: "123"
		});

		const res = await request(app)
		.post("/api/auth/signup")
		.send({
			username:  "b",
			email: "dup@example.com",
			password: "123"
		});
		expect(res.statusCode).toBe(400);
	});

	test("Login return token", async() =>{
		await request(app).post("/api/auth/signup").send({
			username: "loginuser",
			email: "login@example.com",
			password: "123456"
		});

	const res = await request(app)
		.post("/api/auth/login")
		.send({
			email: "login@example.com",
			password: "123456"
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.token).toBeDefined();
	});

	test("Reject wrong password", async () => {
		await request(app).post("/api/auth/signup").send({
			username: "wrongpass",
			email: "wrong@example.com",
			password: "123456"
		});

		const res = await request(app)
		.post("/api/auth/login")
		.send({
			email: "wrong@example.com",
			password: "badpass"
		});
		expect(res.statusCode).toBe(400);
	});
});
