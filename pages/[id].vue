<template></template>
<script setup lang="ts">
const { data } = await useFetch<string>(`/api/url?id=${useRoute().params.id}`);

onMounted(() =>
  data.value ? navigateTo(data.value, { external: true }) : data.value
);
</script>
