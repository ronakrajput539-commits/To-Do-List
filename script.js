
const form = document.getElementById("addForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const counter = document.getElementById("counter");
const filters = document.getElementById("filters");
const clearBtn = document.getElementById("clearDone");

let tasks = [];
let currentFilter = "all";

function save() {
  try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {}
}
function load() {
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }
}


document.getElementById("date").textContent =
  new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

function render() {
  list.innerHTML = "";

  const visible = tasks.filter(function (t) {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  visible.forEach(function (task) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = task.done;
    box.setAttribute("aria-label", "Mark done: " + task.text);
    box.addEventListener("change", function () { toggle(task.id); });

    const label = document.createElement("span");
    label.textContent = task.text;  
    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "×";
    del.setAttribute("aria-label", "Delete: " + task.text);
    del.addEventListener("click", function () { remove(task.id); });

    li.append(box, label, del);
    list.appendChild(li);
  });

  emptyMsg.hidden = visible.length > 0;

  const left = tasks.filter(function (t) { return !t.done; }).length;
  counter.textContent = left + (left === 1 ? " task left" : " tasks left");
}


function addTask(text) {
  tasks.push({ id: Date.now(), text: text, done: false });
  save(); render();
}
function toggle(id) {
  tasks = tasks.map(function (t) {
    return t.id === id ? { id: t.id, text: t.text, done: !t.done } : t;
  });
  save(); render();
}
function remove(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  save(); render();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();               
  const text = input.value.trim();
  if (text === "") return;             
  addTask(text);
  input.value = "";
  input.focus();
});

filters.addEventListener("click", function (event) {
  const btn = event.target.closest("button");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  filters.querySelectorAll("button").forEach(function (b) {
    b.classList.toggle("active", b === btn);
  });
  render();
});

clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  save(); render();
});


load();
render();