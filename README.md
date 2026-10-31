<div align="center">

# Canteen Feedback Management System

### Making Campus Dining Better, One Feedback at a Time.

A web-based platform designed to simplify student feedback collection, improve canteen service monitoring, and help administrators make informed decisions through meaningful data and visual analytics.

<br/>

![Project Status](https://img.shields.io/badge/Project-Academic%20Project-0B8F87?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

<br/>

**Student-Friendly • Data-Driven • Responsive • Practical**

**Web Link:** [Visit CanteenIQ]( https://canteen-feedback-management-system.vercel.app/)

</div>

---

## Overview

Food quality, hygiene, service, and overall dining experience play an important role in campus life. However, collecting student opinions manually and turning them into actionable insights can be challenging.

The **Canteen Feedback Management System** addresses this problem by providing a centralized digital platform where students can submit feedback conveniently, while administrators can monitor responses, explore trends, and evaluate the overall canteen experience.

With a QR-based feedback workflow, enrollment number validation, secure administrator authentication, and an analytics dashboard, the system helps make feedback collection more accessible and its results easier to understand.

The goal is simple: **make it easier for students to share their experiences and easier for administrators to understand what needs improvement.**

## Key Features

### Student Feedback System

- **QR-Based Access:** Students can access the feedback interface through a QR code, making the process convenient on mobile devices.
- **Enrollment Validation:** Validates student enrollment numbers using an 11-digit format before accepting feedback.
- **Simple Feedback Experience:** Provides a straightforward interface for submitting canteen-related feedback.
- **Responsive Design:** Offers a user-friendly experience across desktops, tablets, and mobile devices.

### Admin Dashboard

- **Secure Authentication:** JWT-based authentication for protected administrator access.
- **Feedback Overview:** View collected feedback and monitor the overall response data.
- **Interactive Analytics:** Explore feedback insights through charts and visual representations powered by Recharts.
- **Data-Driven Decisions:** Identify recurring concerns and areas that may require attention.
- **Excel Export:** Export feedback data for reporting, record-keeping, and further analysis.

### User Interface

- **Modern Design:** A clean interface built with React and Tailwind CSS.
- **Teal-Blue Theme:** A consistent visual identity that keeps the application professional and easy to navigate.
- **Component-Based Architecture:** Reusable React components help maintain a structured and manageable frontend.
- **API-Driven Workflow:** Communicates with the backend to validate requests, authenticate administrators, and manage feedback data.

---

## Technology Stack

The application uses a modern JavaScript-based stack to support an interactive frontend, a dedicated backend API, and persistent database storage.

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Frontend development and build tooling |
| Tailwind CSS | Responsive styling and UI design |
| Recharts | Interactive charts and data visualization |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API and server-side request handling |
| MongoDB Atlas | Cloud-hosted database |
| JSON Web Tokens (JWT) | Authentication and protected routes |
| JavaScript | Application logic and API integration |
| Excel Export | Downloading feedback data for analysis |
| QR Code | Quick access to the student feedback interface |

---

## How It Works

The system follows a straightforward workflow that connects students, the backend API, the database, and the administration dashboard.

```text
                    STUDENT
                       |
                       v
               Scan Feedback QR
                       |
                       v
              Open Feedback Form
                       |
                       v
             Validate Enrollment No.
                       |
                       v
                Submit Feedback
                       |
                       v
                Backend API
                       |
                       v
               MongoDB Database
                       |
                       v
             Feedback Stored Securely
                       |
                       v
                 ADMIN LOGIN
                       |
                       v
              Admin Dashboard
                       |
                       v
            Analytics & Feedback Review
                       |
                       v
                Excel Export
```

### Workflow Explanation

1. **Access:** Students open the feedback page using the available QR code.
2. **Validation:** The application validates the enrollment number according to the required 11-digit format.
3. **Submission:** Students complete and submit the feedback form.
4. **Processing:** The backend handles the request and stores the feedback in MongoDB.
5. **Administration:** Authorized administrators sign in to access the dashboard.
6. **Analysis:** Feedback records are presented through visual analytics and dashboard views.
7. **Reporting:** Administrators can export available feedback data to Excel for additional analysis.

*Note: The workflow represents the intended application flow. Actual validation rules, data fields, and submission restrictions depend on the implemented backend logic.*

---

## Project Architecture

The application follows a client-server architecture with a separate frontend, backend API, and database.

```text
+-----------------------------------+
|          Student / Admin          |
+-----------------------------------+
                  |
                  v
+-----------------------------------+
|         React + Vite Frontend     |
|                                   |
|  Student Feedback Form            |
|  Admin Dashboard                  |
|  Charts & Data Export             |
+-----------------------------------+
                  |
                  | HTTP / REST API
                  v
+-----------------------------------+
|       Node.js + Express API       |
|                                   |
|  Request Validation               |
|  Authentication                  |
|  Feedback Operations              |
|  Protected Admin Endpoints        |
+-----------------------------------+
                  |
                  | Database Operations
                  v
+-----------------------------------+
|           MongoDB Atlas           |
|                                   |
|  Feedback Records                 |
|  Application Data                 |
|  Relevant User / Admin Records    |
+-----------------------------------+
```

This separation helps keep the user interface, server-side logic, and data storage independently organized, making the application easier to maintain and extend.

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed or available:

- [Node.js](https://nodejs.org/) — use a version compatible with the project's dependencies.
- npm — included with Node.js.
- [Git](https://git-scm.com/) — for cloning and version control.
- A [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) account or another compatible MongoDB deployment.
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/).

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/Meet-Parsana1/Canteen-Feedback-Management-System
```

Navigate into the cloned repository:

```bash
cd Canteen-Feedback-Management-System
```

Replace the placeholders with your actual GitHub repository URL and project directory name.

### 2. Install Dependencies

Install the frontend and backend dependencies separately, according to your repository structure.

For example, if the frontend and backend are in separate directories:

```bash
cd frontend
npm install
```

Then open another terminal or return to the project root and navigate to the backend:

```bash
cd backend
npm install
```

**Important:** Replace `frontend` and `backend` with your actual directory names. If your project uses a root-level workspace or a different folder structure, follow its existing `package.json` configuration instead.

### 3. Configure Environment Variables

Create the necessary `.env` files in the appropriate application directories.

A typical backend environment configuration may look like this:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

If your frontend communicates with a separately hosted backend, it may also require an API base URL.

For a Vite frontend, the variable might look like:

```env
VITE_API_URL=http://localhost:5000
```

**Configuration notes:**

- Use the exact environment variable names expected by your source code.
- Update the frontend API URL if your backend uses a different port or API path.
- Keep `.env` files out of version control.
- Never expose database credentials or JWT secrets in frontend environment variables.
- `VITE_` variables are included in the client-side bundle and must not contain secrets.
- Configure production environment variables through your hosting provider's settings.

The examples above are illustrative; your existing application configuration takes precedence.

### 4. Start the Backend

Navigate to the backend directory:

```bash
cd backend
```

Start the server using the script defined in its `package.json`.

For example, if the project defines a `dev` script:

```bash
npm run dev
```

If it uses a different script, run the corresponding command.

### 5. Start the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal. Open that URL in your browser.

Your frontend and backend should now be running locally, provided that the database connection and required environment variables are configured correctly.

---

## Project Structure

The exact directory structure may vary depending on your implementation. A typical organization for this technology stack could look like this:

```text
canteen-feedback-management-system/
|
+-- frontend/
|   |
|   +-- public/
|   |   +-- qr-assets/
|   |
|   +-- src/
|       |
|       +-- components/
|       +-- pages/
|       +-- layouts/
|       +-- services/
|       +-- hooks/
|       +-- assets/
|       +-- App.jsx
|       +-- main.jsx
|       +-- index.css
|       |
|       +-- package.json
|
+-- backend/
|   |
|   +-- config/
|   +-- controllers/
|   +-- middleware/
|   +-- models/
|   +-- routes/
|   +-- services/
|   +-- server.js
|   +-- package.json
|
+-- .gitignore
+-- README.md
```

**Note:** This is a suggested structure, not a verified representation of the actual repository. Keep the README aligned with your real folder names and files.

---

## Security Considerations

Security is an important part of any system that handles student feedback and administrative access.

The project incorporates JWT-based authentication and enrollment number validation. These features should be supported by appropriate server-side controls.

Recommended practices include:

- Keep database credentials, authentication secrets, and other private configuration in environment variables.
- Validate user input on the backend, even when the frontend already performs validation.
- Protect administrative API endpoints with authentication and authorization middleware.
- Use appropriate password hashing if administrator passwords are stored by the application.
- Configure CORS to allow only the intended frontend origins in production.
- Avoid returning unnecessary personal or administrative information in API responses.
- Use HTTPS in production.
- Avoid committing `.env` files, credentials, database dumps, or other sensitive data to GitHub.

Enrollment number format validation alone does not establish that a student is officially enrolled. If the system requires verified enrollment, it should check against an authorized data source.

---

## Potential Future Improvements

The current system provides a foundation for digital feedback collection and administrative analytics. The following improvements could make it even more useful over time:

- **Advanced Feedback Analytics:** Identify recurring complaints, satisfaction trends, and frequently mentioned issues.
- **Sentiment Analysis:** Explore NLP-based analysis of written feedback, where applicable.
- **Time-Based Reporting:** Compare feedback across days, weeks, months, or academic terms.
- **Category-Wise Analysis:** Analyze feedback relating to food quality, hygiene, pricing, staff behavior, and service speed, if these categories are supported.
- **Improved Access Controls:** Introduce role-based permissions if multiple administrative roles are needed.
- **Enhanced Reporting:** Provide configurable reports and additional export formats.
- **Accessibility Improvements:** Strengthen keyboard navigation, color contrast, and screen-reader support.
- **Multilingual Feedback:** Support students who prefer submitting feedback in different languages.
- **Duplicate Submission Controls:** Introduce suitable restrictions if the institution requires one submission per student or per feedback period.
- **Notifications:** Notify authorized administrators when feedback requires attention.

These are potential extensions rather than claims about features already implemented.

---

## Learning Outcomes

Developing this project provides practical experience in connecting frontend development, backend engineering, database operations, authentication, and data visualization.

Key areas of learning include:

- Building responsive interfaces using React and Tailwind CSS.
- Structuring frontend applications with Vite.
- Developing backend APIs using Node.js and Express.
- Integrating MongoDB Atlas with a full-stack web application.
- Implementing JWT-based authentication.
- Validating application input and handling API requests.
- Presenting data through interactive charts.
- Supporting feedback exports for reporting and analysis.
- Organizing a full-stack project for maintenance and deployment.

Beyond the technical implementation, the project demonstrates how a simple digital solution can help address a practical problem within an educational institution.

---

## Contributing

Contributions, suggestions, and constructive feedback are welcome.

If you would like to improve the project:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the relevant functionality.
5. Submit a pull request describing your improvements.

For larger changes, consider opening an issue first to discuss the proposed functionality.

---

## License

A license has not been specified in this README.

If you intend to make the project open source, consider adding an appropriate license file, such as the MIT License, after confirming that its terms suit your project.

Until a license is added, do not assume that others have permission to redistribute or reuse the project.

---

## Acknowledgment

This project was developed to explore how web technologies can be used to improve everyday processes within an educational institution.

It brings together frontend development, backend APIs, database management, authentication, and data visualization in one practical application.

The emphasis is not just on collecting feedback, but on presenting it in a way that can help people better understand student experiences and identify opportunities for improvement.

---

<div align="center">

### Better Feedback. Better Insights. Better Campus Dining.

**Canteen Feedback Management System**

Built with React, Node.js, Express, MongoDB, and a focus on practical problem-solving.

<br/>

**If you find this project interesting, consider giving the repository a star!**

</div>
