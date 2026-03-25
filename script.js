async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const message = input.value.trim();

  if (message === "") return;

  chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  chatbox.innerHTML += `<p id="typing"><strong>BC CourseFinder™:</strong> Thinking...</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const response = await fetch("https://bc-course-finder.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    const typingMessage = document.getElementById("typing");
    if (typingMessage) {
      typingMessage.remove();
    }

    if (!response.ok) {
      chatbox.innerHTML += `<p><strong>BC CourseFinder™:</strong> ${data.reply || "Something went wrong."}</p>`;
      chatbox.scrollTop = chatbox.scrollHeight;
      return;
    }

    const cleanReply = (data.reply || "")
  .replace(/\*\*/g, "")
  .replace(/\n/g, "<br>")
  .replace(/- /g, "• ");

    chatbox.innerHTML += `<p><strong>BC CourseFinder™:</strong> ${cleanReply}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
    const typingMessage = document.getElementById("typing");
    if (typingMessage) {
      typingMessage.remove();
    }

    chatbox.innerHTML += `<p><strong>BC CourseFinder™:</strong> Sorry, I could not connect to the server.</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
    console.error(error);
  }
}

function askQuickQuestion(question) {
  document.getElementById("userInput").value = question;
  sendMessage();
}


document.getElementById("userInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function openQR() {
  document.getElementById("qrModal").style.display = "flex";
}

function closeQR() {
  document.getElementById("qrModal").style.display = "none";
}