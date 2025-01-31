<template>
  <div class="relative">
    <Transition name="slide-right">
      <aside
        v-if="isSidePanel"
        class="fixed md:relative top-0 left-0 h-full w-full md:w-80 border-r border-gray-800/30 p-4 flex flex-col z-10 bg-gray-900 text-white"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between">
            <h1 class="flex items-center text-4xl font-kanit">codepeak</h1>
            <button
              class="transition-all duration-300 bg-transparent rounded-xl w-10 h-10 flex items-center justify-center md:hidden"
              @click="isSidePanel = false"
            >
              <Icon name="formkit:close" size="30" />
            </button>
          </div>
          <FilterResults />
          <HistoryResults />
          <div class="flex flex-col h-full justify-end">
            <button
              @click="isOpen = !isOpen"
              class="profile-btn flex items-center gap-1 hover:bg-gray-600 w-full p-2 rounded-xl transition-all"
            >
              <Icon name="lets-icons:user-cicrle-duotone" size="40" />
              <p class="text-md">{{ currentUser }}</p>
            </button>
            <Transition>
              <div v-show="isOpen" class="custom-modal p-2">
                <ul>
                  <li
                    @click="toggleSettings"
                    class="cursor-pointer p-2 hover:bg-gray-600 flex items-center gap-3 rounded-xl"
                  >
                    <Icon name="mingcute:settings-3-fill" size="30" />Settings
                  </li>
                  <li
                    @click="handleLogout"
                    class="cursor-pointer p-2 hover:bg-gray-600 flex items-center gap-2 rounded-xl"
                  >
                    <Icon name="tabler:logout" size="30" />Log out
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Mobile icon -->
    <div
      @click="isSidePanel = true"
      class="block md:hidden cursor-pointer fixed top-4 left-4"
    >
      <Icon name="tabler:menu-3" size="40" />
    </div>

    <!-- Toggle button for large screens -->
    <div v-if="isSidePanel" class="hidden md:block fixed top-4 left-80">
      <button
        class="transition-all duration-300 bg-transparent rounded-xl w-10 h-10 flex items-center justify-center"
        @click="isSidePanel = false"
      >
        <Icon name="fluent:panel-left-16-regular" size="30" />
      </button>
    </div>

    <!-- Minimal Sidebar when collapsed -->
    <Transition name="slide-left">
      <div
        v-if="!isSidePanel"
        class="hidden md:flex fixed top-0 left-0 w-20 h-screen p-4 flex-col justify-between items-center bg-gray-900 text-white border-r border-gray-800/30 z-20"
      >
        <div class="flex flex-col items-center gap-4">
          <Icon name="game-icons:mountaintop" size="40" class="text-gray-300" />
          <button
            class="sidepanel-btn transition-all duration-300 bg-gray-700 p-2 rounded-xl"
            @click="isSidePanel = true"
          >
            <Icon name="fluent:panel-left-16-regular" size="30" />
          </button>
          <div
            class="sidepanel-btn transition-all duration-300 bg-gray-700 p-2 rounded-xl"
          >
            <ThemeButton />
          </div>
        </div>
        <button
          class="sidepanel-btn transition-all duration-300 bg-gray-700 p-2 rounded-xl hover:scale-110"
        >
          <Icon name="lets-icons:user-cicrle-duotone" size="30" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuth } from "../composables/useAuth";

const isOpen = ref(false);
const isSettings = ref(false);
const { logout, user } = useAuth();

const currentUser = computed(() => user.value?.username || "Guest");
const isSidePanel = ref(false); // по умолчанию закрыто

onMounted(() => {
  if (typeof window !== "undefined") {
    isSidePanel.value = window.innerWidth >= 768;
  }
});

const toggleSettings = () => {
  isSettings.value = !isSettings.value;
  isOpen.value = false;
};

const handleLogout = async () => {
  try {
    await logout();
    isOpen.value = false;
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>

<style scoped>
.custom-modal {
  position: absolute;
  left: 50%;
  bottom: 3%;
  transform: translate(-50%, -50%);
  width: 200px;
  border-radius: 8px;
  background: #334155;
  color: #fff;
}

.light-mode aside {
  background-color: #f5f5f5;
  color: #111B27;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
