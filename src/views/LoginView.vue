<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Button, InputText, Password, FloatLabel, ToggleSwitch, Toast } from 'primevue';
import DarkLogo from '@/components/icons/DarkLogo.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const formData = ref({
  username: '',
  password: '',
  rememberMe: false,
});

onMounted(() => {
  if (auth.isAuth()) window.location.replace('/');

  const storedCreds = auth.loadStoredCreds();

  if (storedCreds) formData.value = storedCreds;
});
</script>

<template>
  <section class="h-screen w-full flex items-center justify-center">
    <form class="flex flex-col w-56 gap-5" @submit.prevent="auth.login(formData)">
      <div class="flex justify-center">
        <DarkLogo width="120" height="103" />
      </div>

      <FloatLabel class="mt-5" variant="on">
        <InputText v-model="formData.username" class="w-full" id="username" />
        <label for="password">Ім'я користувача</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password
          v-model="formData.password"
          class="w-full"
          id="password"
          :feedback="false"
          toggleMask
        />
        <label for="password">Пароль</label>
      </FloatLabel>

      <div class="flex items-center gap-2">
        <ToggleSwitch v-model="formData.rememberMe" id="rememberMe" />
        <label for="rememberMe">Запам'ятати мене</label>
      </div>

      <div class="flex justify-center">
        <Button type="submit" label="Увійти" rounded class="px-5" />
      </div>
    </form>

    <Toast group="login-errors" position="top-center"/>
  </section>
</template>

<style>
#password input {
  width: 100%;
}
</style>
