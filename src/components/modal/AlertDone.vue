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
        v-if="isModalOpen"
        class="overflow-y-auto bg-gray-900 bg-opacity-40 overflow-x-hidden flex justify-center items-center fixed z-50 inset-0 h-modal w-full"
        @click.self="toogleModal()"
    >
        <div class="relative p-4 w-full max-w-xl h-auto md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white shadow p-4">
                <!-- Modal body -->
                <div class="inline-flex items-center gap-4">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                            stroke="#00A790"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M12 8V12"
                            stroke="#00A790"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M12 16H12.01"
                            stroke="#00A790"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>

                    <span>Activity berhasil dihapus</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
