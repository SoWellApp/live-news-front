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

export const useSessionStore = defineStore('session',() => {
    const user = ref<User>({
        ...initialState,
        pseudo: SessionStorage.getItem("loggedUser") as string || "",
    })

    const fetchUser = async () => {
        try {
            const resp = await api.get<User>('https://api.escuelajs.co/api/v1/users/1')
            if(resp.status === 200) {
                user.value = {
                    id: resp.data?.id,
                    email: resp.data?.email,
                    avatar: resp.data?.avatar,
                    pseudo: SessionStorage.getItem("loggedUser") as string || ""
                }
                return [user.value]
            }
            return []
        } catch (error) {
            console.error('Error while fetching user data : ' , error)
            user.value = {
                ...initialState,
                pseudo: SessionStorage.getItem("loggedUser") as string,
            }
            return []
        }
    }

    const resetSession = () => {
        SessionStorage.remove("loggedUser")
    }

    return {
        user,
        fetchUser,
        resetSession
    }
})