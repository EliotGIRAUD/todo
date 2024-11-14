<script>
export default {
    data() {
        return {
            newTask: {
                title: '',
                description: '',
                due_date: '',
                participant: '',
                typeId: null
            },
            tasks: {
                todo: [],
                inProgress: [],
                done: []
            },
            draggedTask: null,
            editingTask: null,
            participants: [],
            taskTypes: []
        };
    },
    methods: {
        addTask() {
            if (this.newTask.title.trim() !== '') {
                const newTask = {
                    ...this.newTask,
                    id: Date.now(),
                    createdAt: new Date().toISOString().slice(0, 10),
                    updatedAt: new Date().toISOString().slice(0, 10),
                    status: 'todo',
                    type: this.getTaskTypeLabel(this.newTask.typeId),
                };
                this.tasks.todo.push(newTask);
                this.saveTasks();
                this.resetNewTask();
            }
        },
        resetNewTask() {
            this.newTask = {
                title: '',
                description: '',
                participant: '',
                due_date: '',
                typeId: null
            };
            this.editingTask = null;
        },
        editTask(task) {
            this.newTask = { ...task };
            this.editingTask = task;
        },
        updateTask() {
            if (this.editingTask) {
                Object.assign(this.editingTask, this.newTask, {
                    updatedAt: new Date().toISOString().slice(0, 10)
                });
                this.editingTask.type = this.getTaskTypeLabel(this.newTask.typeId);
                this.saveTasks();
                this.resetNewTask();
            }
        },
        deleteTask(task) {
            this.removeTask(task);
            this.saveTasks();
        },
        dragStart(task) {
            this.draggedTask = task;
        },
        dropTask(event, targetList) {
            if (this.draggedTask) {
                this.removeTask(this.draggedTask);
                this.draggedTask.status = targetList;
                this.tasks[targetList].push(this.draggedTask);
                this.saveTasks();
                this.draggedTask = null;
            }
        },
        removeTask(task) {
            Object.keys(this.tasks).forEach(list => {
                this.tasks[list] = this.tasks[list].filter(t => t.id !== task.id);
            });
        },
        saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            localStorage.setItem('participants', JSON.stringify(this.participants));
            localStorage.setItem('taskTypes', JSON.stringify(this.taskTypes));
        },
        loadTasks() {
            const storedTasks = localStorage.getItem('tasks');
            const storedParticipants = localStorage.getItem('participants');
            const storedTypes = localStorage.getItem('taskTypes');
            if (storedTasks) this.tasks = JSON.parse(storedTasks);
            if (storedParticipants) this.participants = JSON.parse(storedParticipants);
            if (storedTypes) this.taskTypes = JSON.parse(storedTypes);
        },
        addParticipant() {
            const newParticipant = prompt("Entrez le nom du participant :");
            if (newParticipant && !this.participants.includes(newParticipant)) {
                this.participants.push(newParticipant);
                this.saveTasks();
            }
        },
        removeParticipant(index) {
            this.participants.splice(index, 1);
            this.saveTasks();
        },
        addTaskType() {
            const newType = prompt("Entrez le type de tâche :");
            if (newType && !this.taskTypes.includes(newType)) {
                this.taskTypes.push(newType);
                this.saveTasks();
            }
        },
        getTaskTypeLabel(typeId) {
            return this.taskTypes[typeId] || '';
        },
        togglePriority(task) {
            const priorities = ['faible', 'moyenne', 'élevée'];
            const currentPriorityIndex = priorities.indexOf(task.priority);
            const nextPriority = priorities[(currentPriorityIndex + 1) % priorities.length];
            task.priority = nextPriority;
            this.saveTasks();
        }
    },
    mounted() {
        this.loadTasks();
    }
};
</script>

