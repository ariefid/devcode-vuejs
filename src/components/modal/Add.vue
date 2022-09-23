<script setup lang="ts">
import { ref, reactive } from "vue";

interface State {
    [key: string]: any;
}

const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    priority: {
        type: Object,
        default: { label: "Very High", value: "very-high", color: "red" },
    },
    isEdit: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["whenSubmit"]);

const state: State = reactive({
    title: "",
    priority: { label: "Very High", value: "very-high", color: "red" },
    isOptionsExpanded: false,
    options: [
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
    ],
});

const isModalOpen = ref(false);

const toogleModal = () => {
    isModalOpen.value = !isModalOpen.value;
    return;
};

const setState = () => {
    state.priority = props.priority;
    state.title = props.title;
};

const setOption = (option) => {
    state.priority = option;
    state.isOptionsExpanded = false;
};

defineExpose({ toogleModal, setState });
</script>

<template>
    <!-- Main modal -->
    <div
        v-show="isModalOpen"
        class="overflow-y-auto bg-gray-900 bg-opacity-40 overflow-x-hidden flex justify-center items-center fixed z-50 w-full inset-0 h-modal"
        @click.self="toogleModal()"
    >
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow">
                <!-- Modal header -->
                <div
                    class="flex justify-between items-start p-4 rounded-t border-b"
                >
                    <h1 class="text-xl font-semibold text-gray-900">
                        Tambah List Item
                    </h1>
                    <button
                        type="button"
                        @click="toogleModal()"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <svg
                            aria-hidden="true"
                            class="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form
                    autocomplete="off"
                    method="POST"
                    @submit.prevent="
                        emit('whenSubmit', { ...state, isEdit: props.isEdit })
                    "
                >
                    <div class="p-6 space-y-6">
                        <div class="flex flex-col gap-2 mb-2">
                            <label for="name" class="uppercase"
                                >Nama List Item</label
                            >
                            <input
                                required
                                type="text"
                                id="name"
                                placeholder="Tambahkan nama list item"
                                v-model="state.title"
                                data-cy="modal-add-name-input"
                            />
                        </div>
                        <div class="flex flex-col gap-2 mb-2">
                            <label for="priority" class="uppercase"
                                >Priority</label
                            >
                            <div class="relative text-lg">
                                <button
                                    class="flex items-center justify-between px-4 py-3 bg-white w-full border border-gray-400 rounded-md"
                                    @click="
                                        state.isOptionsExpanded =
                                            !state.isOptionsExpanded
                                    "
                                    @blur="state.isOptionsExpanded = false"
                                    type="button"
                                    data-cy="modal-add-priority-dropdown"
                                >
                                    <span
                                        class="text-gray-400 inline-flex items-center gap-3"
                                    >
                                        <div
                                            class="inline-flex rounded-full h-3 w-3"
                                            :class="{
                                                'bg-red-500':
                                                    state.priority.value ===
                                                    'very-high',
                                                'bg-orange-500':
                                                    state.priority.value ===
                                                    'high',
                                                'bg-cyan-500':
                                                    state.priority.value ===
                                                    'normal',
                                                'bg-purple-500':
                                                    state.priority.value ===
                                                    'very-low',
                                                'bg-sky-500':
                                                    state.priority.value ===
                                                    'low',
                                            }"
                                        ></div>
                                        {{ state.priority.label }}</span
                                    >
                                    <svg
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-4 w-4 transform transition-transform duration-200 ease-in-out"
                                        :class="
                                            state.isOptionsExpanded
                                                ? 'rotate-180'
                                                : 'rotate-0'
                                        "
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
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
                                            v-for="(
                                                option, index
                                            ) in state.options"
                                            :key="index"
                                            class="px-6 py-4 transition-colors duration-300 hover:bg-gray-200"
                                            @mousedown.prevent="
                                                setOption(option)
                                            "
                                            data-cy="modal-add-priority-item"
                                        >
                                            <div class="flex justify-between">
                                                <div
                                                    class="inline-flex rounded-full h-3 w-3"
                                                    :class="{
                                                        'bg-red-500':
                                                            option.value ===
                                                            'very-high',
                                                        'bg-orange-500':
                                                            option.value ===
                                                            'high',
                                                        'bg-cyan-500':
                                                            option.value ===
                                                            'normal',
                                                        'bg-purple-500':
                                                            option.value ===
                                                            'very-low',
                                                        'bg-sky-500':
                                                            option.value ===
                                                            'low',
                                                    }"
                                                ></div>
                                                <div>
                                                    {{ option.label }}
                                                </div>
                                                <div>
                                                    {{
                                                        option.value ===
                                                        state.priority.value
                                                            ? "&#10003;"
                                                            : ""
                                                    }}
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </transition>
                            </div>
                        </div>
                    </div>
                    <!-- Modal footer -->
                    <div
                        class="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200"
                    >
                        <button
                            class="bg-primary text-white font-bold py-3 px-7 rounded-full text-md inline-flex"
                            :class="{ 'bg-opacity-70': state.title === '' }"
                            :disabled="state.title === ''"
                            type="submit"
                            data-cy="modal-add-save-button"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
input[type="text"] {
    border: 1px solid lightgrey;
    padding: 10px;
    border-radius: 5px;
}

input:focus {
    outline: none !important;
    border: 2px solid #16abf8;
    box-shadow: 0 0 5px #16abf8;
}
</style>
