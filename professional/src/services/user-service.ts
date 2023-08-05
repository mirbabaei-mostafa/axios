import apiClient from "./api-client";

export interface User {
    id: number,
    name: string,
    username: string,
  }

class UserServices {
    getAllUsers() {
        const controller = new AbortController();
        const request = apiClient.get<User[]>("/users", { signal: controller.signal })
        return {request, cancel: () => controller.abort()}
    }

    deleteUser(user: User) {
        return apiClient.delete("/users/" + user.id)
    }

    addNewUser(user: User) {
        return apiClient.post("/users/", user)
    }

    updateUser(user: User, updatedUser: User) {
        return apiClient.patch("/users/" + user.id, updatedUser)
    }
}

export default new UserServices();