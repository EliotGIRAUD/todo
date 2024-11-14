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
    <div id="app">
        <nav class="nav">
            <router-link to="/">Ma Todo Liste</router-link>
            <router-link to="/review">Revue des tâches terminées</router-link>
        </nav>

        <div class="main-container">
            <router-view />
        </div>

        <footer class="footer">
            <p>© 2023 Ma Todo Liste</p>
        </footer>
    </div>
</template>


<style scoped>
#app {
    flex-direction: column;
    min-height: 100vh;
}

.title {
    text-align: center;
    margin-bottom: 100px;
}
.nav {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 10px;
    background-color: #333;
}

.nav a {
    color: white;
    text-decoration: none;
}

.nav a:hover {
    text-decoration: underline;
}

.main-container {
    flex-grow: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
	min-height: 100vh;
}

.footer {
    text-align: center;
    padding: 10px;
    background-color: #333;
    color: white;
    bottom: 0;
    width: 99%;
	padding: 10px;
	margin-top: 10px;
}
</style>
