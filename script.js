// Task Schedule
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const priorityFilter = document.getElementById("priority-filter");
const completionFilter = document.getElementById("completion-filter");
const categoryFilter = document.getElementById("category-filter");
const categoryValue = categoryFilter.value;

priorityFilter.addEventListener("change", function () {
  filterTasks();
});

categoryFilter.addEventListener("change", function () {
  filterTasks();
});

completionFilter.addEventListener("change", function () {
  filterTasks();
});

function filterTasks() {
  const priorityValue = priorityFilter.value;
  const completionValue = completionFilter.value;
  const categoryValue = categoryFilter.value;

  const tasks = Array.from(taskList.children);

  tasks.forEach(function (task) {
    const priority = task.getAttribute("data-priority");
    const completed = task.classList.contains("completed");
    const category = task.getAttribute("data-category");

    if (
      (priorityValue === "all" || priority === priorityValue) &&
      (completionValue === "all" ||
        (completionValue === "completed" && completed) ||
        (completionValue === "incomplete" && !completed)) &&
      (categoryValue === "all" || category === categoryValue)
    ) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskNameInput = document.getElementById("task-name");
  const taskDeadlineInput = document.getElementById("task-deadline");
  const taskPriorityInput = document.getElementById("task-priority");
  const taskCategoryInput = document.getElementById("task-category");

  const task = {
    name: taskNameInput.value,
    deadline: taskDeadlineInput.value,
    priority: taskPriorityInput.value,
    category: taskCategoryInput.value,
  };

  // Create a new list item for the task
  const taskItem = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");
  taskItem.appendChild(checkbox);

  const taskLabel = document.createElement("label");
  taskLabel.textContent = `${task.name} - Deadline: ${task.deadline} - Priority: ${task.priority} - Category: ${task.category}`;
  taskLabel.setAttribute("for", `task-checkbox-${taskList.childElementCount}`);
  taskLabel.classList.add("task-label");
  taskItem.appendChild(taskLabel);

  taskItem.setAttribute("data-priority", task.priority);
  taskItem.setAttribute("data-category", task.category); // Set the data-category attribute
  // Set the data-priority attribute

  // Add the task to the task list
  taskList.appendChild(taskItem);

  // Clear the form inputs
  taskNameInput.value = "";
  taskDeadlineInput.value = "";
  taskPriorityInput.value = "low";

  sortTasksByPriority();
  filterTasks(); // Apply filters after adding a new task
});

function sortTasksByPriority() {
  const tasks = Array.from(taskList.children);

  tasks.sort(function (taskA, taskB) {
    const priorityA = taskA.getAttribute("data-priority");
    const priorityB = taskB.getAttribute("data-priority");

    if (priorityA === priorityB) {
      return 0;
    } else if (priorityA === "high") {
      return -1;
    } else if (priorityB === "high") {
      return 1;
    } else if (priorityA === "medium") {
      return -1;
    } else if (priorityB === "medium") {
      return 1;
    } else {
      return 0;
    }
  });

  // Update the task list with the sorted tasks
  taskList.innerHTML = "";
  tasks.forEach(function (task) {
    taskList.appendChild(task);
  });
}

let completedTasks = 0;

taskList.addEventListener("change", function (event) {
  if (event.target.matches(".task-checkbox")) {
    const taskItem = event.target.closest("li");
    taskItem.classList.toggle("completed");
    if (taskItem.classList.contains("completed")) {
      completedTasks++;
    } else {
      completedTasks--;
    }

    updateProductivity();
    filterTasks(); // Apply filters after marking a task as completed/incomplete
  }
});

function updateProductivity() {
  const totalTasks = taskList.children.length;
  const productivity = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Update the productivity display
  const productivityDisplay = document.getElementById("productivity-display");
  productivityDisplay.textContent = `Productivity: ${productivity.toFixed(2)}%`;
}

// Study Timer
const timerDisplay = document.getElementById("timer-display");
const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const editTimerBtn = document.getElementById("edit-timer");
const audio = new Audio("white-noise.mp3"); // Replace 'white-noise.mp3'

let timerInterval;
let timerSeconds = 1500; // 25 minutes
let isTimerRunning = false;
let isTimerEditable = true;

function startTimer() {
  if (!isTimerRunning && isTimerEditable) {
    startTimerBtn.disabled = true;
    pauseTimerBtn.disabled = false;
    resetTimerBtn.disabled = false;
    editTimerBtn.disabled = true;

    timerSeconds = convertTimeStringToSeconds(timerDisplay.textContent);

    timerInterval = setInterval(function () {
      const minutes = Math.floor(timerSeconds / 60);
      const seconds = timerSeconds % 60;
      timerDisplay.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      if (timerSeconds === 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00";
        isTimerRunning = false;
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
        resetTimerBtn.disabled = true;
        editTimerBtn.disabled = false;
        audio.pause();

        const beepAudio = new Audio("beep.mp3");
        beepAudio.play(); // Play the beep sound
        // Add code here to handle timer completion
      } else {
        timerSeconds--;
        audio.play();
      }
    }, 1000);

    isTimerRunning = true;
  }
}

function pauseTimer() {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
    resetTimerBtn.disabled = false;
    editTimerBtn.disabled = false;
    audio.pause(); // Stop playing white noise
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 0000; // Reset to 25 minutes
  timerDisplay.textContent = "00:00";
  isTimerRunning = false;
  startTimerBtn.disabled = false;
  pauseTimerBtn.disabled = true;
  resetTimerBtn.disabled = true;
  editTimerBtn.disabled = false;
  audio.pause(); // Stop playing white noise

  const beepAudio = new Audio("beep.mp3");
  beepAudio.play(); // Play the beep sound
}

function editTimer() {
  if (!isTimerRunning) {
    isTimerEditable = true;
    timerDisplay.contentEditable = true;
    timerDisplay.classList.add("editable");
    editTimerBtn.disabled = true;
    startTimerBtn.disabled = false;
  }
}

function convertTimeStringToSeconds(timeString) {
  const [minutes, seconds] = timeString
    .split(":")
    .map((part) => parseInt(part));
  return minutes * 60 + seconds;
}

startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);
editTimerBtn.addEventListener("click", editTimer);

//Chart
const taskData = [
  { day: "Day 1", completed: 5 },
  { day: "Day 2", completed: 8 },
  { day: "Day 3", completed: 3 },
  { day: "Day 4", completed: 6 },
  // Add more data as needed
];

const labels = taskData.map((data) => data.day);
const data = taskData.map((data) => data.completed);

const barColors = [
  "rgba(75, 192, 192, 0.2)",
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  // Add more colors as needed
];

const borderColor = "rgba(75, 192, 192, 1)";

const ctx = document.getElementById("task-chart").getContext("2d");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Tasks Completed",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
  },
});
