import { useEffect, useState } from "react";
import userService, { User } from "../services/user-service";
import { CanceledError } from "axios";

const useUsers = () => {
    const [users, setUsers] = useState<User []>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        const {request, cancel} = userService.getAll<User>();
        request.then((resource) => {
            setUsers(resource.data);
            setLoading(false);
        })
        .catch((err) => {
            if(err instanceof CanceledError) return;
            setError(err.message);
            setLoading(false);
        });
        return () => cancel();
    }, [])
    return { users, error, isLoading, setUsers, setError };
}

export default useUsers;