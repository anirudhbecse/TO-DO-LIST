document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const personInput = document.getElementById('personInput');
    const durationInput = document.getElementById('durationInput');
    const dateInput = document.getElementById('dateInput');
    const addButton = document.getElementById('addButton');
    const clearButton = document.getElementById('clearButton');
    const taskList = document.getElementById('taskList');
    const averageTimeDisplay = document.getElementById('averageTimeDisplay');

    let tasks = [];
    let personTimes = {};

    // Load tasks from local storage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            tasks.forEach(task => {
                if (!personTimes[task.person]) {
                    personTimes[task.person] = { total: 0, count: 0 };
                }
                if (task.done) {
                    personTimes[task.person].total += task.duration;
                    personTimes[task.person].count += 1;
                }
            });
            renderTasks();
        }
    }

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${index + 1}. ${task.text} (Assigned to: ${task.person}, Duration: ${task.duration}, Date: ${task.date})</span>`;
            if (task.done) {
                li.classList.add('completed');
            }

            const doneButton = document.createElement('button');
            doneButton.textContent = task.done ? 'Undo' : 'Done';
            doneButton.onclick = () => markAsDone(index);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button');
            editButton.onclick = () => editTask(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = () => deleteTask(index);

            li.appendChild(doneButton);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
        updateAverageTimes();
        saveTasks();  // Save tasks after rendering
    }

    // Add task
    addButton.onclick = () => {
        const taskValue = taskInput.value.trim();
        const personValue = personInput.value.trim();
        const durationValue = durationInput.value.trim();
        const dateValue = dateInput.value;

        if (taskValue && personValue && durationValue && dateValue) {
            tasks.push({ text: taskValue, person: personValue, duration: parseFloat(durationValue), date: dateValue, done: false });
            taskInput.value = '';
            personInput.value = '';
            durationInput.value = '';
            dateInput.value = '';
            renderTasks();
        }
    };

    // Mark task as done
    function markAsDone(index) {
        const task = tasks[index];
        if (!task.done) {
            task.done = true;
            // Update person times
            if (!personTimes[task.person]) {
                personTimes[task.person] = { total: 0, count: 0 };
            }
            personTimes[task.person].total += task.duration;
            personTimes[task.person].count += 1;
        } else {
            task.done = false; // Toggle back
        }
        renderTasks();
    }

    // Edit task
    function editTask(index) {
        const newTask = prompt("Edit your task:", tasks[index].text);
        const newPerson = prompt("Edit person assigned:", tasks[index].person);
        const newDuration = prompt("Edit duration:", tasks[index].duration);
        const newDate = prompt("Edit date:", tasks[index].date);
        
        if (newTask !== null) {
            tasks[index].text = newTask;
            tasks[index].person = newPerson;
            tasks[index].duration = parseFloat(newDuration);
            tasks[index].date = newDate;
            renderTasks();
        }
    }

    // Delete task
    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // Clear all tasks
    clearButton.onclick = () => {
        tasks = [];
        personTimes = {};
        localStorage.removeItem('tasks'); // Clear local storage
        renderTasks();
    };

    // Update average times for each person
    function updateAverageTimes() {
        const averages = {};
        for (const person in personTimes) {
            if (personTimes[person].count > 0) {
                averages[person] = (personTimes[person].total / personTimes[person].count).toFixed(2);
            }
        }
        displayAverageTimes(averages);
    }

    // Display average times
    function displayAverageTimes(averages) {
        averageTimeDisplay.innerHTML = '<h2>Average Time Taken by Each Person:</h2>';
        for (const person in averages) {
            averageTimeDisplay.innerHTML += `<p>${person}: ${averages[person]} hours</p>`;
        }
    }

    // Load tasks when the page is loaded
    loadTasks();
});
