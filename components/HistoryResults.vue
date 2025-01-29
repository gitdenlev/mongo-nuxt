<template>
  <div class="flex items-center space-x-2 transition-all mt-4 text-lg">
    <Icon name="iconamoon:history-fill" size="20" />
    <span>History</span>
  </div>
  <div class="history-list">
    <div v-if="!isUserLoggedIn" class="text-left text-lg mt-4">
      <p>
        You are not <NuxtLink class="text-blue-500 hover:text-blue-400 hover:underline" to="/login">logged in</NuxtLink>. 
        <br>
        Changes
        will not be saved.
      </p>
    </div>
    <div
      v-else
      v-for="(result, index) in results"
      :key="index"
      class="relative"
    >
      <div
        class="cursor-pointer flex items-center justify-between transition-all mt-4 hover:bg-blue-500 hover:text-white rounded-md p-2 group"
      >
        {{ result }}
        <Icon
          @click.stop="toggleModal(index)"
          name="tabler:dots"
          size="20"
          class="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <Transition name="fade">
        <div
          v-if="activeModal === index"
          class="flex settings-modal absolute -right-40 top-0"
        >
          <div
            class="flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors w-full"
              @click="editResult(index)"
            >
              <Icon
                name="lsicon:edit-outline"
                size="20"
                class="text-blue-400"
              />
              <span class="text-white">Rename</span>
            </button>

            <button
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors w-full text-red-400"
              @click="deleteResult(index)"
            >
              <Icon name="material-symbols:delete-rounded" size="20" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();
const results = [
  "Analyzed cat.jpg",
  "Processed vacation.png",
  "Scanned document.jpg",
  "Examined profile.jpg",
  "Analyzed code.png",
  "Processed screenshot.jpg",
  "Scanned artwork.png",
];

const activeModal = ref(null);

const toggleModal = (index) => {
  activeModal.value = activeModal.value === index ? null : index;
};

const editResult = (index) => {
  // Edit logic here
  activeModal.value = null;
};

const deleteResult = (index) => {
  // Delete logic here
  activeModal.value = null;
};

const isUserLoggedIn = computed(() => user.value !== null);

// Close modal when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".settings-modal")) {
      activeModal.value = null;
    }
  });
});
</script>