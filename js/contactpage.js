// 1) Questions array now includes your Message field
const questions = [
    { question: "What's your name?", field: "name",  type: "text"     },
    { question: "What's your email address?", field: "email", type: "email"    },
    { question: "What do you need help with? (Select all that apply)", field: "help",  type: "checkbox" },
    { question: "Message", field: "message", type: "textarea" }
  ];
  
  const helpOptions = [
    "Website Setup",
    "Troubleshooting",
    "Consultation",
    "General Tech Support",
    "Other"
  ];
  
  let currentQuestion = 0;
  const userAnswer = {};
  
  document.addEventListener("DOMContentLoaded", showQuestion);
  
  function showQuestion(isEditing = false) {
    const chatArea = document.getElementById("chat-area");
    const q        = questions[currentQuestion];
  
    // 2) Render question bubble
    const questionHTML = `
      <div class="flex justify-start" id="question-${currentQuestion}">
        <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    p-3 rounded-2xl rounded-bl-none animate-slide-up">
          ${q.question}
        </div>
      </div>
    `;
    chatArea.innerHTML += questionHTML;
    chatArea.scrollTop = chatArea.scrollHeight;
  
    // 3) Build appropriate input UI
    let html = "";
    if (q.type === "text" || q.type === "email") {
      html = `
        <div class="flex gap-2">
          <input type="${q.type}" id="answer-input"
                 class="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                 placeholder="${q.question}" />
          <button onclick="nextQuestion()"
                  class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
            Send
          </button>
        </div>
      `;
    }
    else if (q.type === "textarea") {
      html = `
        <div class="flex flex-col gap-2">
          <textarea id="answer-input" rows="4"
                    class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                    placeholder="Type your message…"></textarea>
          <button onclick="nextQuestion()"
                  class="self-end bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
            Send
          </button>
        </div>
      `;
    }
    else if (q.type === "checkbox") {
      html = `<div class="flex flex-col items-start space-y-3">`;
      helpOptions.forEach(opt => {
        html += `
          <label class="flex items-center space-x-3">
            <input type="checkbox" name="help-option" value="${opt}"
                   class="accent-primary dark:accent-primary w-5 h-5">
            <span class="text-gray-700 dark:text-gray-300">${opt}</span>
          </label>`;
      });
      html += `</div>
        <div id="other-text-container" class="hidden mt-4 w-full">
          <input type="text" id="other-text" placeholder="Please specify..."
                 class="w-full px-4 py-2 border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <button onclick="nextQuestion()"
                class="mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
          Send
        </button>
      `;
    }
  
    document.getElementById("input-area").innerHTML = html;
    setTimeout(() => attachInputHandlers(q), 50);
  }
  
  function attachInputHandlers(q) {
    if (q.type === "text" || q.type === "email" || q.type === "textarea") {
      const inp = document.getElementById("answer-input");
      inp.focus();
      inp.addEventListener("keypress", e => {
        if (e.key === "Enter" && q.type !== "textarea") {
          e.preventDefault();
          nextQuestion();
        }
      });
    }
    else if (q.type === "checkbox") {
      const otherCb   = document.querySelector('input[value="Other"]');
      const otherTxt  = document.getElementById("other-text");
      if (otherCb && otherTxt) {
        otherCb.addEventListener("change", function() {
          document.getElementById("other-text-container")
                  .classList.toggle("hidden", !this.checked);
          if (this.checked) otherTxt.focus();
        });
        otherTxt.addEventListener("keypress", e => {
          if (e.key === "Enter") {
            e.preventDefault();
            nextQuestion();
          }
        });
      }
    }
  }
  
  function nextQuestion() {
    const q = questions[currentQuestion];
    let value;
  
    if (q.type === "text" || q.type === "email" || q.type === "textarea") {
      const inp = document.getElementById("answer-input");
      value = inp.value.trim();
      if (!value) {
        alert("Please answer the question before continuing.");
        return;
      }
      if (q.type === "email" && !validateEmail(value)) {
        alert("Please enter a valid email address.");
        return;
      }
    }
    else { // checkbox
      const checked = [...document.querySelectorAll('input[name="help-option"]:checked')]
                      .map(cb => cb.value);
      if (checked.length === 0) {
        alert("Please select at least one option.");
        return;
      }
      // handle "Other"
      const otherInput = document.getElementById("other-text");
      if (checked.includes("Other") && otherInput.value.trim()) {
        checked.push("Other: " + otherInput.value.trim());
      }
      value = checked;
    }
  
    userAnswer[q.field] = value;
  
    // render the answer bubble + edit button
    const chatArea = document.getElementById("chat-area");
    const display  = Array.isArray(value) ? value.join(", ") : value;
    chatArea.innerHTML += `
      <div class="flex justify-end items-start gap-2" id="answer-${currentQuestion}">
        <div class="max-w-[70%] bg-primary text-white p-3 rounded-2xl rounded-br-none animate-slide-up">
          ${display}
        </div>
        <button onclick="editAnswer(${currentQuestion})"
                class="text-sm text-white underline hover:text-gray-200 mt-1">
          Edit
        </button>
      </div>
    `;
    chatArea.scrollTop = chatArea.scrollHeight;
  
    currentQuestion++;
    document.getElementById("input-area").innerHTML = "";
  
    if (currentQuestion < questions.length) {
      setTimeout(showQuestion, 300);
    } else {
      setTimeout(showReviewScreen, 300);
    }
  }
  
  function editAnswer(index) {
    currentQuestion = index;
    const ansBubble = document.getElementById(`answer-${index}`);
    if (ansBubble) ansBubble.remove();
    document.getElementById("input-area").innerHTML = "";
    showQuestion(true);
  }
  
  function showReviewScreen() {
    const chatArea = document.getElementById("chat-area");
    chatArea.innerHTML += `
      <div class="flex justify-start">
        <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    p-3 rounded-2xl rounded-bl-none animate-slide-up">
          Here's what you told us. You can edit any response before submitting.
        </div>
      </div>
    `;
  
    let summary = `<div class="space-y-4 mt-4">`;
    questions.forEach((q,i) => {
      const ans = userAnswer[q.field];
      const disp = Array.isArray(ans) ? ans.join(", ") : ans;
      summary += `
        <div class="flex items-start gap-2" id="review-answer-${i}">
          <div class="max-w-[70%] bg-primary text-white p-3 rounded-2xl rounded-br-none animate-slide-up">
            <strong>${q.question}</strong><br>${disp}
          </div>
          <button onclick="editAnswer(${i})"
                  class="text-sm text-white underline hover:text-gray-200 mt-1">
            Edit
          </button>
        </div>`;
    });
    summary += `
        <button onclick="submitForm()"
                class="mt-6 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition font-semibold">
          Confirm & Submit
        </button>
      </div>
    `;
    document.getElementById("input-area").innerHTML = summary;
  }
  
  function submitForm() {
    const chatArea = document.getElementById("chat-area");
    chatArea.innerHTML += `
      <div class="flex justify-start">
        <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    p-3 rounded-2xl rounded-bl-none animate-slide-up">
          Great! Please review and send your request.
        </div>
      </div>
    `;
  
    const formHTML = `
      <form action="https://submit-form.com/LuDF1TTat" method="POST"
            class="mt-8 flex flex-col items-center space-y-4">
        <input type="hidden" name="name"    value="${userAnswer.name}" />
        <input type="hidden" name="email"   value="${userAnswer.email}" />
        <input type="hidden" name="help"    value="${
          Array.isArray(userAnswer.help)
            ? userAnswer.help.join(", ")
            : userAnswer.help
        }" />
        <input type="hidden" name="message" value="${userAnswer.message}" />
  
        <div class="cf-turnstile" data-sitekey="0x4AAAAAABhAuNRDx-hOInQD"></div>
  
        <button type="submit"
                class="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition font-semibold">
          Submit My Request
        </button>
      </form>
    `;
  
    document.getElementById("input-area").innerHTML = formHTML;
    chatArea.scrollTop = chatArea.scrollHeight;
  
    // ensure Turnstile loaded
    setTimeout(() => {
      if (!document.querySelector('input[name="cf-turnstile-response"]')) {
        alert("CAPTCHA failed to load—please refresh and try again.");
      }
    }, 10000);
  }
  
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  