# internship-recommendation-Server
InternshipHub: AI-Powered Internship Recommender (Server)

This is the server-side repository for InternshipHub. You can find the client-side code here: [InternshipHub Client](https://github.com/Pritam7Chakraborty/internship-recommendation-Client).

This is the backend repository for InternshipHub, a robust MERN stack API that powers the AI-driven internship recommendation engine. It's built with Node.js, Express.js, and MongoDB, and integrates with the Google Gemini API to provide intelligent recommendations.

🌟 Features
Secure Authentication: User registration and login with JWT-based authentication.

Rich User Profiles: Stores detailed user data, including education, skills, and interests.

AI Integration: Uses the Gemini API to analyze user profiles and provide personalized internship recommendations with justifications.

Fallback Logic: Automatically switches to a rule-based recommendation system if the AI API is unavailable, ensuring the application remains functional.

Admin Panel Endpoints: Secure CRUD operations for managing the internship database (requires admin login).

🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

MongoDB Atlas account (or a local MongoDB instance)

Google AI Studio API key for Gemini 1.5 Flash

Installation
Clone this repository to your local machine.

Bash

git clone https://github.com/Pritam7Chakraborty/internship-recommendation-Server.git
cd internship-recommendation-Server
Install the required dependencies.

Bash

npm install
Create a .env file in the root directory and add your environment variables.

Code snippet

PORT=5000
MONGO_URI=<Your MongoDB Atlas connection URI>
JWT_SECRET=<A strong, random string>
GEMINI_API_KEY=<Your Google Gemini API key>
Run the database seeder to populate your MongoDB with initial internship data.

Bash

npm run seed
Start the server.

Bash

npm start
The API will be running on http://localhost:5000. Now you can run the frontend client to connect to it.