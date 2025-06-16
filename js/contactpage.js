// only three questions: name, email, help
const questions = [
  { question: "What's your name?", field: "name", type: "text" },
  { question: "What's your email address?", field: "email", type: "email" },
  { question: "What do you need help with?", field: "help", type: "checkbox" },
];

const helpOptions = [
  "Computer Repair & Maintenance",
  "Virus & Malware Removal",
  "Data Recovery",
  "Network & Wi-Fi Setup",
  "Printer Setup & Troubleshooting",
  "Smart Home Setup",
  "Website Development",
  "Business IT Support",
  "Other",
];

let currentQuestion = 0;
const userAnswer = {};

// start the flow immediately if DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showQuestion);
} else {
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];
  // show the question bubble
  document.getElementById("chat-area").innerHTML += `
      <div class="flex justify-start">
        <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    p-3 rounded-2xl rounded-bl-none animate-slide-up">
          ${q.question}
        </div>
      </div>
    `;

  // build the input UI
  let html = "";
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
  } else {
    html = `<div class="flex flex-col items-start space-y-3">`;
    helpOptions.forEach((opt) => {
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
    inp.addEventListener("keypress", (e) => {
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
    if (!val) return alert("Please answer before continuing.");
    if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return alert("Enter a valid email.");
  } else {
    const checked = Array.from(
      document.querySelectorAll('input[name="help-option"]:checked')
    ).map((cb) => cb.value);
    if (checked.length === 0) return alert("Select at least one option.");
    if (checked.includes("Other")) {
      const other = prompt("Please specify:");
      if (other) checked.push(`Other: ${other}`);
    }
    val = checked.join(", ");
  }

  userAnswer[q.field] = val;

  // render the user's answer
  document.getElementById("chat-area").innerHTML += `
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
  document.getElementById("input-area").innerHTML = `
      <form id="contact-form" action="https://submit-form.com/LuDF1TTat" method="POST" class="space-y-4 mt-4">
        <input type="hidden" name="name" value="${userAnswer.name}">
        <input type="hidden" name="email" value="${userAnswer.email}">
        <input type="hidden" name="message" value="${userAnswer.help}">
        <div class="cf-turnstile" data-sitekey="0x4AAAAAABhAuNRDx-hOInQD"></div>
        <button type="submit" class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
          Confirm &amp; Send
        </button>
      </form>
    `;
}
