import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../components/TodoList.vue';
import ReviewTasks from '../components/ReviewTasks.vue';

const routes = [
    { path: '/', component: TodoList },
    { path: '/review', component: ReviewTasks }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
