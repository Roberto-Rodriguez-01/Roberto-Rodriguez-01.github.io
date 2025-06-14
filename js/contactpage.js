// Questions asked by site
const questions = [
    { question: "What's your name?", field: "name", type: "text" },
    { question: "What's your email address?", field: "email", type: "email" },
    { question: "What do you need help with? (Select all that apply)", field: "help", type: "checkbox" }
];

// Part of question #3 that asks what the user needs help with
const helpOptions = [
    "Website Setup",
    "Troubleshooting",
    "Consultation",
    "General Tech Support",
    "Other"
];

// What the current question is
let currentQuestion = 0;

// Store user answer here
const userAnswer = {};

// An event listener that checks when the document is loaded and runs showQuestion
document.addEventListener("DOMContentLoaded", showQuestion);

function showQuestion(isEditing = false) {
    const chatArea = document.getElementById("chat-area");
    const q = questions[currentQuestion];

    const questionHTML = `
        <div class="flex justify-start" id="question-${currentQuestion}">
            <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-bl-none animate-slide-up">
                ${q.question}
            </div>
        </div>
    `;

    chatArea.innerHTML += questionHTML;
    chatArea.scrollTop = chatArea.scrollHeight;

    let html = "";

    if (q.type === "text" || q.type === "email") {
        html += `
            <div class="flex gap-2">
                <input type="${q.type}" id="answer-input" class="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white transition">
                <button onclick="nextQuestion()" class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
                Send
                </button>
            </div>
        `;
    } 
    else if (q.type === "checkbox") {
        html += `<div class="flex flex-col items-start space-y-3">`;
        helpOptions.forEach(option => {
            html += `
                <label class="flex items-center space-x-3">
                <input type="checkbox" name="help-option" value="${option}" class="accent-primary dark:accent-primary w-5 h-5">
                <span class="text-gray-700 dark:text-gray-300">${option}</span>
                </label>
            `;
        });
    
        html += `</div>`;
    
        html += `
            <div id="other-text-container" class="hidden mt-4 w-full">
                <input type="text" id="other-text" placeholder="Please specify..." class="w-full px-4 py-2 border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <button onclick="nextQuestion()" class="mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
                Send
            </button>
        `;
    }

    document.getElementById("input-area").innerHTML = html;

    setTimeout(() => {
        if (q.type === "text" || q.type === "email") {
            const input = document.getElementById("answer-input");
            input.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    nextQuestion();
                }
            });
        } 
        else if (q.type === "checkbox") {
            const otherCheckbox = document.querySelector('input[value="Other"]');
            const otherInput = document.getElementById("other-text");
    
            if (otherCheckbox && otherInput) {
                otherCheckbox.addEventListener("change", function () {
                    const container = document.getElementById("other-text-container");
                    if (this.checked) {
                        container.classList.remove("hidden");
                        otherInput.focus();
                    }   
                    else {
                        container.classList.add("hidden");
                    }
                });
    
                otherInput.addEventListener("keypress", function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        nextQuestion();
                    }
                });
            }
        }
    }, 50);
}

function nextQuestion() {
    const chatArea = document.getElementById("chat-area");
    const input = document.getElementById("answer-input");
    const checkboxes = document.querySelectorAll('input[name="help-option"]:checked');
    const otherInput = document.getElementById("other-text");

    let value = "";
    const q = questions[currentQuestion];

    if (q.type === "text" || q.type === "email") {
        value = input.value.trim();
        if (value === "") {
            alert("Please answer the question before continuing.");
            return;
        }
        if (q.type === "email" && !validateEmail(value)) {
            alert("Please enter a valid email address.");
            return;
        }
    } 
    else if (q.type === "checkbox") {
        value = Array.from(checkboxes).map(cb => cb.value);
        if (value.length === 0) {
            alert("Please select at least one option.");
            return;
        }
        if (value.includes("Other") && otherInput) {
            const otherText = otherInput.value.trim();
            if (otherText !== "") {
                value.push("Other: " + otherText);
            }
        }
    }
    userAnswer[q.field] = value;

    const answerHTML = `
        <div class="flex justify-end items-start gap-2" id="answer-${currentQuestion}">
            <div class="max-w-[70%] bg-primary text-white p-3 rounded-2xl rounded-br-none animate-slide-up">
                ${Array.isArray(value) ? value.join(", ") : value}
            </div>
            <button onclick="editAnswer(${currentQuestion})" class="text-sm text-white underline hover:text-gray-200 mt-1">Edit</button>
        </div>
    `;
    chatArea.innerHTML += answerHTML;
    chatArea.scrollTop = chatArea.scrollHeight;

    currentQuestion++;
    
    document.getElementById("input-area").innerHTML = "";

    if (currentQuestion < questions.length) {
        setTimeout(showQuestion, 300);
    } 
    else {
        setTimeout(showReviewScreen, 300);
    }
}

function editAnswer(index) {
    currentQuestion = index;
    const answerBubble = document.getElementById(`answer-${index}`);
    const inputArea = document.getElementById("input-area");
  
    if (answerBubble) answerBubble.remove();
    inputArea.innerHTML = "";
    showQuestion(true);
}

function showReviewScreen() {
    const chatArea = document.getElementById("chat-area");
    const inputArea = document.getElementById("input-area");

    chatArea.innerHTML += `
        <div class="flex justify-start">
            <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-bl-none animate-slide-up">
                Here's what you told us. You can edit any response before submitting.
            </div>
        </div>
    `;

    let summaryHTML = `<div class="space-y-4">`;

    questions.forEach((q, index) => {
        const answer = userAnswer[q.field];
        const displayValue = Array.isArray(answer) ? answer.join(", ") : answer;
        summaryHTML += `
            <div class="flex items-start gap-2" id="review-answer-${index}">
                <div class="max-w-[70%] bg-primary text-white p-3 rounded-2xl rounded-br-none animate-slide-up">
                    <strong>${q.question}</strong><br>${displayValue}
                </div>
                <button onclick="editAnswer(${index})" class="text-sm text-white underline hover:text-gray-200 mt-1">Edit</button>
            </div>
        `;
    });
    summaryHTML += `
        <button onclick="submitForm()" class="mt-6 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition font-semibold">
            Confirm & Submit
        </button>
    </div>`;

    inputArea.innerHTML = summaryHTML;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function submitForm() {
    const chatArea = document.getElementById("chat-area");
    const formHTML = `
        <form action="https://submit-form.com/LuDF1TTat" method="POST" class="mt-8 flex flex-col items-center">
            <input type="hidden" name="name" value="${userAnswer.name}">
            <input type="hidden" name="email" value="${userAnswer.email}">
            <input type="hidden" name="help" value="${Array.isArray(userAnswer.help) ? userAnswer.help.join(", ") : userAnswer.help}">
            <!-- Cloudflare Turnstile widget -->
            <div class="cf-turnstile" data-sitekey="0x4AAAAAABhAuNRDx-hOInQD"></div>

            <button type="submit" class="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition font-semibold">
                Submit My Request
            </button>
        </form>
    `;
    
    chatArea.innerHTML += `
        <div class="flex justify-start">
            <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-bl-none animate-slide-up">
                Great! Please review and send your request.
            </div>
        </div>
    `;

    document.getElementById("input-area").innerHTML = formHTML;
    chatArea.scrollTop = chatArea.scrollHeight;

    // Guard: ensure Turnstile loaded correctly
    setTimeout(() => {
        if (!document.querySelector('input[name="cf-turnstile-response"]')) {
            alert("CAPTCHA failed to load—please refresh and try again.");
        }
    }, 10000);
}
