<script setup lang="ts">
const message = "";
</script>

<template>
  <div
    class="flex flex-col gap-10 justify-center items-center h-screen text-secondary-100 bg-[url('assets/bg.svg')] bg-no-repeat bg-cover bg-center"
    ref="dropZoneRef"
  >
    <div class="px-10 w-full md:w-3/5 max-w-[500px]">
      <h1 class="text-center text-3xl font-bold mt-2 mb-2">Drop url</h1>
      <p class="text-center text-lg mb-4">{{ message }}</p>
      <CreateShortUrl />
    </div>
    <div class="px-10 w-full md:w-3/5 max-w-[500px]">
      <h1 class="text-center text-3xl font-bold mt-2 mb-2">Find info</h1>
      <FindInfo />
    </div>
  </div>
</template>
