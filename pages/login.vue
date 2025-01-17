<template>
  <div class="w-1/2 mx-auto mt-10">
    <h1>Input without unnecessary words</h1>
    <form @submit.prevent="login">
      <div class="flex flex-col">
        <input v-model="email" type="email" placeholder="Email" required />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">Award</button>
        <p v-if="isCreated">{{ isCreated }}</p>
        <p v-if="isError" style="color: red">{{ isError }}</p>
      </div>
    </form>
    <NuxtLink to="/" class="flex mx-auto underline"
      >Dont have an account? Click here</NuxtLink
    >
  </div>
</template>

<script setup>
import "@picocss/pico";

import { ref } from "vue";

const email = ref("");
const password = ref("");
const token = ref("");
const error = ref("");

const login = async () => {
  try {
    const response = await $fetch("/api/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    if (response.error) {
      error.value = response.error;
      token.value = ""; // Очищення токена при помилці
    } else {
      token.value = response.token; // Зберігаємо токен у реактивній змінній
      localStorage.setItem("jwt", token.value); // Зберігаємо токен у локальному сховищі
      error.value = "";
      navigateTo("/welcome");
    }
  } catch (err) {
    console.error(err);
    error.value = "An error occurred";
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
