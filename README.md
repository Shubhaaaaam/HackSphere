HackSphere - An Interactive Coding Platform

---

## **Overview**
HackSphere is an interactive web-based coding platform designed to provide users with a seamless environment for solving programming challenges. The platform integrates a real-time code editor, problem statements, and an automated evaluation system to assess users' solutions. It also supports user authentication, multiple programming languages, and Telegram bot integration for real-time notifications.

---

## **Key Features**

1. **User Authentication**
   - Secure login system to track user progress.
   - Simple credential-based authentication.

2. **Problem Statement Interface**
   - Users can browse through a list of coding challenges.
   - Each problem has a detailed description, input format, and expected output.

3. **Code Editor**
   - Built-in **Monaco Editor** for syntax highlighting and easy editing.
   - Supports multiple languages: Python, JavaScript, Java, C, and C++.

4. **Code Execution & Evaluation**
   - Submissions are sent to a **Flask-based backend** for processing.
   - Automated test case validation ensures correct answers.
   - Runs in a secure, sandboxed environment to prevent malicious code execution.

5. **Question Navigation**
   - Users can switch between previous and next problems.
   - Questions are categorized into difficulty levels: Easy, Medium, and Hard.

6. **Real-Time Notifications**
   - Correct submissions trigger a Telegram bot message for user feedback.

7. **Database-Backed Question Management**
   - Stores problems, inputs, and expected outputs in a **PostgreSQL database**.

8. **Interactive UI**
   - Dark-themed UI with easy navigation.
   - Responsive layout for various screen sizes.

---

## **Workflow & Execution**

### **1. User Login & Authentication**
- Users enter their email and password.
- The system verifies credentials and grants access.

### **2. Loading & Displaying Questions**
- Problems are fetched from the PostgreSQL database and displayed dynamically.
- The interface shows the problem statement, input format, output format, and example cases.

### **3. Code Submission & Execution**
- Users write and submit code in the editor.
- The backend processes the code and tests it against predefined input cases.
- If the output matches expected results, the answer is marked as correct.

### **4. Question Progression & Difficulty Scaling**
- Users can move between problems using navigation buttons.
- Difficulty is determined based on the problem index.

### **5. Telegram Notification System**
- When a correct submission is detected, a message is sent via a Telegram bot to notify the user.

---

## **Technology Stack**

### **Frontend**
- **React.js with Vite** for fast rendering and efficient state management.
- **Monaco Editor** for an enhanced coding experience.
- **CSS & Styled Components** for a modern UI.

### **Backend**
- **Flask (Python)** for handling API requests and code execution.
- **FastAPI** (potential microservice integration for scalability).

### **Database**
- **PostgreSQL** to store questions, test cases, and user submissions.

### **Code Execution**
- Uses Python’s `subprocess` module to execute user-submitted code securely.
- Ensures isolation of execution environments to prevent security risks.

### **Authentication & Security**
- Basic credential-based authentication (future expansion to JWT tokens for better security).
- Cross-Origin Resource Sharing (CORS) enabled for API access control.

### **External Integrations**
- **Telegram API** for sending submission notifications.

---

## **Future Enhancements**
- **Leaderboard & User Profiles**: Track user progress and display rankings.
- **More Language Support**: Expand beyond Python, JavaScript, C, C++, and Java.
- **Code Optimization Feedback**: AI-powered suggestions for improving code quality.
- **Live Competitions**: Timed coding contests with real-time leaderboards.
- **Hints & Explanations**: Provide users with explanations for problem-solving techniques.
- **Docker-based Execution**: Isolate code execution using containerization.

---

## **Conclusion**
HackSphere is an all-in-one coding platform for learners and competitive programmers. With its seamless UI, real-time execution, and automated evaluation, it provides an engaging environment to hone problem-solving skills. Future enhancements will further improve its accessibility, usability, and competitiveness.

