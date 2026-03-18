const chatForm = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Добавляем сообщение пользователя
  const userDiv = document.createElement("div");
  userDiv.classList.add("chat-message", "user");
  userDiv.textContent = "Вы: " + userMessage;
  chatBox.appendChild(userDiv);
  userInput.value = "";

  // Добавляем блок для ответа ИИ
  const botDiv = document.createElement("div");
  botDiv.classList.add("chat-message", "bot");
  botDiv.textContent = "ИИ: ";
  chatBox.appendChild(botDiv);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    // Проверяем, что сервер вернул JSON
    const data = await response.json();
    const reply = data.reply || "Ответ пустой.";

    // Эффект печатающей машинки
    let i = 0;
    const interval = setInterval(() => {
      botDiv.textContent += reply[i];
      i++;
      if (i >= reply.length) {
        clearInterval(interval);
      }
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 30);
  } catch (err) {
    botDiv.textContent += "Ошибка: " + err.message;
  }
});
