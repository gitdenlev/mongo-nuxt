<template>
  <div class="relative">
    <Transition name="slide-right">
      <aside
        v-if="isSidePanel"
        class="fixed top-0 left-0 h-full w-80 backdrop-blur-md border-r border-solid border-gray-800/30 p-4 flex flex-col z-10"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between">
            <h1 class="flex items-center text-4xl font-kanit">codepeak</h1>
            <div class="pt-2 side-panel">
              <button
                class="sidepanel-btn transition-all duration-300 bg-transparent rounded-xl w-10 h-10 flex items-center justify-center"
                @click="isSidePanel = !isSidePanel"
              >
                <Icon name="fluent:panel-left-16-regular" size="30" />
              </button>
            </div>
          </div>
          <FilterResults />
          <HistoryResults />

          <div class="flex flex-col h-full justify-end">
            <div class="flex">
              <button
                @click="isOpen = !isOpen"
                class="profile-btn flex items-center gap-1 hover:bg-gray-600 w-1/2 p-1 rounded-xl transition-all"
              >
                <Icon name="lets-icons:user-cicrle-duotone" size="40" />
                <p class="text-md">{{ currentUser }}</p>
              </button>
              <Transition>
                <div v-show="isOpen" class="custom-modal p-2">
                  <ul>
                    <li
                      @click="toggleSettings"
                      class="cursor-pointer rounded-xl text-sm flex items-center gap-3 textcursor-pointer p-2 hover:bg-gray-600"
                    >
                      <Icon name="mingcute:settings-3-fill" size="30" />Settings
                    </li>
                    <li
                      @click="handleLogout"
                      class="cursor-pointer rounded-xl text-sm flex items-center gap-2 p-2 hover:bg-gray-600"
                    >
                      <Icon class="ml-1" name="tabler:logout" size="30" />Log
                      out
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Контейнер Settings -->
        <UModal v-model="isSettings" :overlay="false">
          <div class="settings-container">
            <div class="p-[16px]">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold mb-2">Settings</h2>
                <button
                  @click="isSettings = false"
                  class="flex items-center justify-center hover:bg-gray-600 w-8 h-8 rounded-md"
                >
                  <Icon name="formkit:close" size="20" />
                </button>
              </div>
              <table
                class="mt-2 mb-2 w-full text-center bg-gray-600 rounded-md m-0"
              >
                <tbody>
                  <tr>
                    <td
                      class="transition-all border-r cursor-pointer hover:bg-blue-500 rounded-l-md"
                    >
                      General
                    </td>
                    <td
                      :class="{
                        'cursor-not-allowed bg-gray-400': !currentUser,
                        'hover:bg-blue-500': currentUser,
                      }"
                      class="transition-all rounded-r-md"
                    >
                      Profile
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <div class="flex items-center justify-between">
                  <p class="text-sm flex items-center gap-2 p-2">
                    <Icon name="proicons:dark-theme" size="30" />Theme
                  </p>
                  <ThemeDropdown />
                </div>
              </div>
            </div>
          </div>
        </UModal>
      </aside>
    </Transition>

    <!-- Toggle button and icons when sidebar is hidden -->
    <Transition name="slide-left">
      <div
        v-if="!isSidePanel"
        class="hidden-menu fixed top-0 left-0 w-20 h-screen p-4 flex flex-col justify-between items-center z-20"
      >
        <div class="flex flex-col items-center gap-4">
          <Icon name="game-icons:mountaintop" size="40" />

          <button
            class="sidepanel-btn transition-all duration-300 bg-transparent rounded-xl w-10 h-10 flex items-center justify-center"
            @click="isSidePanel = !isSidePanel"
          >
            <Icon name="fluent:panel-left-16-regular" size="30" />
          </button>

          <div
            class="sidepanel-btn transition-all duration-300 bg-transparent rounded-xl w-10 h-10 flex items-center justify-center"
          >
            <ThemeButton />
          </div>
        </div>

        <button
          class="sidepanel-btn transition-all duration-300 bg-transparent rounded-xl w-10 h-10 flex items-center justify-center hover:scale-110"
        >
          <Icon name="lets-icons:user-cicrle-duotone" size="30" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useAuth } from "../composables/useAuth";

const isOpen = ref(false);
const isSettings = ref(false);
const { logout, user } = useAuth();

const currentUser = computed(() => {
  if (user.value && user.value.username) {
    return user.value.username;
  }
  return "Guest";
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

const testList = ref([1, 2, 3]);

const isSidePanel = ref(true);
</script>

<style scoped>
.custom-modal {
  position: absolute;
  left: 37%;
  bottom: 3%;
  transform: translate(-50%, -50%); /* Центрування */
  width: 200px; /* Ширина модального вікна */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #334155;
  color: #fff;
}

.settings-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Центрування */
  width: 300px; /* Ширина модального вікна */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Високий z-index, щоб бути поверх інших елементів */
  background: #334155;
  color: #fff;
}

.dark-mode aside,
.dark-mode .hidden-menu {
  box-shadow: 1px 0 10px 0 rgba(255, 255, 255, 0.381);
}

.light-mode aside,
.light-mode .hidden-menu {
  box-shadow: 1px 0 10px 0 rgba(0, 0, 0, 0.381);
}

/* Slide transition for sidebar */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide transition for mini sidebar */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Fade transition for toggle button */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9); /* Плавна анімація */
}

.light-mode .sidepanel-btn:hover {
  background-color: #334155;
  color: white;
}

.dark-mode .sidepanel-btn:hover {
  background-color: white;
  color: #334155;
}

.light-mode .profile-btn:hover {
  color: white;
}

/* Added new style for the table cell when user is not logged in */
td.cursor-not-allowed {
  cursor: not-allowed;
  background-color: #d1d5db;
}
</style>
