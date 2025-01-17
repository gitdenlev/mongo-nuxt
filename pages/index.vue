<template>
  <div class="w-1/2 mx-auto mt-10">
    <h1>Create free account</h1>
    <form @submit.prevent="createAccount">
      <div class="flex flex-col">
        <input v-model="userEmail" type="email" placeholder="Email" required />
        <input
          v-model="userPassword"
          type="password"
          placeholder="Password"
          required
        />
        <small
          style="color: red; opacity: 0.5"
          v-if="passwordAtLeast6Characters"
          >Password must be at least 6 characters</small
        >
        <button type="submit">Create</button>
        <p v-if="isCreated">{{ isCreated }}</p>
        <p v-if="isError" style="color: red">{{ isError }}</p>
      </div>
    </form>
    <NuxtLink to="/login" class="text-center underline">Any account? What are you waiting for? Come in!</NuxtLink>
  </div>
</template>

<script setup>
useHead({
    title: 'MongoNuxt - Create account',
})
const userEmail = ref("");
const userPassword = ref("");
const isCreated = ref("");
const isError = ref("");

const passwordAtLeast6Characters = ref(false);

const createAccount = async () => {
  try {
    const response = await $fetch("/api/user", {
      method: "POST",
      body: {
        email: userEmail.value,
        password: userPassword.value,
      },
    });

    // Перевірка на успішність створення облікового запису
    if (response && response.message) {
      isCreated.value = "User created"; // Припустимо, що сервер повертає повідомлення
      navigateTo("/welcome"); // Перенаправлення на сторінку привітання
    }
  } catch (error) {
    console.error(error);
    isError.value = "Failed to create account. Please try again."; // Повідомлення про помилку
    passwordAtLeast6Characters.value = false;
  }
};
</script>

<style setup>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
