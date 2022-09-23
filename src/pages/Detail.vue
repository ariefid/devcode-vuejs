<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import EmptyList from "@/components/EmptyList.vue";
import AlertDone from "@/components/modal/AlertDone.vue";
import ModalAdd from "@/components/modal/Add.vue";
import ModalDelete from "@/components/modal/Delete.vue";

const router = useRouter();
const routes = useRoute();
const modalAdd = ref();
const modalDelete = ref();
const alertDone = ref();
const apiUrl = import.meta.env.VITE_API_URL;

interface State {
    [key: string]: any;
}

const todo_items = computed(() => {
    let items = state.dataDetail?.todo_items;

    function compare(a, b, sortedKey, sortedType) {
        if (sortedType === "desc") {
            if (a[sortedKey] < b[sortedKey]) {
                return -1;
            }
            if (a[sortedKey] > b[sortedKey]) {
                return 1;
            }
            return 0;
        }
        if (a[sortedKey] > b[sortedKey]) {
            return -1;
        }
        if (a[sortedKey] < b[sortedKey]) {
            return 1;
        }
        return 0;
    }

    if (state.selectedOption === "terbaru")
        items.sort((a, b) => compare(a, b, "id", "asc"));
    if (state.selectedOption === "terlama")
        items = items.sort((a, b) => compare(a, b, "id", "desc"));
    if (state.selectedOption === "a_z")
        items = items.sort((a, b) => compare(a, b, "title", "desc"));
    if (state.selectedOption === "z_a")
        items = items.sort((a, b) => compare(a, b, "title", "asc"));
    if (state.selectedOption === "belum_selesai")
        items = items.sort((a, b) => compare(a, b, "is_active", "asc"));

    return items;
});

const getDetail = async () => {
    state.showLoading = true;
    const id = routes.params.id;
    const resp = await fetch(`${apiUrl}/activity-groups/${id}`, {
        method: "GET",
    });

    const res = await resp.json();

    state.dataDetail = res;
    state.showLoading = false;
};

onBeforeMount(async () => {
    await getDetail();
});

const state: State = reactive({
    dataDetail: {},
    titleForModalDelete: "",
    idItem: "",
    titleForEdit: "",
    priorityForEdit: {
        label: "Very High",
        value: "very-high",
        color: "red",
    },
    isEdit: false,
    showLoading: false,
    isOptionsExpanded: false,
    selectedOption: "terbaru",
    options: [
        {
            label: "Terbaru",
            value: "terbaru",
            icon: "terbaru",
        },
        {
            label: "Terlama",
            value: "terlama",
            icon: "terlama",
        },
        {
            label: "A-Z",
            value: "a_z",
            icon: "A-Z",
        },
        {
            label: "Z-A",
            value: "z_a",
            icon: "Z-A",
        },
        {
            label: "Belum Selesai",
            value: "belum_selesai",
            icon: "belum-selesai",
        },
    ],
});

const showModalAdd = (value = null) => {
    const listPriority = [
        {
            label: "Very High",
            value: "very-high",
            color: "red",
        },
        {
            label: "High",
            value: "high",
            color: "red",
        },
        {
            label: "Medium",
            value: "normal",
            color: "red",
        },
        {
            label: "Very Low",
            value: "very-low",
            color: "red",
        },
        {
            label: "Low",
            value: "low",
            color: "red",
        },
    ];

    const priority = listPriority.find((val) =>
        value !== null ? val.value === value?.priority : "very-high"
    );
    state.titleForEdit = value !== null ? value?.title ?? "" : "";
    state.priorityForEdit = priority;
    state.idItem = value !== null ? value?.id ?? "" : "";
    state.isEdit = value !== null ? true : false;
    setTimeout(() => {
        modalAdd.value.setState();
        modalAdd.value.toogleModal();
    }, 100);
    return;
};

const handleInputTitle = (value) => {
    state.dataDetail.title = value.target.innerText;
    return;
};

const focusToTitle = () => {
    document.getElementById("detail-title").focus();
    return;
};

