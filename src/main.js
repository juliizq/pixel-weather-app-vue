import { createApp } from 'vue'
import App from './App.vue'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { PxSearch } from "oh-vue-icons/icons";

addIcons(PxSearch);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
