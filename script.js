let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastCompleteDate = localStorage.getItem("lastCompleteDate") || null;

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const streakText = document.getElementById("streakText");
const filterButtons = document.querySelectorAll(".filter-btn");
const darkModeToggle = document.getElementById("darkModeToggle");

let currentFilter = "all";
let chart;

// Add Task
addTaskBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") return;
    tasks.push({ text: taskInput.value, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
    updateProgress();
    updateChart();
});

// Render Tasks
function renderTasks() {
    taskList.innerHTML = "";
    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button onclick="toggleTask(${index})">${task.completed ? "✅" : "✔"}</button>
                <button onclick="deleteTask(${index})">🗑</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Toggle Complete
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;

    if (tasks[index].completed) {
        let today = new Date().toDateString();
        if (lastCompleteDate !== today) {
            streak++;
            lastCompleteDate = today;
        }
    }
    saveTasks();
    renderTasks();
    updateProgress();
    updateChart();
}

// Delete Task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    updateProgress();
    updateChart();
}

// Save to LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastCompleteDate", lastCompleteDate);
}

// Update Progress
function updateProgress() {
    let completed = tasks.filter(t => t.completed).length;
    let percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    progressFill.style.width = percent + "%";
    progressText.textContent = `${percent}% completed`;
    streakText.textContent = `🔥 Streak: ${streak} days`;
}

// Filter
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Chart.js
function updateChart() {
    let completed = tasks.filter(t => t.completed).length;
    let pending = tasks.length - completed;

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("taskChart"), {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#4caf50", "#f44336"]
            }]
        }
    });
}

// Initial Load
renderTasks();
updateProgress();
updateChart();
