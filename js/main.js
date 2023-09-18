const task_input = document.querySelector("input");
const date_input = document.querySelector(".schedule-date");
const add_btn = document.querySelector(".add-task-button");
const todos_list_body = document.querySelector(".todos-list-body");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener("DOMContentLoaded", () => {
  showAllTodos();
  if (!todos.length) {
    displayTodos([]);
  }
});

function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function addToDo(taskInput, dateInput) {
  let prioritySelect = document.querySelector(".priority-select");
  let priorityValue = prioritySelect.value;

  let task = {
    id: getRandomId(),
    task: taskInput.value,
    dueDate: dateInput.value,
    completed: false,
    status: "pending",
    priority: priorityValue,
  };
  todos.push(task);
}




task_input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && task_input.value.length > 0) {
    addToDo(task_input, date_input); // Use the renamed parameters
    saveToLocalStorage();
    task_input.value = "";
    showAllTodos();
  }
});

add_btn.addEventListener("click", () => {
  if (task_input.value === "") {
    showAlertMessage("Please enter a task", "error");
  } else {
    addToDo(task_input, date_input); // Use the renamed parameters
    saveToLocalStorage();
    showAllTodos();
    task_input.value = "";
    date_input.value = "";
    showAlertMessage("Task added successfully", "success");
  }
});

delete_all_btn.addEventListener("click", clearAllTodos);

function showAllTodos() {
  todos_list_body.innerHTML = "";
  if (todos.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="6" class="text-center">No task found</td></tr>`;
    return;
  }

  todos.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "No due date"}</td>
                <td>${todo.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${todo.id}')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${todo.id}')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${todo.id}')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
                <td>${todo.priority}</td> <!-- Display priority value -->
            </tr>
        `;
  });
}

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlertMessage(message, type) {
  let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
  alert_message.innerHTML = alert_box;
  alert_message.classList.remove("hide");
  alert_message.classList.add("show");
  setTimeout(() => {
    alert_message.classList.remove("show");
    alert_message.classList.add("hide");
  }, 3000);
}

//delete todo
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  showAlertMessage("Todo deleted successfully", "success");
  showAllTodos();
}

//edit todo
function editTodo(id) {
  let todo = todos.find((todo) => todo.id === id);
  task_input.value = todo.task;
  todos = todos.filter((todo) => todo.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
  saveToLocalStorage();
  add_btn.addEventListener("click", () => {
    add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
    showAlertMessage("Todo updated successfully", "success");
  });
}

//clear all todos
function clearAllTodos() {
  if (todos.length > 0) {
    todos = [];
    saveToLocalStorage();
    showAlertMessage("All todos cleared successfully", "success");
    showAllTodos();
  } else {
    showAlertMessage("No todos to clear", "error");
  }
}

function toggleStatus(id) {
  let todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  if (todo.completed) {
    todo.status = "completed";
  } else {
    todo.status = "pending";
  }
  saveToLocalStorage();
  showAllTodos();
}
