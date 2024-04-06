import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Vue3Toasity, {
        position: 'top-right',
        hideProgressBar: true,
        toastClassName: 'text-right w-fit',
        style: {
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'flex-end',
        }
    } as ToastContainerOptions)
});