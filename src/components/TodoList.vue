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
    <div class="min-h-screen flex flex-col items-center justify-center bg-base-100 p-6">
        <div class="card bg-base-100 shadow-xl mb-6 w-full max-w-2xl">
            <div class="card-body">
                <h2 class="card-title text-center">Ajouter une nouvelle tâche</h2>
                <form
                    @submit.prevent="editingTask ? updateTask() : addTask()"
                    class="space-y-6"
                >
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        <div class="my-4">
                            <input
                                v-model="newTask.title"
                                type="text"
                                placeholder="Titre de la tâche"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div class="lg:col-span-2">
                            <textarea
                                v-model="newTask.description"
                                placeholder="Description de la tâche"
                                class="textarea textarea-bordered w-full"
                            ></textarea>
                        </div>

                        <div>
                            <input
                                v-model="newTask.due_date"
                                type="date"
                                class="input input-bordered w-full"
                            />
                        </div>

                        <div class="flex gap-2 items-center">
                            <select
                                v-model="newTask.participant"
                                class="select select-bordered w-full"
                                required
                            >
                                <option value="" disabled>Choisissez un participant</option>
                                <option
                                    v-for="participant in participants"
                                    :key="participant"
                                    :value="participant"
                                >
                                    {{ participant }}
                                </option>
                            </select>
                            <button
                                type="button"
                                @click="addParticipant"
                                class="btn btn-outline btn-sm"
                            >
                                + Participant
                            </button>
                        </div>

                        <div class="flex gap-2 items-center">
                            <select
                                v-model="newTask.typeId"
                                class="select select-bordered w-full"
                                required
                            >
                                <option value="" disabled>Choisissez un type de tâche</option>
                                <option
                                    v-for="(type, index) in taskTypes"
                                    :key="index"
                                    :value="index"
                                >
                                    {{ type }}
                                </option>
                            </select>
                            <button
                                type="button"
                                @click="addTaskType"
                                class="btn btn-outline btn-sm"
                            >
                                + Type
                            </button>
                        </div>
                    </div>

                    <div class="text-center">
                        <button
                            type="submit"
                            class="btn btn-primary mt-4"
                        >
                            {{ editingTask ? 'Mettre à jour' : 'Ajouter la tâche' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div class="tasks-container">
            <div class="task-column" @dragover.prevent @drop="dropTask($event, 'todo')">
                <h2 class="column-title">À faire</h2>
                <div
                    v-for="task in tasks.todo"
                    :key="task.id"
                    :draggable="true"
                    @dragstart="dragStart(task)"
                    class="task-item"
                >
                    <div
                        class="absolute top-2 right-2 px-2 py-1 rounded-full text-white text-xs font-bold"
                        :class="{
                            'bg-blue-500': task.type === 'Bug',
                            'bg-green-500': task.type === 'Feature',
                            'bg-yellow-500': task.type === 'Task'
                        }"
                    >
                        {{ task.type }}
                    </div>
                    <h3 class="text-lg font-semibold">{{ task.title }}</h3>
                    <p class="text-sm text-gray-700">{{ task.description }}</p>
                    <div class="task-details mt-2 text-xs text-gray-500">
                        <p><strong>Participant:</strong> {{ task.participant }}</p>
                        <p><strong>Créée le:</strong> {{ task.createdAt }} | <strong>Échéance:</strong> {{ task.due_date }}</p>
                    </div>
                    <div class="task-actions mt-4 flex justify-center space-x-3">
                        <button
                            @click="editTask(task)"
                            class="btn btn-sm btn-outline"
                        >
                            Modifier
                        </button>
                        <button
                            @click="togglePriority(task)"
                            :class="`btn btn-sm ${task.priority === 'faible' ? 'btn-info' : task.priority === 'moyenne' ? 'btn-warning' : 'btn-error'}`"
                        >
                            Priorité: {{ task.priority }}
                        </button>
                        <button
                            @click="deleteTask(task)"
                            class="btn btn-sm btn-error"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>

            <div class="task-column" @dragover.prevent @drop="dropTask($event, 'inProgress')">
                <h2 class="column-title">En cours</h2>
                <div
                    v-for="task in tasks.inProgress"
                    :key="task.id"
                    :draggable="true"
                    @dragstart="dragStart(task)"
                    class="task-item"
                >
                    <div
                        class="absolute top-2 right-2 px-2 py-1 rounded-full text-white text-xs font-bold"
                        :class="{
                            'bg-blue-500': task.type === 'Bug',
                            'bg-green-500': task.type === 'Feature',
                            'bg-yellow-500': task.type === 'Task'
                        }"
                    >
                        {{ task.type }}
                    </div>
                    <h3 class="text-lg font-semibold">{{ task.title }}</h3>
                    <p class="text-sm text-gray-700">{{ task.description }}</p>
                    <div class="task-details mt-2 text-xs text-gray-500">
                        <p><strong>Participant:</strong> {{ task.participant }}</p>
                        <p><strong>Créée le:</strong> {{ task.createdAt }} | <strong>Échéance:</strong> {{ task.due_date }}</p>
                    </div>
                    <div class="task-actions mt-4 flex justify-center space-x-3">
                        <button
                            @click="editTask(task)"
                            class="btn btn-sm btn-outline"
                        >
                            Modifier
                        </button>
                        <button
                            @click="togglePriority(task)"
                            :class="`btn btn-sm ${task.priority === 'faible' ? 'btn-info' : task.priority === 'moyenne' ? 'btn-warning' : 'btn-error'}`"
                        >
                            Priorité: {{ task.priority }}
                        </button>
                        <button
                            @click="deleteTask(task)"
                            class="btn btn-sm btn-error"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>

            <div class="task-column" @dragover.prevent @drop="dropTask($event, 'done')">
                <h2 class="column-title">Terminées</h2>
                <div
                    v-for="task in tasks.done"
                    :key="task.id"
                    :draggable="true"
                    @dragstart="dragStart(task)"
                    class="task-item"
                >
                    <div
                        class="absolute top-2 right-2 px-2 py-1 rounded-full text-white text-xs font-bold"
                        :class="{
                            'bg-blue-500': task.type === 'Bug',
                            'bg-green-500': task.type === 'Feature',
                            'bg-yellow-500': task.type === 'Task'
                        }"
                    >
                        {{ task.type }}
                    </div>
                    <h3 class="text-lg font-semibold">{{ task.title }}</h3>
                    <p class="text-sm text-gray-700">{{ task.description }}</p>
                    <div class="task-details mt-2 text-xs text-gray-500">
                        <p><strong>Participant:</strong> {{ task.participant }}</p>
                        <p><strong>Créée le:</strong> {{ task.createdAt }} | <strong>Échéance:</strong> {{ task.due_date }}</p>
                    </div>
                    <div class="task-actions mt-4 flex justify-center space-x-3">
                        <button
                            @click="editTask(task)"
                            class="btn btn-sm btn-outline"
                        >
                            Modifier
                        </button>
                        <button
                            @click="togglePriority(task)"
                            :class="`btn btn-sm ${task.priority === 'faible' ? 'btn-info' : task.priority === 'moyenne' ? 'btn-warning' : 'btn-error'}`"
                        >
                            Priorité: {{ task.priority }}
                        </button>
                        <button
                            @click="deleteTask(task)"
                            class="btn btn-sm btn-error"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tasks-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
}

.task-column {
    background-color: #f9fafb;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.column-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 15px;
    text-align: center;
}

.task-item {
    background-color: #ffffff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.task-item:hover {
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .tasks-container {
        grid-template-columns: 1fr;
    }
}
</style>
