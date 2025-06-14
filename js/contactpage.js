// only 3 questions now
const questions = [
    { question: "What's your name?",                field: "name",  type: "text"     },
    { question: "What's your email address?",       field: "email", type: "email"    },
    { question: "What do you need help with?",      field: "help",  type: "checkbox" }
  ];
  
  const helpOptions = [
    "Computer",
    "Wi-Fi",
    "Other"
  ];
  
  let currentQuestion = 0;
  const userAnswer = {};
  
  document.addEventListener("DOMContentLoaded", showQuestion);
  
  function showQuestion() {
    const q = questions[currentQuestion];
    document.querySelector('#chat-area').innerHTML += `
      <div class="flex justify-start">
        <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    p-3 rounded-2xl rounded-bl-none animate-slide-up">
          ${q.question}
        </div>
      </div>
    `;
  
    let html = '';
    if (q.type === "text" || q.type === "email") {
      html = `
        <div class="flex gap-2">
          <input type="${q.type}" id="answer-input"
                 class="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                 placeholder="${q.question}" />
          <button onclick="nextQuestion()"
                  class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
            Send
          </button>
        </div>
      `;
    }
    else { // checkbox
      html = `<div class="flex flex-col items-start space-y-3">`;
      helpOptions.forEach(opt => {
        html += `
          <label class="flex items-center space-x-3">
            <input type="checkbox" name="help-option" value="${opt}"
                   class="accent-primary w-5 h-5">
            <span class="dark:text-gray-300">${opt}</span>
          </label>`;
      });
      html += `</div>
        <button onclick="nextQuestion()"
                class="mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
          Send
        </button>
      `;
    }
  
    document.getElementById("input-area").innerHTML = html;
    setTimeout(() => attachHandlers(q.type), 50);
  }
  
  function attachHandlers(type) {
    if (type === "text" || type === "email") {
      const inp = document.getElementById("answer-input");
      inp.focus();
      inp.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          nextQuestion();
        }
      });
    }
  }
  
  function nextQuestion() {
    const q = questions[currentQuestion];
    let val;
  
    if (q.type === "text" || q.type === "email") {
      val = document.getElementById("answer-input").value.trim();
      if (!val) {
        return alert("Please answer before continuing.");
      }
      if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return alert("Enter a valid email.");
      }
    } else { // checkbox
      const checked = Array.from(
        document.querySelectorAll('input[name="help-option"]:checked')
      ).map(cb => cb.value);
      if (checked.length === 0) {
        return alert("Select at least one option.");
      }
      if (checked.includes("Other")) {
        const other = prompt("Please specify:");
        if (other) checked.push(`Other: ${other}`);
      }
      val = checked.join(", ");
    }
  
    userAnswer[q.field] = val;
  
    // render answer bubble
    document.querySelector('#chat-area').innerHTML += `
      <div class="flex justify-end">
        <div class="max-w-[70%] bg-primary text-white p-3 rounded-2xl rounded-br-none animate-slide-up">
          ${val}
        </div>
      </div>
    `;
  
    currentQuestion++;
    document.getElementById("input-area").innerHTML = "";
  
    if (currentQuestion < questions.length) {
      setTimeout(showQuestion, 300);
    } else {
      setTimeout(showReviewScreen, 300);
    }
  }
  
  function showReviewScreen() {
    const chat = document.getElementById("chat-area");
    chat.innerHTML += `
      <div class="flex justify-start mb-4">
        <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    p-3 rounded-2xl rounded-bl-none animate-slide-up">
          Here's your data. Confirm to submit:
        </div>
      </div>
    `;
    let review = '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded">';
    const payload = {
      data: {
        name:  userAnswer.name,
        email: userAnswer.email,
        help:  userAnswer.help
      },
      viewLink: "https://dashboard.formspark.io/forms/"
    };
    review += JSON.stringify(payload, null, 2);
    review += '</pre>';
    review += `
      <button onclick="submitData()"
              class="mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
        Confirm & Submit
      </button>
    `;
    document.getElementById("input-area").innerHTML = review;
  }
  
  async function submitData() {
    const endpoint = "https://submit-form.com/LuDF1TTat";
    const body = {
      data: {
        name:  userAnswer.name,
        email: userAnswer.email,
        help:  userAnswer.help
      }
    };
  
    try {
      const res = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body)
      });
      const result = await res.json();
      document.getElementById("input-area").innerHTML = `
        <pre class="bg-green-50 dark:bg-green-900 p-4 rounded">
  ${JSON.stringify(result, null, 2)}
        </pre>
        <p class="mt-4">View all responses at:
           <a href="https://dashboard.formspark.io/forms/" class="underline text-primary">
             Formspark Dashboard
           </a>
        </p>
      `;
    } catch (err) {
      alert("Submission failed: " + err.message);
    }
  }
  