<template>
    <div class="todo-board">
        <form @submit.prevent="editingTask ? updateTask() : addTask()" class="task-form">
            <input v-model="newTask.title" placeholder="Titre de la tâche" required />
            <textarea v-model="newTask.description" placeholder="Description"></textarea>
            <input v-model="newTask.due_date" type="date" placeholder="Date d'échéance" />
            <div class="select-group">
                <select v-model="newTask.participant" required>
                    <option value="" disabled>Choisissez un participant</option>
                    <option v-for="participant in participants" :key="participant" :value="participant">{{ participant }}</option>
                </select>
                <button type="button" @click="addParticipant">+ Ajouter un participant</button>
            </div>

            <div class="select-group">
                <select v-model="newTask.typeId" required>
                    <option value="" disabled>Choisissez un type de tâche</option>
                    <option v-for="(type, index) in taskTypes" :key="index" :value="index">{{ type }}</option>
                </select>
                <button type="button" @click="addTaskType">+ Ajouter un type</button>
            </div>
            <button type="submit">{{ editingTask ? 'Mettre à jour' : 'Ajouter la tâche' }}</button>
        </form>
        <div class="columns">
            <div class="column" @dragover.prevent @drop="dropTask($event, 'todo')">
                <h2>À faire</h2>
                <div v-for="task in tasks.todo" :key="task.id" :draggable="true" @dragstart="dragStart(task)" class="task" :class="{ 'task-todo': task.status === 'todo' }">
                    <div class="task">
                        <div class="task-header">
                            <h3 class="title">{{ task.title }}</h3>
                            <p class="type">{{ task.type }}</p>
                        </div>
                        <p class="description">{{ task.description }}</p>
                        <div class="task-details">
                            <p class="participant"><strong>Participant :</strong> {{ task.participant }}</p>
                            <div class="dates">
                                <p class="created"><strong>Créée le :</strong> {{ task.createdAt }}</p>
                                <p class="date"><strong>Échéance :</strong> {{ task.due_date }}</p>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button @click="editTask(task)">Modifier</button>
                            <button @click="togglePriority(task)" :class="task.priority">Priorité : {{ task.priority }}</button>
                            <button @click="deleteTask(task)">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column" @dragover.prevent @drop="dropTask($event, 'inProgress')">
                <h2>En cours</h2>
                <div v-for="task in tasks.inProgress" :key="task.id" :draggable="true" @dragstart="dragStart(task)" class="task" :class="{ 'task-in-progress': task.status === 'inProgress' }">
                    <div class="task">
                        <div class="task-header">
                            <h3 class="title">{{ task.title }}</h3>
                            <p class="type">{{ task.type }}</p>
                        </div>
                        <p class="description">{{ task.description }}</p>
                        <div class="task-details">
                            <p class="participant"><strong>Participant :</strong> {{ task.participant }}</p>
                            <div class="dates">
                                <p class="created"><strong>Créée le :</strong> {{ task.createdAt }}</p>
                                <p class="date"><strong>Échéance :</strong> {{ task.due_date }}</p>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button @click="editTask(task)">Modifier</button>
                            <button @click="togglePriority(task)" :class="task.priority">Priorité : {{ task.priority }}</button>
                            <button @click="deleteTask(task)">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column" @dragover.prevent @drop="dropTask($event, 'done')">
                <div class="done-title">
                    <h2>Terminé</h2>
                </div>
                <div v-for="task in tasks.done" :key="task.id" :draggable="true" @dragstart="dragStart(task)" class="task" :class="{ 'task-done': task.status === 'done' }">
                    <div class="task">
                        <div class="task-header">
                            <h3 class="title">{{ task.title }}</h3>
                            <p class="type">{{ task.type }}</p>
                        </div>
                        <p class="description">{{ task.description }}</p>
                        <div class="task-details">
                            <p class="participant"><strong>Participant :</strong> {{ task.participant }}</p>
                            <div class="dates">
                                <p class="created"><strong>Créée le :</strong> {{ task.createdAt }}</p>
                                <p class="date"><strong>Échéance :</strong> {{ task.due_date }}</p>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button @click="editTask(task)">Modifier</button>
                            <button @click="togglePriority(task)" :class="task.priority">Priorité : {{ task.priority }}</button>
                            <button @click="deleteTask(task)">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.todo-board {
    font-family: 'Arial', sans-serif;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.task-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-form input,
.task-form select,
.task-form textarea {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 1rem;
    width: 100%;
}

.task-form button {
    padding: 10px 20px;
    background-color: #5c6bc0;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.task-form button:hover {
    background-color: #3f51b5;
}

.participant-list {
    margin-top: 15px;
}

.participant-list ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.participant-list li {
    background-color: #e3f2fd;
    padding: 10px 20px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    white-space: nowrap;
}

.participant-list button {
    margin-left: 10px;
    background-color: #ff3d00;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.8rem;
}

.participant-list button:hover {
    background-color: #d32f2f;
}

.columns {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 20px;
    flex-wrap: wrap;
}

.column {
    width: 32%;
    padding: 15px;
    background: #f1f1f1;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.column h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
}

.task {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding: 15px;
    display: flex;
    flex-direction: column;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.task .title {
    font-size: 1.2rem;
    margin: 0;
}

.task .type {
    background-color: #8e24aa;
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
}

.task-details {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #666;
}

.task-details .participant {
    margin-bottom: 5px;
}

.task-details .dates {
    display: flex;
    justify-content: space-between;
}

.task-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.task-actions button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin: 0 5px;
}

.task-actions button:hover {
    background-color: #607d8b;
    color: white;
}

.task-actions button:hover {
    background-color: #607d8b;
    color: white;
}

.task-todo {
    background-color: #ffcccc;
}

.task-in-progress {
    background-color: #fff4b3;
}

.task-done {
    background-color: #ccffcc;
    text-decoration: line-through;
    color: #777;
}

.task-actions button:first-of-type {
    background-color: #5bc0de;
}

.task-actions button:last-of-type {
    background-color: #d9534f;
}

.task-actions button.faible {
    background-color: #007bff;
}

.task-actions button.moyenne {
    background-color: #FFCC00;
}

.task-actions button.élevée {
    background-color: red;
}

@media (max-width: 1024px) {
    .column {
        width: 48%;
    }
}

@media (max-width: 768px) {
    .columns {
        flex-direction: column;
        gap: 10px;
    }

    .column {
        width: 100%;
    }

    .task-form {
        width: 100%;
    }
}
</style>
