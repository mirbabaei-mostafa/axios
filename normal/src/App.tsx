import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import apiClient, { CanceledError } from './services/api-client'

interface User {
  id: number,
  name: string,
  username: string,
}

const App = () => {

  // Wir konnen der Art des Arrays angeben.
  const [users, setUsers] = useState<User []>([])
  const [error, setError] = useState("")
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {

    const controller = new AbortController();

    setLoading(true);

    // It is very useful to define an interface for fetching data objects
    // It is not necessery to defein all ojects. we can define only that object we need
    // get -> promise -> responce | error
    axios.get("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
    // or
    // apiClient.get("/users", { signal: controller.signal })
      .then(responce => {
        setUsers(responce.data);
        setLoading(false);
      })
      .catch(err => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      })
      // .finally(() => {
      //   setLoading(false);
      // });
    
      return () => controller.abort();
  }, [])

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((username) => username.id !== user.id))
    axios.delete("https://jsonplaceholder.typicode.com/users/" + user.id)
    // or
    // apiClient.delete("/users/" + user.id)
    // Wenn eine Fehler passiert ist, kommt der Username zuruck.
    .catch(err => {
      setError(err.message)
      setUsers(originalUsers)
    })
  }

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = {id: 0, name: "Mostafa", username: "mostafa"};
    setUsers([...users, newUser])
    axios.post("https://jsonplaceholder.typicode.com/users/", newUser)
    // or
    // apiClient.post("/users/", newUser)

    //.then(res => setUsers([res.data, ...users]));
    // .then(({ data }) => setUsers([data, ...users]));
    .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
    .catch((err) => {
      setError(err.message)
      setUsers(originalUsers)
    });
  }


  const updatedUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUsers = { ...user, name: user.name + "!" };
    console.log(updatedUsers)
    setUsers(users.map((u) => u.id === user.id ? updatedUsers : u))
    //axios.put("https://jsonplaceholder.typicode.com/users/" + user.id, updatedUser)
    axios.patch("https://jsonplaceholder.typicode.com/users/" + user.id, updatedUser)
    // or
    // apiClient.patch("/users/" + user.id, updatedUser)
    .catch((err) => {
      setError(err.message)
      setUsers(originalUsers)
    })
  }

  // OR

  // useEffect (() => {
  //   const fetchUsers = async () => {
  //     try {
  //         const responce = await axios.get<User []>("https://jsonplaceholder.typicode.com/users")
  //         setUsers(responce.data)
  //       }
  //     catch (err) {
  //       setError((err as AxiosError).message)
  //     }
  //   }
  //   fetchUsers()
  // })
  
  return (
    <div>
      <button className='btn btn-primary mb-3' onClick={addUser}>Add</button>
      <ul>
        {error && <p className='text-danger'>Error: {error}</p>}
        {isLoading && <div className='spinner-border'></div>}
        {users.map((user) => <li key={user.name} className='list-group-item d-flex justify-content-between'>{user.name}&nbsp;
        <div>
        <button onClick={() => updatedUser(user)} className='btn btn-outline-secondary'>Update</button> {" "}
        <button onClick={() => deleteUser(user)} 
        className='btn btn-outline-danger'>Loschen</button></div></li>)}
      </ul>
    </div>
  )
}

export default App