const editTitle = async () => {
    const req = {
        title: state.dataDetail.title,
    };
    await fetch(`${apiUrl}/activity-groups/${state.dataDetail.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
    });

    return;
};

const createOrEditItem = (value) => {
    if (value.isEdit) {
        editItem(value);
        return;
    }

    createItem(value);
    return;
};

const editItem = async (value) => {
    const { title, priority } = value;
    const req = {
        title,
        priority: priority.value,
    };
    await fetch(`${apiUrl}/todo-items/${state.idItem}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
    });
    await getDetail();
    modalAdd.value.toogleModal();

    return;
};

const createItem = async (value) => {
    const activity_group_id = routes.params.id;
    const { title, priority } = value;
    const req = {
        activity_group_id,
        title,
        priority: priority.value,
    };
    const resp = await fetch(`${apiUrl}/todo-items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
    });
    const res = await resp.json();

    state.dataDetail.todo_items.push(res);
    modalAdd.value.toogleModal();

    return;
};

const showModalDelete = (title, id) => {
    state.titleForModalDelete = title;
    state.idItem = id;
    setTimeout(() => {
        modalDelete.value.toogleModal();
    }, 100);
    return;
};

const deleteList = async (id) => {
    const resp = await fetch(`${apiUrl}/todo-items/${id}`, {
        method: "DELETE",
    });
    const res = await resp.json();

    state.dataDetail.todo_items = state.dataDetail.todo_items.filter(
        (val) => val.id !== id
    );
    modalDelete.value.toogleModal();
    alertDone.value.toogleModal();
};

const setStatusItem = async (id, is_active) => {
    const req = {
        is_active: is_active === 0 ? 1 : 0,
    };
    await fetch(`${apiUrl}/todo-items/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
    });

    await getDetail();

    return;
};

const setOption = (option) => {
    state.selectedOption = option?.value;
    state.isOptionsExpanded = false;
};
</script>

