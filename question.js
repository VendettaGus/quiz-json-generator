const questions = [];
let answerCount = 4; // По умолчанию 4 варианта ответа

// Обработчики событий
document.getElementById("add-answer").addEventListener("click", addAnswerField);
document.getElementById("remove-answer").addEventListener("click", removeAnswerField);
document.getElementById("add-question").addEventListener("click", addQuestion);
document.getElementById("generate-json").addEventListener("click", generateJSON);
document.getElementById("export-json").addEventListener("click", exportJSON);

function addAnswerField() {
  const container = document.getElementById("answers-container");
  const label = document.createElement("label");
  label.textContent = `${container.childElementCount / 2 + 1}. Ответ:`; // Вычисляем номер ответа
  const input = document.createElement("input");
  input.type = "text";
  input.id = `answer${container.childElementCount / 2 + 1}`;
  input.placeholder = "Введите ответ";
  container.appendChild(label);
  container.appendChild(input);
  answerCount++;
}

function removeAnswerField() {
  if (answerCount > 2) {
    const container = document.getElementById("answers-container");
    container.removeChild(container.lastChild); // Удалить input
    container.removeChild(container.lastChild); // Удалить label
    answerCount--;
  } else {
    alert("Должно быть хотя бы два варианта ответа.");
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
  const correct = parseInt(document.getElementById("correct").value);

  if (!question || isNaN(correct) || correct < 1 || correct > answers.length) {
    alert("Пожалуйста, заполните все поля корректно.");
    return;
  }

  questions.push({ question, answers, correct: correct - 1 });
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
  answerCount = 0; // Сброс глобального счётчика
  for (let i = 0; i < 4; i++) {
    addAnswerField(); // Добавляем поля с правильной нумерацией
  }
}

// Инициализация с 4 ответами
clearFields();
