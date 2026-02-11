const elToDoInput = document.querySelector("#todo__input");
const elToDoList = document.querySelector(".todo__ul");
const elToDoBtn = document.querySelector(".todo__btn");
const elEditModal = document.querySelector(".edit__modal");
const elOverlay = document.querySelector("#overlay");
const elEditInput = document.querySelector(".edit__input");
const elSaveBtn = document.querySelector(".save__btn");
const elCancelBtn = document.querySelector(".cancel__btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentEditId = null;

function saveLocal() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  elToDoList.innerHTML = "";
  todos.forEach((todo) => {
    const newToDoItem = document.createElement("li");
    newToDoItem.classList.add("todo__li");

    if (todo.isCompleted) {
      newToDoItem.classList.add("completed");
    }

    newToDoItem.innerHTML = `
      <span class="todo__text">${todo.text}</span>
      <div class="todo__options">
        <button class="edit__btn" data-id="${todo.id}">Edit</button>
        <button class="delete__btn" data-id="${todo.id}">
            ${todo.isCompleted ? "Restore" : "Done"}
        </button>
        ${todo.isCompleted ? `<button class="remove__btn" data-id="${todo.id}" style="margin-left:5px; color:#ffcccc; background:none; border:none; cursor:pointer;">Delete</button>` : ""}
      </div>
    `;

    elToDoList.appendChild(newToDoItem);
  });
}

function addTodo() {
  const text = elToDoInput.value.trim();
  if (text !== "") {
    const newTodo = {
      id: Date.now(),
      text: text,
      isCompleted: false,
    };

    todos.push(newTodo);
    saveLocal();
    renderTodos();
    elToDoInput.value = "";
    Toastify({
      text: "Task added successfully!",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  } else {
    Toastify({
      text: "Please enter a valid todo item.",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #e43535, #f4b404)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
}

function toggleComplete(id) {
  const todo = todos.find((t) => t.id === Number(id));
  if (todo) {
    todo.isCompleted = !todo.isCompleted;
    renderTodos();
  }
}

function removeTodo(id) {
  todos = todos.filter((t) => t.id !== Number(id));
  saveLocal();
  renderTodos();
}

function openModal(id) {
  const todo = todos.find((t) => t.id === Number(id));
  if (todo) {
    currentEditId = todo.id;
    elEditInput.value = todo.text;

    elEditModal.classList.add("visible");
    elOverlay.classList.add("visible");
  }
}

function closeModal() {
  elEditModal.classList.remove("visible");
  elOverlay.classList.remove("visible");
  currentEditId = null;
  elEditInput.value = "";
}

function saveEdit() {
  const newText = elEditInput.value.trim();

  if (newText !== "" && currentEditId !== null) {
    const todo = todos.find((t) => t.id === currentEditId);
    if (todo) {
      todo.text = newText;
      saveLocal();
      renderTodos();
      closeModal();
    }
  } else {
    alert("Task text cannot be empty.");
  }
}

elToDoBtn.addEventListener("click", addTodo);

elToDoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

elToDoList.addEventListener("click", function (event) {
  const target = event.target;
  const id = target.dataset.id;

  if (target.classList.contains("delete__btn")) {
    toggleComplete(id);
  } else if (target.classList.contains("edit__btn")) {
    openModal(id);
  } else if (target.classList.contains("remove__btn")) {
    removeTodo(id);
  }
});

elSaveBtn.addEventListener("click", saveEdit);

elEditInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    saveEdit();
  }
});

elCancelBtn.addEventListener("click", closeModal);

elOverlay.addEventListener("click", closeModal);

renderTodos();
