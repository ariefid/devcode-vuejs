<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
    message: {
        type: String,
        default: "New Task",
    },
});

const emit = defineEmits(["whenSubmit"]);

const isModalOpen = ref(false);

const toogleModal = () => {
    isModalOpen.value = !isModalOpen.value;
    return;
};
defineExpose({ toogleModal });
</script>

<template>
    <!-- Main modal -->
    <div
        v-show="isModalOpen"
        class="overflow-y-auto bg-gray-900 bg-opacity-40 overflow-x-hidden flex justify-center items-center fixed z-50 inset-0 h-modal w-full"
        @click.self="toogleModal()"
    >
        <div class="relative p-4 w-full max-w-xl h-auto md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow">
                <!-- Modal body -->
                <form
                    autocomplete="off"
                    method="POST"
                    @submit.prevent="emit('whenSubmit')"
                >
                    <div class="p-8 flex flex-col gap-7 items-center">
                        <svg
                            width="84"
                            height="84"
                            viewBox="0 0 84 84"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M42 52.5V52.535M42 31.5V38.5V31.5Z"
                                stroke="#ED4C5C"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M17.5002 66.5012H66.5002C67.6423 66.4932 68.765 66.2059 69.7705 65.6643C70.7761 65.1227 71.6338 64.3433 72.2689 63.3941C72.904 62.4449 73.2972 61.3546 73.4142 60.2186C73.5312 59.0825 73.3685 57.935 72.9402 56.8762L48.0902 14.0012C47.4848 12.9071 46.5975 11.9952 45.5203 11.3601C44.4432 10.725 43.2156 10.3901 41.9652 10.3901C40.7148 10.3901 39.4872 10.725 38.41 11.3601C37.3329 11.9952 36.4455 12.9071 35.8402 14.0012L10.9902 56.8762C10.57 57.9108 10.4033 59.0308 10.5042 60.1428C10.6051 61.2549 10.9705 62.3266 11.57 63.2687C12.1694 64.2107 12.9856 64.9956 13.9502 65.558C14.9149 66.1203 16.0001 66.4438 17.1152 66.5012"
                                stroke="#ED4C5C"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>

                        <h1 class="text-center text-xl">
                            Apakah anda yakin untuk menghapus
                            <span class="font-extrabold"
                                >"{{ props.message }}"</span
                            >
                            ?
                        </h1>
                    </div>
                    <!-- Modal footer -->
                    <div class="flex justify-center p-6 gap-4">
                        <button
                            class="bg-gray-200 text-black font-black py-3 px-12 rounded-full text-md inline-flex"
                            type="button"
                            @click="toogleModal()"
                            data-cy="modal-delete-cancel-button"
                        >
                            Back
                        </button>
                        <button
                            class="bg-red-500 text-white font-bold py-3 px-12 rounded-full text-md inline-flex"
                            type="submit"
                            data-cy="modal-delete-confirm-button"
                        >
                            Hapus
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
