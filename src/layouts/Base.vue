<script setup lang="ts"></script>

<template>
    <header class="bg-primary px-6 py-8 lg:px-52 lg:py-9 sticky top-0">
        <h1
            class="text-white font-bold text-2xl not-italic uppercase antialiased"
            data-cy="header-title"
        >
            TO DO LIST APP
        </h1>
    </header>

    <main class="px-6 py-8 lg:px-52 lg:py-9">
        <router-view></router-view>
    </main>
</template>

<style scoped></style>
