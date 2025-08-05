const socket = io("http://localhost:8001");

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("message", (message) => {
  console.log(message);
});

const form = document.getElementById("form");
const input = document.getElementById("input");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    const message = input.value;
    socket.emit("message", message);

    input.value = "";
  }
});
