<script>
export default {
    data() {
        return {
            tasks: JSON.parse(localStorage.getItem('tasks')) || { done: [] }
        };
    },
    computed: {
        completedTasks() {
            return this.tasks.done;
        }
    },
    methods: {
        deleteTask(task) {
            this.tasks.done = this.tasks.done.filter(t => t.id !== task.id);
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }
};
</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-50">
        <div class="w-full max-w-3xl px-6 py-8">
            <h1 class="text-4xl font-bold text-center text-teal-600 mb-8 transform transition duration-300 hover:scale-105">
                Tâches Terminées
            </h1>
            <div v-if="completedTasks.length" class="space-y-6">
                <div
                    v-for="task in completedTasks"
                    :key="task.id"
                    class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    style="margin: 20px 0;"
                    id="card"
                >
                    <div class="flex justify-between items-center mb-4" style="margin-top: 10px;">
                        <h3 class="text-xl font-semibold text-gray-800">Titre : {{ task.title }}</h3>
                        <div class="text-xs bg-green-500 text-white px-3 py-1 rounded-full">
                            Priorité : {{ task.priority }}
                        </div>
                    </div>

                    <p class="text-sm text-gray-600 mb-4">Description : {{ task.description }}</p>

                    <div class="text-sm text-gray-500 mb-4">
                        <p><strong>Participant :</strong> {{ task.participant }}</p>
                        <p><strong>Échéance :</strong> {{ task.due_date }}</p>
                    </div>
                    <div class="text-right" style="margin-bottom: 10px;">
                        <button
                            @click="deleteTask(task)"
                            class="btn btn-sm btn-error"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-lg text-gray-500">
                <p>Aucune tâche terminée.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
body {
    background-color: #f9fafb;
}

h1 {
    font-family: 'Inter', sans-serif;
    text-align: center;
    margin: 20px 0;
}


#card {
    background-color: #1b4400;
    border-radius: 12px;
    border: 1px solid #51ff00;
    text-align: center;
}

#card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:hover {
    text-decoration: underline;
}

#card .text-xs {
    background-color: #38a169;
}

h1:hover {
    color: #00ac33;
    transition: color 0.5s ease;
}

#card .btn-error {
    background-color: #e53e3e;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

#card .btn-error:hover {
    background-color: #c53030;
}
</style>
