<template>
  <div class="min-h-screen flex">
    <Sidebar />
    <main class="flex-1 p-6 items-center justify-center">
      <div class="flex flex-col items-center justify-center mt-40 md:mt-20">
        <div class="flex gap-2 items-center text-4xl">
          <Icon name="game-icons:mountaintop" />
          <h1>codepeak</h1>
        </div>

        <p class="text-md mt-4">Upload an image to classify it.</p>

        <!-- Container for image upload -->
        <Transition name="fade" mode="out-in">
          <div
            v-if="!uploadedImage && !isLoading"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop="handleDrop"
            :class="[
              'md:w-1/3 h-40 flex items-center justify-center text-xl mt-6 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-3000 text-white',
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800',
            ]"
          >
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
              id="fileInput"
            />
            <label for="fileInput" class="cursor-pointer">
              <p
                class="drag-n-drop-text"
                :class="isDragging ? 'text-black' : 'text-white'"
              >
                Drag & drop an image or
                <span class="text-blue-500">click to upload</span>.
              </p>
            </label>
          </div>
        </Transition>

        <!-- Toogle mode -->
        <div
          v-if="!uploadedImage"
          class="flex items-center justify-center relative left-40 mt-4 gap-2 p-2 xl:mr-0 mr-40"
        >
          <span class="text-sm text-gray-400">Extended Results</span>
          <UToggle
            v-model="showBestResultOnly"
            :label="
              showBestResultOnly ? 'Show all results' : 'Show best result'
            "
            color="blue"
            class="bg-blue-500"
          />
          <span class="text-sm text-gray-400">Best result</span>
        </div>

        <!-- Loader -->
        <Transition name="fade" mode="out-in">
          <div
            v-if="isLoading"
            class="mt-6 absolute top-60 left-50 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Loader />
          </div>
        </Transition>

        <!-- Result classification -->
        <Transition name="fade" mode="out-in">
          <div
            v-if="classificationResult"
            class="mt-6 w-full md:w-[600px] fade-in"
          >
            <img
              v-if="uploadedImage"
              :src="uploadedImage"
              alt="Uploaded image"
              class="mb-4 response-image mx-auto"
            />
            <ul>
              <li
                v-for="(item, idx) in filteredClassificationResult"
                :key="idx"
                class="mt-2"
              >
                <div class="flex items-center justify-between">
                  <span :class="showBestResultOnly ? 'text-xl' : ''">{{
                    item.label
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")
                  }}</span>
                </div>
                <!-- Progress bar -->
                <div
                  v-if="!showBestResultOnly"
                  class="w-full bg-gray-700 rounded-full h-2 mt-1"
                >
                  <div
                    class="bg-blue-500 h-2 rounded-full progress-bar"
                    :style="{ width: `${Math.round(item.score * 100)}%` }"
                  ></div>
                </div>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
useHead({
  title: "CodePeak",
  link: [
    {
      rel: "icon",
      type: "image",
      href: "/logo.svg",
    },
  ],
});

const isDragging = ref(false);
const uploadedImage = ref(null);
const isLoading = ref(false);
const classificationResult = ref(null);
const showBestResultOnly = ref(false);

const testList = ref([]);

const getFileInfo = (file) => {
  if (!file) return null;
  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  return {
    name: file.name,
    size: `${sizeInMB} MB`,
  };
};

const fileInfo = ref(null);

const filteredClassificationResult = computed(() => {
  if (!classificationResult.value) return null;

  if (showBestResultOnly.value) {
    // Find the best result (highest score)
    const bestResult = classificationResult.value.reduce((max, current) =>
      current.score > max.score ? current : max
    );
    return [bestResult];
  } else {
    // Return all results sorted by score (from highest to lowest)
    return [...classificationResult.value].sort((a, b) => b.score - a.score);
  }
});

// Update handleImageUpload function to include file info and save to database
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileInfo.value = getFileInfo(file);

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Image = e.target.result.split(",")[1];
    uploadedImage.value = e.target.result;
    isLoading.value = true;

    try {
      // Get classification results
      const response = await $fetch("/api/chat", {
        method: "POST",
        body: {
          image: base64Image,
        },
      });

      classificationResult.value = response.response;

      // Save results to database
      await $fetch("/api/history", {
        method: "POST",
        body: {
          image: uploadedImage.value,
          fileName: fileInfo.value.name,
          fileSize: fileInfo.value.size,
          results: classificationResult.value,
        },
      });
    } catch (error) {
      console.error("Error processing image:", error);
      classificationResult.value = [{ label: "Error", score: 0 }];
    } finally {
      isLoading.value = false;
    }
  };

  reader.readAsDataURL(file);
}

function handleDrop(event) {
  event.preventDefault();
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!file.type.startsWith("image/")) {
    console.error("Please drop an image file");
    return;
  }

  try {
    fileInfo.value = getFileInfo(file);
    const fakeEvent = {
      target: {
        files: [file],
      },
    };
    handleImageUpload(fakeEvent);
  } catch (error) {
    console.error("Error handling dropped file:", error);
  }
}
</script>

<style>
img {
  display: block; /* Щоб не було зайвих відступів */
  max-width: 100%; /* Запобігає виходу за межі контейнера */
  height: auto; /* Зберігає пропорції */
  border-radius: 8px;
  margin: 8px auto; /* Центрування картинки */

  /* Адаптивність для різних екранів */
  max-height: 80vh; /* Щоб не займала весь екран на мобільних */
  object-fit: contain; /* Пропорційно вміщає зображення в контейнер */
}

/* Додаткові стилі для адаптивності */
@media (max-width: 768px) {
  .response-image {
    max-height: 50vh; /* Обмеження для мобільних */
  }
}

.progress-bar {
  transition: width 2.5s linear;
}

.fade-in {
  animation: fadeIn 2.5s linear;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dark-mode .drag-n-drop-text {
  color: #fff;
}
</style>
