from flask import Flask, jsonify, request,render_template
from flask_cors import CORS
import psycopg2
import subprocess
import tempfile
import os
import requests

app = Flask(__name__)
CORS(app)

questions = []
answers = []
input=[]
output=[]
curr_question=0

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if email == "shubham@400" and password == "123":
        return jsonify({"message": "Login Successful!"})
    else:
        return jsonify({"message": "Invalid Credentials"}), 401

@app.route('/curr', methods=['GET'])
def curr():
    global curr_question
    curr_question += 1
    print("Updated question index:", curr_question)
    return jsonify(curr_question)

@app.route('/questions', methods=['GET'])
def get_questions():
    return jsonify(questions)

@app.route('/submit', methods=['POST'])
def submit_answer():
    data = request.json
    code = data.get("code", "")
    language = data.get("language", "").lower()
    inp=input[curr_question]
    global output
    out=output[curr_question]
    if language == "python":
        try:
            correct=1
            j=-1
            for i in inp:
                j+=1
                user_input=str(i)+"\n"
                process = subprocess.run(
                    ["python", "-c", code],
                    input=user_input,
                    text=True,
                    capture_output=True
                )
                user_output = process.stdout.strip()
                print(user_output,out[j])
                if out[j]!=user_output:
                    correct=0
                error = process.stderr.strip() if process.stderr else None
                print("Process Error:", error)
            if correct==1:
                TOKEN = "TELEGRAM_BOT_TOKEN"
                chat_id = "TELEGRAM_CHAT_ID"
                message = str("Correct Answer")
                url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id}&text={message}"
                requests.get(url).json()

            return jsonify({
                "message": "Answer received!",
                "answer": output if output else "No output from script",
            })

        except subprocess.CalledProcessError as e:
            return jsonify({"error": str(e)})

    elif language == "javascript":
        subprocess.run(["node", "-e", code], text=True)

    elif language == "bash":
        subprocess.run(["bash", "-c", code], text=True)

    elif language == "c":
        with tempfile.NamedTemporaryFile(suffix=".c", delete=False) as temp_c:
            temp_c.write(code.encode())
            temp_c_path = temp_c.name

        exe_path = temp_c_path.replace(".c", "")
        subprocess.run(["gcc", temp_c_path, "-o", exe_path])
        subprocess.run([exe_path])
        os.remove(temp_c_path)
        os.remove(exe_path)

    elif language == "cpp":
        with tempfile.NamedTemporaryFile(suffix=".cpp", delete=False) as temp_cpp:
            temp_cpp.write(code.encode())
            temp_cpp_path = temp_cpp.name

        exe_path = temp_cpp_path.replace(".cpp", "")
        subprocess.run(["g++", temp_cpp_path, "-o", exe_path])
        subprocess.run([exe_path])
        os.remove(temp_cpp_path)
        os.remove(exe_path)

    elif language == "java":
        with tempfile.NamedTemporaryFile(suffix=".java", delete=False) as temp_java:
            temp_java.write(code.encode())
            temp_java_path = temp_java.name

        class_name = os.path.basename(temp_java_path).replace(".java", "")
        subprocess.run(["javac", temp_java_path])
        subprocess.run(["java", class_name])
        os.remove(temp_java_path)

    else:
        print(f"Unsupported language: {language}")

@app.route('/CodeHere', methods=['GET'])
def CodeHere():
    return jsonify({"message": "Welcome to the Home Page"})

@app.route('/help', methods=['GET'])
def help_page():
    return jsonify({"message": "This is the Help Page"})

@app.route('/support', methods=['GET'])
def support():
    return jsonify({"message": "Support Page - How can we assist you?"})

@app.route('/about', methods=['GET'])
def about():
    return render_template("homepage.html")

@app.route('/contact', methods=['GET'])
def contact():
    return jsonify({"message": "Contact Page - Get in touch with us"})

conn = psycopg2.connect(
            dbname='competitive_questions', 
            user='DB_USER', 
            password='DB_PASSWORD', 
            host='DB_HOST', 
            port='DB_PORT'
        )
cur = conn.cursor()
cur.execute("SELECT title, description, input_format, output_format, sample_input, sample_output FROM questions;")
questio = cur.fetchall()
questions = []
for question in questio:
    title, description, input_format, output_format, sample_input, sample_output = question
    sample_input = sample_input.replace("\\n", "\n") if sample_input else ""
    sample_output = sample_output.replace("\\n", "\n") if sample_output else ""
    formatted_question = f"""{title}
Problem Statement:
{description}

Input Format:
{input_format}

Output Format:
{output_format}

Sample Input:
{sample_input}

Sample Output:
{sample_output}
"""
    questions.append(formatted_question)

for question in questio:
    sample_input = question[4]
    sample_output = question[5]
    sample_input = list(filter(None, sample_input.replace("\\n", "\n").split("\n")))
    sample_output = list(filter(None, sample_output.replace("\\n", "\n").split("\n")))
    input.append(sample_input)
    output.append(sample_output)

cur = conn.cursor()
conn.close()
if __name__ == '__main__':
    app.run(debug=True)
