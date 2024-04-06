<script setup lang="ts">
import type { Prisma } from "@prisma/client";
import { toast } from "vue3-toastify";

const urlInfoInput = ref<string>("");
const result = ref<Prisma.UrlSelect>();

const getUrl = async (url: string): Promise<Prisma.UrlSelect> => {
  try {
    const res = await $fetch<Prisma.UrlSelect>(
      `/api/urlinfo?id=${url.split("/").pop()}`
    );
    console.log(res);
    return res;
  } catch (error) {
    toast.error(`Failed to shorten url: ${(error as Error).message}`);
    return {};
  }
};

/**
 * Form submit
 */
const formSubmit = async () => {
  if (urlInfoInput.value) {
    result.value = await getUrl(urlInfoInput.value);
  }
};
</script>
<template>
  <form
    @submit.prevent="formSubmit()"
    class="w-full h-full flex flex-col gap-2 justify-center"
  >
    <input
      v-model="urlInfoInput"
      class="py-3 p-5 rounded-md bg-secondary-100 w-full text-gray-800"
      placeholder="Enter a short link"
    />
    <template v-if="result">
      <h2 class="text-xl">Goes to {{ result.url }}</h2>
      <UAccordion
        open-icon="i-heroicons-chevron-down"
        close-icon="i-heroicons-chevron-up"
        :items="result.UrlReads"
      />
    </template>
  </form>
</template>
