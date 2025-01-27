const questions = [];
let answerCount = 0;

// Обработчики событий
document.getElementById("add-answer").addEventListener("click", addAnswerField);
document.getElementById("remove-answer").addEventListener("click", removeAnswerField);
document.getElementById("add-question").addEventListener("click", addQuestion);
document.getElementById("generate-json").addEventListener("click", generateJSON);
document.getElementById("export-json").addEventListener("click", exportJSON);

function addAnswerField() {
  const container = document.getElementById("answers-container");
  const label = document.createElement("label");
  label.textContent = `${container.childElementCount / 2 + 1}. Ответ:`;
  const input = document.createElement("input");
  input.type = "text";
  input.id = `answer${container.childElementCount / 2 + 1}`;
  input.placeholder = "Введите ответ";
  container.appendChild(label);
  container.appendChild(input);
  answerCount++;
  updateCorrectFieldState();
}

function removeAnswerField() {
  if (answerCount > 1) {
    const container = document.getElementById("answers-container");
    container.removeChild(container.lastChild);
    container.removeChild(container.lastChild);
    answerCount--;
    updateCorrectFieldState();
  }
}

function addQuestion() {
  const question = document.getElementById("question").value.trim();
  const answers = [];
  const container = document.getElementById("answers-container");

  for (let i = 1; i <= container.childElementCount / 2; i++) {
    const answer = document.getElementById(`answer${i}`)?.value.trim();
    if (answer) {
      answers.push(answer);
    } else {
      alert(`Заполните все варианты ответов.`);
      return;
    }
  }

  // Если есть только один ответ, добавляем без поля "correct"
  if (answers.length === 1) {
    questions.push({ question, answers });
  } else {
    const correct = parseInt(document.getElementById("correct").value);
    if (!question || isNaN(correct) || correct < 1 || correct > answers.length) {
      alert("Пожалуйста, заполните все поля корректно.");
      return;
    }

    questions.push({ question, answers, correct: correct - 1 });
  }

  alert("Вопрос добавлен!");
  clearFields();
}


function generateJSON() {
  const output = document.getElementById("output");
  output.value = JSON.stringify(questions, null, 2);
}

function exportJSON() {
  const jsonContent = JSON.stringify(questions, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quiz.json";
  link.click();
}

function clearFields() {
  document.getElementById("question").value = "";
  document.getElementById("correct").value = "";
  const container = document.getElementById("answers-container");
  container.innerHTML = "";
  answerCount = 0;
  for (let i = 0; i < 4; i++) {
    addAnswerField();
  }
}

function updateCorrectFieldState() {
  const correctField = document.getElementById("correct");
  if (answerCount === 1) {
    correctField.value = "1";
    correctField.disabled = true;
  } else {
    correctField.disabled = false;
  }
}

// Инициализация
clearFields();