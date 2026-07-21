const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const authRoutes = require("./routes/auth");
const syncRoutes = require("./routes/sync");

const app = express();

const frontendDir = path.join(__dirname, "..", "frontend");

app.use(cors());

app.use(express.json());

app.use(express.static(frontendDir));

app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoutes);

app.get("/", (req, res) =>{
	res.sendFile(
		path.join(frontendDir, "public", "index.html")
	);
});

app.get("/home", (req, res) => {
    res.sendFile(
        path.join(frontendDir, "public", "home.html")
    );
});

app.get("/login", (req, res) => {
    res.sendFile(
        path.join(frontendDir, "public", "login.html")
    );
});

app.get("/signup", (req, res) => {
    res.sendFile(
        path.join(frontendDir, "public", "signup.html")
    );
});

app.get("/dashboard", (req, res) => {
    res.sendFile(
        path.join(frontendDir, "public", "dashboard.html")
    );
});

app.get("/contact", (req, res) => {
    res.sendFile(
        path.join(frontendDir, "public", "contact.html")
    );
});

app.get("/about", (req, res) => {
    res.sendFile(
        path.join(frontendDir, "public", "about.html")
    );
});

app.use((req, res) =>{
	res.status(404).sendFile(
		path.join(frontendDir, "public", "404.html")
	);
});

if (require.main === module) {
	app.listen(process.env.PORT, ()=>{
		console.log(`Server running on port ${process.env.PORT}`);
	});
}

module.exports = app;
