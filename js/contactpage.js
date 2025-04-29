const questions = [
    { question: "What's your name?", field: "name", type: "text" },
    { question: "What's your email address?", field: "email", type: "email" },
    { question: "What do you need help with? (Select all that apply)", field: "help", type: "checkbox" },
];

const helpOptions = [
    "Website Setup",
    "Troubleshooting",
    "Consultation",
    "General Tech Support",
    "Other"
];

let currentQuestion = 0;
const formData = {};

function nextQuestion() {
const chatArea = document.getElementById('chat-area');
const input = document.getElementById('answer-input') || document.querySelector('form input[type="email"]');
const checkboxes = document.querySelectorAll('input[name="help-option"]:checked');
const otherInput = document.getElementById('other-text');

let value = "";

// Handle different types
if (questions[currentQuestion].type === "text" || questions[currentQuestion].type === "email") {
    value = input.value.trim();
    if (value === "") {
    alert("Please answer the question before continuing.");
    return;
    }
    if (questions[currentQuestion].type === "email" && !validateEmail(value)) {
    alert("Please enter a valid email address.");
    return;
    }
} else if (questions[currentQuestion].type === "checkbox") {
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

// Save answer
formData[questions[currentQuestion].field] = value;

// Show user's answer bubble
let answerHTML = `
    <div class="flex justify-end">
    <div class="max-w-[70%] bg-primary text-white p-3 rounded-2xl rounded-br-none">
        ${Array.isArray(value) ? value.join(", ") : value}
    </div>
    </div>
`;
chatArea.innerHTML += answerHTML;
chatArea.scrollTop = chatArea.scrollHeight;

currentQuestion++;

if (currentQuestion < questions.length) {
    setTimeout(() => {
    showQuestion();
    }, 300);
} else {
    setTimeout(() => {
    submitForm();
    }, 300);
}

document.getElementById('input-area').innerHTML = "";
}

function showQuestion() {
const chatArea = document.getElementById('chat-area');
const q = questions[currentQuestion];

// Show bot's question bubble
const questionHTML = `
    <div class="flex justify-start">
    <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-bl-none">
        ${q.question}
    </div>
    </div>
`;
chatArea.innerHTML += questionHTML;
chatArea.scrollTop = chatArea.scrollHeight;

// Update input area
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
} else if (q.type === "checkbox") {
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
    `;

    setTimeout(() => {
    const otherCheckbox = document.querySelector('input[value="Other"]');
    otherCheckbox.addEventListener('change', function() {
        const otherContainer = document.getElementById('other-text-container');
        if (this.checked) {
        otherContainer.classList.remove('hidden');
        } else {
        otherContainer.classList.add('hidden');
        }
    });
    }, 100);

    html += `
    <button onclick="nextQuestion()" class="mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition font-semibold">
        Send
    </button>
    `;
}

document.getElementById('input-area').innerHTML = html;
}

function validateEmail(email) {
const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return re.test(email);
}

function submitForm() {
const chatArea = document.getElementById('chat-area');
const formHTML = `
    <form action="https://formspree.io/f/{form_id}" method="POST" class="mt-8 flex flex-col items-center">
    <input type="hidden" name="name" value="${formData.name}">
    <input type="hidden" name="email" value="${formData.email}">
    <input type="hidden" name="help" value="${Array.isArray(formData.help) ? formData.help.join(", ") : formData.help}">
    <button type="submit" class="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition font-semibold">
        Submit My Request
    </button>
    </form>
`;
chatArea.innerHTML += `
    <div class="flex justify-start">
    <div class="max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-bl-none">
        Great! Please review and send your request.
    </div>
    </div>
`;
document.getElementById('input-area').innerHTML = formHTML;
chatArea.scrollTop = chatArea.scrollHeight;
}