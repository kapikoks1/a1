document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const taskList = document.getElementById("taskList");
    const searchInput = document.getElementById("search");

    // Wczytanie zadań z Local Storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Funkcja formatująca datę w formacie dd.mm.rrrr, hh:mm
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year}, ${hours}:${minutes}`; // Format dd.mm.rrrr, hh:mm
    }

    // Funkcja dodająca zadania do listy
    function addTask(task) {
        const li = document.createElement("li");

        // Sprawdzenie, czy data istnieje, aby dodać separator
        const datePart = task.date ? `<span class="task-date" style="text-decoration: ${task.completed ? 'line-through' : 'none'}; opacity: ${task.completed ? '0.4' : '1'};"> | ${task.date}</span>` : '';

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text" style="text-decoration: ${task.completed ? 'line-through' : 'none'}; opacity: ${task.completed ? '0.4' : '1'};">${task.text}</span>${datePart}
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        taskList.appendChild(li);
    
        // Obsługa zmiany stanu checkboxa
        li.querySelector('.task-checkbox').addEventListener("change", function () {
            task.completed = this.checked; // Zmiana statusu ukończenia
            const taskTextElement = li.querySelector('.task-text');
            const taskDateElement = li.querySelector('.task-date');

            // Przekreślenie tekstu i daty
            taskTextElement.style.textDecoration = task.completed ? 'line-through' : 'none'; 
            taskTextElement.style.opacity = task.completed ? '0.4' : '1'; 
            if (taskDateElement) {
                taskDateElement.style.textDecoration = task.completed ? 'line-through' : 'none'; 
                taskDateElement.style.opacity = task.completed ? '0.4' : '1'; 
            }
            saveTasks(); // Zapisz zmiany
        });

        // Obsługa kliknięcia - edycja tekstu zadania
        li.querySelector('.task-text').addEventListener("click", function () {
            const newText = prompt("Edytuj zadanie:", task.text);
            if (newText && newText.length >= 3 && newText.length <= 255) {
                task.text = newText;
                li.querySelector(".task-text").textContent = newText; // Zaktualizuj tylko tekst zadania
                li.querySelector(".task-date").innerHTML = datePart; // Zaktualizuj datę
                saveTasks();
            }
        });
    
        // Obsługa kliknięcia - edycja daty
        if (task.date) {
            li.querySelector('.task-date').addEventListener("click", function () {
                const newDateString = prompt("Edytuj datę (format: dd.mm.rrrr, hh:mm):", task.date);
                if (newDateString) {
                    const newDate = new Date(newDateString.split(",")[0].trim().split(".").reverse().join("-") + "T" + newDateString.split(",")[1].trim());
                    if (!isNaN(newDate)) {
                        task.date = formatDate(newDate);
                        li.querySelector(".task-date").innerHTML = ` | ${task.date}`; // Zaktualizuj datę
                        saveTasks();
                    } else {
                        alert("Nieprawidłowy format daty. Użyj formatu dd.mm.rrrr, hh:mm.");
                    }
                }
            });
        }

        // Obsługa usuwania zadania
        li.querySelector(".delete-btn").addEventListener("click", function () {
            tasks = tasks.filter(t => t !== task);
            li.remove();
            saveTasks();
        });
    }
    
    // Funkcja zapisywania zadań w Local Storage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Inicjalne załadowanie zadań
    tasks.forEach(task => {
        task.completed = task.completed || false; // Ustawienie statusu ukończenia
        addTask(task);
    });

    // Dodawanie nowego zadania
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const taskDateValue = taskDate.value;

        // Walidacja zadania
        if (taskText.length < 3 || taskText.length > 255) {
            alert("Zadanie musi mieć od 3 do 255 znaków.");
            return;
        }

        const currentDate = new Date();
        const enteredDate = taskDateValue ? new Date(taskDateValue) : null;

        if (enteredDate && enteredDate <= currentDate) {
            alert("Data musi być w przyszłości.");
            return;
        }

        // Sformatowanie daty przed dodaniem zadania
        const formattedDate = taskDateValue ? formatDate(taskDateValue) : null;
        const newTask = { text: taskText, date: formattedDate, completed: false }; // Użycie sformatowanej daty
        tasks.push(newTask);
        addTask(newTask);
        saveTasks();

        taskInput.value = "";
        taskDate.value = "";
    });

    // Wyszukiwanie zadań
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const allTasks = taskList.querySelectorAll("li");

        allTasks.forEach(li => {
            const taskText = li.querySelector(".task-text").textContent.toLowerCase();
            if (taskText.includes(query)) {
                li.style.display = "block";

                // Wyróżnianie frazy
                const regex = new RegExp(`(${query})`, "gi");
                li.querySelector(".task-text").innerHTML = taskText.replace(regex, `<mark>$1</mark>`);
            } else {
                li.style.display = "none";
            }
        });
    });
});