<template>
    <header class="flex flex-wrap justify-between gap-2 items-center">
        <div class="inline-flex items-center gap-2">
            <button type="button" @click="router.push('/')">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.66675 16L14.6667 24"
                        stroke="#111111"
                        stroke-width="5"
                        stroke-linecap="square"
                    />
                    <path
                        d="M6.66675 16L14.6667 8"
                        stroke="#111111"
                        stroke-width="5"
                        stroke-linecap="square"
                    />
                </svg>
            </button>
            <h1
                class="text-3xl font-bold not-italic"
                data-cy="todo-title"
                id="detail-title"
                contenteditable="true"
                @blur="editTitle()"
                @input="handleInputTitle"
            >
                {{ state.dataDetail.title }}
            </h1>
            <button type="button" @click="focusToTitle()">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 19.9998H8L18.5 9.49981C19.0304 8.96938 19.3284 8.24996 19.3284 7.49981C19.3284 6.74967 19.0304 6.03025 18.5 5.49981C17.9696 4.96938 17.2501 4.67139 16.5 4.67139C15.7499 4.67139 15.0304 4.96938 14.5 5.49981L4 15.9998V19.9998Z"
                        stroke="#A4A4A4"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M13.5 6.49982L17.5 10.4998"
                        stroke="#A4A4A4"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>

        <div class="inline-flex items-center gap-4">
            <div class="relative text-lg">
                <button
                    class="p-3.5 rounded-full border-2 border-gray-300"
                    type="button"
                    data-cy="todo-sort-button"
                    @click="state.isOptionsExpanded = !state.isOptionsExpanded"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 9L7 5M7 5L11 9M7 5V19"
                            stroke="#888888"
                            stroke-width="1.5"
                            stroke-linecap="square"
                        />
                        <path
                            d="M21 15L17 19M17 19L13 15M17 19V5"
                            stroke="#888888"
                            stroke-width="1.5"
                            stroke-linecap="square"
                        />
                    </svg>
                </button>
                <transition
                    enter-active-class="transform transition duration-500 ease-custom"
                    enter-class="-translate-y-1/2 scale-y-0 opacity-0"
                    enter-to-class="translate-y-0 scale-y-100 opacity-100"
                    leave-active-class="transform transition duration-300 ease-custom"
                    leave-class="translate-y-0 scale-y-100 opacity-100"
                    leave-to-class="-translate-y-1/2 scale-y-0 opacity-0"
                >
                    <ul
                        v-show="state.isOptionsExpanded"
                        class="absolute left-0 right-0 mb-4 mt-2 bg-white divide-y rounded-lg shadow-lg overflow-hidden w-52"
                    >
                        <li
                            v-for="(option, index) in state.options"
                            :key="index"
                            class="px-6 py-4 transition-colors duration-300 hover:bg-gray-200"
                            @mousedown.prevent="setOption(option)"
                            data-cy="sort-selection"
                        >
                            <div class="flex justify-between">
                                <div>
                                    {{ option.label }}
                                </div>
                                <div>
                                    {{
                                        option.value === state.selectedOption
                                            ? "&#10003;"
                                            : ""
                                    }}
                                </div>
                            </div>
                        </li>
                    </ul>
                </transition>
            </div>

            <button
                class="bg-primary text-white font-bold py-3.5 px-7 rounded-full text-lg inline-flex gap-1"
                type="button"
                @click="showModalAdd()"
                data-cy="todo-add-button"
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
        </div>
    </header>
    <section class="mt-7 lg:mt-13">
        <div
            v-if="state.showLoading"
            class="flex justify-center items-center mt-64 lg:mt-40"
        >
            <div class="loader"></div>
        </div>
        <EmptyList
            data-cy="todo-empty-state"
            @click="showModalAdd()"
            is-detail
            v-else-if="state.dataDetail?.todo_items?.length === 0"
        />
        <div v-else class="py-1" v-for="item in todo_items" :key="item.data">
            <div
                class="p-6 w-full h-20 bg-white rounded-xl border border-gray-200 shadow-xl inline-flex flex-col"
            >
                <div class="flex flex-row justify-between items-center">
                    <div class="inline-flex items-center gap-4">
                        <input
                            data-cy="todo-item-checkbox"
                            type="checkbox"
                            :name="'checkbox-' + item.id"
                            :id="'checkbox-' + item.id"
                            class="w-6 h-6 text-primary rounded focus:ring-primary focus:ring-2"
                            :checked="item.is_active === 0"
                            @click="setStatusItem(item.id, item.is_active)"
                        />
                        <div
                            class="inline-flex rounded-full h-3 w-3"
                            :class="{
                                'bg-red-500': item.priority === 'very-high',
                                'bg-orange-500': item.priority === 'high',
                                'bg-cyan-500': item.priority === 'normal',
                                'bg-purple-500': item.priority === 'very-low',
                                'bg-sky-500': item.priority === 'low',
                            }"
                        ></div>
                        <p
                            class="text-md text-gray-700"
                            :class="{ 'line-through': item.is_active === 0 }"
                            data-cy="todo-item-title"
                        >
                            {{ item.title }}
                        </p>
                        <button type="button" @click="showModalAdd(item)">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 19.9998H8L18.5 9.49981C19.0304 8.96938 19.3284 8.24996 19.3284 7.49981C19.3284 6.74967 19.0304 6.03025 18.5 5.49981C17.9696 4.96938 17.2501 4.67139 16.5 4.67139C15.7499 4.67139 15.0304 4.96938 14.5 5.49981L4 15.9998V19.9998Z"
                                    stroke="#A4A4A4"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M13.5 6.49982L17.5 10.4998"
                                    stroke="#A4A4A4"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <button
                        type="button"
                        @click.prevent="showModalDelete(item.title, item.id)"
                        data-cy="todo-item-delete-button"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 7H20"
                                stroke="#888888"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M10 11V17"
                                stroke="#888888"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M14 11V17"
                                stroke="#888888"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7"
                                stroke="#888888"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7"
                                stroke="#888888"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>
    <div data-cy="modal-add">
        <ModalAdd
            ref="modalAdd"
            @when-submit="createOrEditItem"
            :title="state.titleForEdit"
            :priority="state.priorityForEdit"
            :is-edit="state.isEdit"
        />
    </div>
    <div data-cy="modal-delete">
        <ModalDelete
            ref="modalDelete"
            :message="state.titleForModalDelete"
            @when-submit="deleteList(state.idItem)"
        />
    </div>
    <div data-cy="modal-information">
        <AlertDone ref="alertDone" />
    </div>
</template>

<style scoped>
.ease-custom {
    transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
