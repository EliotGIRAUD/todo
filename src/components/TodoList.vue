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
        addTaskType() {
            const newType = prompt("Entrez le type de tâche :");
            if (newType && !this.taskTypes.includes(newType)) {
                this.taskTypes.push(newType);
                this.saveTasks();
            }
        },
        getTaskTypeLabel(typeId) {
            return this.taskTypes[typeId] || '';
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
                <div
                v-for="task in tasks.todo"
                :key="task.id"
                :draggable="true"
                @dragstart="dragStart(task)"
                class="task"
                :class="{ 'task-todo': task.status === 'todo' }"
                >
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
                            <button @click="deleteTask(task)">Supprimer</button>
                        </div>
                    </div>

                </div>
            </div>

            <div class="column" @dragover.prevent @drop="dropTask($event, 'inProgress')">
                <h2>En cours</h2>
                <div
                v-for="task in tasks.inProgress"
                :key="task.id"
                :draggable="true"
                @dragstart="dragStart(task)"
                class="task"
                :class="{ 'task-in-progress': task.status === 'inProgress' }"
                >
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
                            <button @click="deleteTask(task)">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="column" @dragover.prevent @drop="dropTask($event, 'done')">
                <div class="done-title">
                    <h2>Terminé</h2>
                </div>
                <div
                v-for="task in tasks.done"
                :key="task.id"
                :draggable="true"
                @dragstart="dragStart(task)"
                class="task"
                :class="{ 'task-done': task.status === 'done' }"
                >
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
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 10px;
}

.columns {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

.column {
    flex: 1;
    padding: 10px;
    background: #494949;
    border-radius: 5px;
    min-width: 250px;
    max-width: 100%;
    box-sizing: border-box;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.column h2 {
    text-align: center;
    color: white;
}

.task {
    padding: 12px;
    margin: 8px 0;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.task-header .title {
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
}

.task-header .type {
    font-size: 0.9em;
    padding: 2px 8px;
    background-color: #d1e8ff;
    color: #005b99;
    border-radius: 5px;
}

.task-details {
    font-size: 0.9em;
    color: #666;
    margin-top: 10px;
    padding: 8px;
    background-color: #f0f0f0;
    border-radius: 5px;
}

.task-details .participant {
    margin-bottom: 5px;
}

.task-details .dates {
    display: flex;
    justify-content: space-between;
}

.description {
    font-size: 0.95em;
    color: #555;
    margin-bottom: 10px;
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

.task-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 20px 0;
    width: 100%;
}

.task-form input,
.task-form textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.task-form button {
    align-self: flex-start;
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.select-group {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.select-group select {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.select-group button {
    flex-shrink: 0;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
}


.task-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.task-actions button {
    margin-right: 5px;
    padding: 4px 10px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85em;
}

.task-actions button:first-of-type {
    background-color: #5bc0de;
}

.task-actions button:last-of-type {
    background-color: #d9534f;
}

@media (max-width: 768px) {
    .columns {
        flex-direction: column;
        gap: 10px;
    }

    .column {
        width: 100%;
        min-width: auto;
    }
}

</style>
