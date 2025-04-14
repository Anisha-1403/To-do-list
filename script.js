const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const prioritySelect = document.getElementById("priority");
const themeToggle = document.getElementById("theme-toggle");

// Load theme
document.body.classList.toggle('dark', localStorage.getItem('theme') === 'dark');
themeToggle.checked = document.body.classList.contains('dark');

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.childNodes[0].textContent.trim(),
      checked: li.classList.contains("checked"),
      priority: li.getAttribute("data-priority"),
      due: li.querySelector(".due-date")?.textContent.replace("📅 ", "") || ""
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    addTask(task.text, task.priority, task.checked);
  });
}

function addTask(text = null, priority = null, isChecked = false, due = null) {
  const inputText = text || taskInput.value.trim();
  const inputPriority = priority || prioritySelect.value;
  const inputDueDate = due || document.getElementById("dueDate").value;

  if (inputText === "") return;

  let li = document.createElement("li");
  li.textContent = inputText;
  li.setAttribute("data-priority", inputPriority);

  if (isChecked) {
    li.classList.add("checked");
  }

  // Priority Tag
  const tag = document.createElement("span");
  tag.className = `priority-tag priority-${inputPriority}`;
  li.appendChild(tag);

  // Due Date
  if (inputDueDate) {
    li.setAttribute("title", `Due: ${inputDueDate}`);
  }
  

  // Delete Button
  let del = document.createElement("span");
  del.textContent = "×";
  del.addEventListener("click", function (e) {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });
  li.appendChild(del);
  del.classList.add("delete");

  // Toggle Check
  li.addEventListener("click", function (e) {
    if (e.target !== del) {
      li.classList.toggle("checked");
      saveTasks();
    }
  });

  taskList.appendChild(li);

  if (!text) {
    taskInput.value = "";
    document.getElementById("dueDate").value = "";
  }

  saveTasks();
}

loadTasks();

const dueDate = document.getElementById("dueDate").value;
if (dueDate) {
  const dateTag = document.createElement("span");
  dateTag.className = "due-date";
  dateTag.textContent = `📅 ${dueDate}`;
  dateTag.style.position = "absolute";
  dateTag.style.left = "15px";
  dateTag.style.bottom = "5px";
  dateTag.style.fontSize = "12px";
  dateTag.style.color = "#777";
  li.appendChild(dateTag);
}
