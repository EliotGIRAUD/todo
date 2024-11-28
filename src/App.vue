<script>
import TodoList from './components/TodoList.vue';
import ReviewTasks from './components/ReviewTasks.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: TodoList },
    { path: '/review', component: ReviewTasks }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default {
    components: {
        TodoList,
        ReviewTasks
    },
    router
};
</script>

<template>
    <div id="app" class="min-h-screen flex flex-col bg-base-100">
        <nav class="navbar bg-primary text-primary-content">
            <div class="container mx-auto flex justify-between items-center">
                <ul class="menu menu-horizontal p-0">
                    <li><router-link to="/" class="text-white hover:text-blue-200">Ma Todo Liste</router-link></li>
                    <li><router-link to="/review" class="text-white hover:text-blue-200">Revue des tâches terminées</router-link></li>
                </ul>
            </div>
        </nav>
        <div class="flex-grow flex justify-center items-center py-10">
            <div class="w-full max-w-4xl p-6 bg-white shadow-xl rounded-lg">
                <router-view />
            </div>
        </div>
        <footer class="footer bg-primary text-primary-content p-4">
            <div class="container mx-auto text-center">
                <p>© 2023 Ma Todo Liste</p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
html, body {
    height: 100%;
    margin: 0;
}

#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

footer {
    margin-top: auto;
    padding: 1rem;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.flex-grow {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
