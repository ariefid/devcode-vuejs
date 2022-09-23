import { createRouter, createWebHistory } from "vue-router";

const appName = import.meta.env.VITE_APP_NAME;

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: () => import("@/layouts/Base.vue"),
            children: [
                {
                    path: "",
                    name: "Index",
                    meta: {
                        title: "Dashboard",
                    },
                    component: () => import("@/pages/index.vue"),
                },
                {
                    path: "detail/:id",
                    name: "Detail",
                    meta: {
                        title: "Detail",
                    },
                    component: () => import("@/pages/Detail.vue"),
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = to?.meta?.title
        ? `${appName} - ${to.meta.title}`
        : appName;
    next();
});

export default router;
