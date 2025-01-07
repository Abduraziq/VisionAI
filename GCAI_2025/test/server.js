import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config(); // Load environment variables from .env

const app = express();
const port = 3000;

// Zoom OAuth URLs
const authURL = "https://zoom.us/oauth/authorize";
const tokenURL = "https://zoom.us/oauth/token";

// Set Content Security Policy for your server
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' http://localhost:3000;"); 
    next();
});

// Serve the root URL with a simple message
app.get("/", (req, res) => {
    res.send("Welcome to the Zoom OAuth Demo!");
});

// Step 1: Redirect to Zoom Authorization Page
app.get("/login", async (req, res) => {
    // Construct the OAuth URL
    const authURL = `${authURL}?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`;
    
    try {
        // Dynamically import the 'open' module and open the browser
        const open = await import("open"); // Dynamically import the 'open' module
        open.default(authURL); // Use the default export from the 'open' module
    } catch (err) {
        console.error("Error opening browser:", err.message);
    }
    
    res.send("Redirecting to Zoom for authorization...");
});

// Step 2: Handle the Authorization Code Callback
app.get("/callback", async (req, res) => {
    const authorizationCode = req.query.code;

    if (!authorizationCode) {
        return res.status(400).send("Authorization code not found.");
    }

    try {
        // Step 3: Exchange Authorization Code for Access Token
        const response = await axios.post(
            tokenURL,
            new URLSearchParams({
                grant_type: "authorization_code",
                code: authorizationCode,
                redirect_uri: process.env.REDIRECT_URI,
            }),
            {
                auth: {
                    username: process.env.CLIENT_ID,
                    password: process.env.CLIENT_SECRET,
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const accessToken = response.data.access_token;
        res.send(`Access Token: ${accessToken}`);
        console.log("Access Token:", accessToken);

        // Step 4: Use the Access Token to Fetch User Info (Optional)
        fetchUserInfo(accessToken);
    } catch (error) {
        console.error("Error getting access token:", error.response?.data || error.message);
        res.status(500).send("Error getting access token.");
    }
});

// Step 5: Use the Access Token to Fetch User Info (Optional)
async function fetchUserInfo(accessToken) {
    try {
        const response = await axios.get("https://api.zoom.us/v2/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        console.log("User Info:", response.data);
    } catch (error) {
        console.error("Error fetching user info:", error.response?.data || error.message);
    }
}

// Start the Express server
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
