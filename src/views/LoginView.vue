<script setup lang="ts">
import { Button, InputText, Password, FloatLabel, Checkbox } from 'primevue';
import DarkLogo from '@/components/icons/DarkLogo.vue';

const login = () => {
  alert('logged in');
};
</script>

<template>
  <main class="h-screen flex items-center justify-center">
    <form class="flex flex-col w-56 gap-5" @submit.prevent="login()">
      <div class="flex justify-center">
        <DarkLogo />
      </div>

      <FloatLabel class="mt-5" variant="in">
        <InputText class="w-full" id="username" />
        <label for="password">Ім'я користувача</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <Password class="w-full" id="password" :feedback="false" toggleMask />
        <label for="password">Пароль</label>
      </FloatLabel>

      <div class="flex items-center gap-2">
        <Checkbox id="rememberMe" binary />
        <label for="rememberMe">Запам'ятати дані</label>
      </div>

      <div class="flex justify-center">
        <Button type="submit" label="Увійти" rounded class="px-5" />
      </div>
    </form>
  </main>
</template>

<style>
#password input {
  width: 100%;
}
</style>
