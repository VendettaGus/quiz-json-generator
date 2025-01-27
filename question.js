const questions = [];
let answerCount = 1; // Начальное количество полей для ответов
let isListCollapsed = false; // Состояние списка вопросов (свёрнут/развёрнут)

// Обработчики событий
document.getElementById("add-answer").addEventListener("click", addAnswerField);
document.getElementById("remove-answer").addEventListener("click", removeAnswerField);
document.getElementById("add-question").addEventListener("click", addQuestion);
document.getElementById("generate-json").addEventListener("click", generateJSON);
document.getElementById("export-json").addEventListener("click", exportJSON);
document.getElementById("toggle-questions").addEventListener("click", toggleQuestionsList);

function addAnswerField() {
  const container = document.getElementById("answers-container");
  const label = document.createElement("label");
  label.textContent = `${container.childElementCount / 2 + 1}. Ответ:`;
  const input = document.createElement("textarea");
  input.id = `answer${container.childElementCount / 2 + 1}`;
  input.placeholder = "Введите ответ";
  container.appendChild(label);
  container.appendChild(input);
  answerCount++;
  toggleCorrectField();
}

function removeAnswerField() {
  if (answerCount > 1) {
    const container = document.getElementById("answers-container");
    container.removeChild(container.lastChild); // Удаляем input
    container.removeChild(container.lastChild); // Удаляем label
    answerCount--;
    toggleCorrectField();
  } else {
    alert("Должен быть хотя бы один вариант ответа.");
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

  const correctInput = document.getElementById("correct");
  const correct = answers.length > 1 ? parseInt(correctInput.value) : null;

  if (!question || (answers.length > 1 && (isNaN(correct) || correct < 1 || correct > answers.length))) {
    alert("Пожалуйста, заполните все поля корректно.");
    return;
  }

  const newQuestion = { question, answers };
  if (answers.length > 1) {
    newQuestion.correct = correct - 1;
  }

  questions.push(newQuestion);
  alert("Вопрос добавлен!");
  clearFields();
  displayQuestions();
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
  addAnswerField();
  toggleCorrectField();
}

function toggleCorrectField() {
  const correctField = document.getElementById("correct");
  correctField.disabled = answerCount === 1;
}

function displayQuestions() {
  const list = document.getElementById("questions-list");
  list.innerHTML = ""; // Очищаем список перед обновлением

  questions.forEach((q, index) => {
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");
    questionItem.style.border = "1px solid #ddd";
    questionItem.style.padding = "10px";
    questionItem.style.marginBottom = "10px";
    questionItem.style.borderRadius = "5px";

    const questionText = document.createElement("p");
    questionText.textContent = `Вопрос ${index + 1}: ${q.question}`;
    questionItem.appendChild(questionText);

    const answersText = document.createElement("p");
    answersText.textContent = `Ответы: ${q.answers.join(", ")}`;
    questionItem.appendChild(answersText);

    if (q.correct !== undefined) {
      const correctText = document.createElement("p");
      correctText.textContent = `Правильный ответ: ${q.correct + 1}`;
      questionItem.appendChild(correctText);
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.style.backgroundColor = "#f44336";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "5px 10px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.borderRadius = "3px";
    deleteButton.addEventListener("click", () => deleteQuestion(index));

    questionItem.appendChild(deleteButton);
    list.appendChild(questionItem);
  });
}

function deleteQuestion(index) {
  questions.splice(index, 1);
  displayQuestions();
  generateJSON();
}

function toggleQuestionsList() {
  const list = document.getElementById("questions-list");
  const toggleButton = document.getElementById("toggle-questions");

  if (isListCollapsed) {
    list.style.display = "block";
    toggleButton.textContent = "Свернуть список вопросов";
  } else {
    list.style.display = "none";
    toggleButton.textContent = "Развернуть список вопросов";
  }

  isListCollapsed = !isListCollapsed;
}

// Инициализация
clearFields();
