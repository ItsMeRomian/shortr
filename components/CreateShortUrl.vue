<script setup lang="ts">
import { toast } from "vue3-toastify";
const urlInput = ref<HTMLInputElement>();
const output = ref<string>("");
const maxReads = ref(0);

onMounted(() => {
  if (urlInput.value) urlInput.value.value = "";
  document.onpaste = paste;
});

const paste = async () => {
  if (urlInput.value && urlInput.value.value === "")
    urlInput.value.value = await navigator.clipboard.readText();
  await shortenUrl(await navigator.clipboard.readText(), 0);
};

/**
 * Write to clipboard
 */
const copied = ref(false);
const copy = () => {
  copied.value = true;
  navigator.clipboard.writeText(output.value);
};
watch(copied, () =>
  setTimeout(() => {
    copied.value = false;
  }, 500)
);

/**
 * Click the result box
 */
const clickResult = () => {
  if (output.value) {
    copy();
    toast.success("Copied 🫡");
  }
};

/**
 * Shorten url
 * @param url
 * @returns shortened url
 */
const shortenUrl = async (url: string, maxReads: number): Promise<string> => {
  try {
    const res = await $fetch<string>("/url", {
      method: "POST",
      body: { url, maxReads },
    });

    toast.success("Shortend 🫡");
    return `${window.location}${res}`;
  } catch (error) {
    toast.error(`Failed to shorten url: ${(error as Error).message}`);
    return "failed";
  }
};

/**
 * Form submit
 */
const formSubmit = async () => {
  if (urlInput.value) {
    output.value = await shortenUrl(urlInput.value.value, maxReads.value);
  }
};
</script>
<template>
  <form @submit.prevent="formSubmit()" class="w-full h-full">
    <div class="flex flex-col gap-4 justify-center mt-5">
      <input
        ref="urlInput"
        type="string"
        autofocus
        name="url"
        class="py-3 p-5 rounded-md bg-secondary-100 w-full text-gray-800"
        placeholder="Enter a link"
      />

      <div
        class="flex flex-row items-center rounded-md group"
        :class="output ? 'bg-secondary-100 cursor-pointer' : 'bg-primary-200'"
        @click="clickResult()"
      >
        <span
          placeholder="Shortened link"
          class="py-3 p-5 w-full rounded-l-md text-gray-800 transition-all duration-300 ease-in-out"
          :class="copied ? 'bg-green-400' : null"
        >
          {{ output }}
        </span>
        <img
          src="assets/copy.svg"
          alt="copy"
          class="p-3 w-12 bg-primary-300 rounded-r-md"
          :class="output ? 'hover:bg-primary-100 ' : null"
        />
      </div>
      <div class="flex gap-2 justify-end items-center">
        <span>Max uses</span>
        <input
          type="number"
          v-model="maxReads"
          class="rounded-md w-10 text-center text-gray-800"
          placeholder="0"
        />
        <input type="submit" hidden />
      </div>
    </div>
  </form>
</template>
