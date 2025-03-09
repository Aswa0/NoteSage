import { create } from "zustand";

export const useStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    notes: [],
    tasks: [],
    initialized: false,

    initializeUser: () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Initializing user:", storedUser);
        set({ user: storedUser, initialized: true });
    },
    setUser: (user) => {
        console.log("Setting user:", user);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            set({ user });
        } else {
            localStorage.removeItem("user");
            set({ user: null, notes: [], tasks: [] });
        }
    },

    setNotes: (notes) => {
        console.log("Updating notes in store:", notes);
        set((state) => ({ notes: [...notes] }));  
    },

    setTasks: (tasks) => {
        console.log("Updating tasks in store:", tasks);
        set((state) => ({ tasks: [...tasks] }));  
    },
}));