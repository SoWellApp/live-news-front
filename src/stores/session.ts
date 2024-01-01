import { defineStore } from "pinia";
import { User } from "src/types";
import { ref } from "vue";
import { SessionStorage } from 'quasar';
import { api } from "src/boot/axios";

const initialState = {
    id: 0,
    pseudo: "",
    email: "",
    avatar: ""
}

export const useSessionStore = defineStore('session', () => {
    const user = ref<User>({
        ...initialState,
        pseudo: SessionStorage.getItem("loggedUser") as string || "",
    })

    const resetSession = () => {
        SessionStorage.remove("loggedUser")
    }

    return {
        user,
        resetSession
    }
})