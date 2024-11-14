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
    }
};
</script>

<template>
    <div class="review-page">
        <h2>Revue des tâches terminées</h2>
        <div v-if="completedTasks.length">
            <div v-for="task in completedTasks" :key="task.id" class="task-done">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
                <p><strong>Participant :</strong> {{ task.participant }}</p>
                <p><strong>Échéance :</strong> {{ task.due_date }}</p>
            </div>
        </div>
        <div v-else>
            <p>Aucune tâche terminée.</p>
        </div>
    </div>
</template>

<style scoped>
.review-page {
    text-align: center;
}
.task-done {
    background-color: #ccffcc;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
}
</style>
