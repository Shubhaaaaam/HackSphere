import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [language, setLanguage] = useState("python");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/questions")
      .then(response => setQuestions(response.data))
      .catch(error => console.error("Error fetching questions:", error));
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/submit", { code, language });
      alert(response.data.message);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit code");
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch("http://localhost:5000/curr", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update question index");
      }

      const newIndex = await response.json();
      setCurrentIndex(newIndex);
      setCode("");
    } catch (error) {
      console.error("Error updating current question:", error);
    }
  };


  const getDifficulty = (index) => {
    if (index < 5) return "Easy";
    if (index < 10) return "Medium";
    return "Hard";
  };
  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", loginData);
      alert(response.data.message);
      setShowLogin(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to log in");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "0px", backgroundColor: "#1e1e1e", color: "#fff", minHeight: "100vh", width: "100vw", fontFamily: "Arial, sans-serif", overflowX: "hidden" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 1px", backgroundColor: "#333", color: "white", width: "100%", borderBottom: "2px solid #444", boxSizing: "border-box" }}>
        <div>
          {["HackSphere", "help", "support", "about", "contact"].map((item) => (
            <a key={item} href={`http://127.0.0.1:5000/${item}`} style={{ color: "white", margin: "10px", textDecoration: "none", fontSize: "16px", fontWeight: "bold" }}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </div>
        <div>
          {!isLoggedIn && (
            <button
              onClick={() => setShowLogin(true)}
              style={{ margin: "8px", padding: "5px 5px", cursor: "pointer", color: "white", textDecoration: "none", backgroundColor: "#007bff", borderRadius: "5px", fontSize: "14px" }}>
              Login
            </button>
          )}
        </div>
      </nav>

      {showLogin && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "10px", width: "300px", textAlign: "center", boxShadow: "0px 0px 10px #000" }}>
            <h3>Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "none", backgroundColor: "#444", color: "white" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "none", backgroundColor: "#444", color: "white" }}
            />
            <button onClick={handleLoginSubmit} style={{ padding: "10px", width: "100%", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "10px" }}>
              Submit
            </button>
            <button onClick={() => setShowLogin(false)} style={{ padding: "5px", width: "100%", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
      <h3 style={{ marginBottom: "1px" }}>Problem Solving Questions</h3>
      <div>
        <button onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))} style={{ margin: "4px", padding: "5px 5px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "none", borderRadius: "5px", fontSize: "14px" }}>Previous</button>
        <button onClick={handleNext} style={{ margin: "4px", padding: "5px 5px", cursor: "pointer", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", fontSize: "14px" }}>Next</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", width: "85%", maxWidth: "1100px", height: "480px", margin: "auto", gap: "15px", border: "1px solid #444", padding: "15px", borderRadius: "10px", backgroundColor: "#252526", boxSizing: "border-box" }}>
        <div style={{ flex: 1, textAlign: "left", overflowY: "auto" }}>
          <h2>Problem Number : {currentIndex + 1} ({getDifficulty(currentIndex)})</h2>
          {questions.length > 0 && (
            <p style={{ textAlign: "justify", padding: "5px", fontSize: "16px", lineHeight: "1.5", whiteSpace: "pre-line" }}>
              {questions[currentIndex]}
            </p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <select onChange={(e) => setLanguage(e.target.value)} value={language} style={{ marginBottom: "5px", padding: "8px", fontSize: "14px", borderRadius: "5px", backgroundColor: "#333", color: "white", border: "1px solid #555" }}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
          <div style={{ border: "2px solid #444", borderRadius: "8px", overflow: "hidden", padding: "5px", backgroundColor: "#1e1e1e" }}>
            <Editor
              height="340px"
              width="100%"
              language={language}
              value={code}
              onChange={(newCode) => setCode(newCode || "")}
              theme="vs-dark"
            />
          </div>
          <button onClick={handleSubmit} style={{ marginTop: "10px", padding: "10px 18px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "5px", fontSize: "14px", fontWeight: "bold", width: "100%" }}>Submit</button>
        </div>
      </div>
    </div >
  );
}

export default App;
