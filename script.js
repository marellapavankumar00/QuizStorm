const startButton = document.getElementById("start-btn");
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const amountInput = document.getElementById("amount");
const labels = document.querySelectorAll("label");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Start Quiz on Button Click
startButton.addEventListener("click", async () => {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const amount = amountInput.value; // Get number of questions

    await fetchQuestions(category, difficulty, amount);
    startButton.style.display = "none"; // Hide Start Button
    categorySelect.style.display = "none";
    difficultySelect.style.display = "none";
    amountInput.style.display = "none";
    labels.forEach(label => label.style.display = "none");
    questionContainer.style.display = "block"; // Show Quiz
});


async function fetchQuestions(category, difficulty, amount) {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();
    questions = data.results;
    showQuestion();
}

function showQuestion() {
    resetState();
    const questionData = questions[currentQuestionIndex];

    questionElement.innerHTML = decodeHTMLEntities(questionData.question);
    
    const answers = [...questionData.incorrect_answers, questionData.correct_answer];
    answers.sort(() => Math.random() - 0.5); // Shuffle answers

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = decodeHTMLEntities(answer);
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, questionData.correct_answer));
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    answerButtonsElement.innerHTML = "";
}

function selectAnswer(selectedButton, correctAnswer) {
    const isCorrect = selectedButton.innerText === decodeHTMLEntities(correctAnswer);
    selectedButton.classList.add(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
        score++;
    }

    document.querySelectorAll(".btn").forEach(button => {
        button.disabled = true;
        if (button.innerText === decodeHTMLEntities(correctAnswer)) {
            button.classList.add("correct");
        }
    });

    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showFinalScore();
    }
});

function showFinalScore() {
    questionElement.innerHTML = `Quiz Completed! &#127881;<br> Your Score: <b>${score} / ${questions.length}</b>`;
    answerButtonsElement.innerHTML = "";
    nextButton.innerText = "Restart Quiz";
    nextButton.style.display = "block";

    nextButton.addEventListener("click", () => {
        location.reload();
    });
}

// Function to decode special characters (&quot;, &amp;, ....)
function decodeHTMLEntities(text) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
}
