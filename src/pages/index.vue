<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import EmptyState from "@/components/EmptyList.vue";
import CardState from "@/components/CardList.vue";
import AlertDone from "@/components/modal/AlertDone.vue";
import ModalDelete from "@/components/modal/Delete.vue";

const modalDelete = ref();
const apiUrl = import.meta.env.VITE_API_URL;

onMounted(async () => {
    await getActivities();
});

const getActivities = async () => {
    state.showLoading = true;
    const resp = await fetch(
        `${apiUrl}/activity-groups?email=web.arief.id%40gmail.com`,
        {
            method: "GET",
        }
    );
    const res = await resp.json();

    state.dataList = res.data;
    state.showLoading = false;
    return;
};

const alertDone = ref();

const state = reactive({
    dataList: [],
    showLoading: false,
    idDelete: "",
    titleDelete: "",
});

const addNewList = async () => {
    const req = {
        title: "New Activity",
        email: "web.arief.id@gmail.com",
    };
    await fetch(`${apiUrl}/activity-groups`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
    });
    await getActivities();
    return;
};

const showModalDelete = (value) => {
    state.idDelete = value.id;
    state.titleDelete = value.title;
    modalDelete.value.toogleModal();
    return;
};

const deleteList = async (id) => {
    await fetch(`${apiUrl}/activity-groups/${id}`, {
        method: "DELETE",
    });
    await modalDelete.value.toogleModal();
    state.dataList = state.dataList.filter((val) => val.id !== id);
    alertDone.value.toogleModal();
};
</script>

<template>
    <header class="flex justify-between items-center">
        <h1 class="text-3xl font-bold not-italic" data-cy="activity-title">
            Activity
        </h1>

        <button
            class="bg-primary text-white font-bold py-3.5 px-7 rounded-full text-lg inline-flex gap-1"
            type="button"
            @click="addNewList()"
            data-cy="activity-add-button"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 4.99988V18.9999"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                />
                <path
                    d="M5 12H19"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                />
            </svg>
            Tambah
        </button>
    </header>
    <section class="mt-7 lg:mt-13">
        <div
            v-if="state.showLoading"
            class="flex justify-center items-center mt-64 lg:mt-40"
        >
            <div class="loader"></div>
        </div>
        <div
            data-cy="activity-empty-state"
            v-else-if="state.dataList.length === 0"
        >
            <EmptyState @click="addNewList()" />
        </div>
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-cy="activity-item"
            v-else
        >
            <CardState
                v-for="data in state.dataList"
                :key="data.id"
                :title="data.title"
                :date="data.created_at"
                :id="data.id"
                @when-delete="showModalDelete(data)"
            />
        </div>
    </section>

    <div data-cy="modal-delete">
        <ModalDelete
            ref="modalDelete"
            :message="state.titleDelete"
            @when-submit="deleteList(state.idDelete)"
        />
    </div>
    <div data-cy="modal-information">
        <AlertDone ref="alertDone" />
    </div>
</template>
