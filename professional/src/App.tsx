import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import apiClient, { CanceledError } from './services/api-client'
import userService, {User} from './services/user-service'

const App = () => {

  // Wir konnen der Art des Arrays angeben.
  const [users, setUsers] = useState<User []>([])
  const [error, setError] = useState("")
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {

    setLoading(true);

    // It is very useful to define an interface for fetching data objects
    // It is not necessery to defein all ojects. we can define only that object we need
    // get -> promise -> responce | error
    const {request, cancel} = userService.getAllUsers()
    request.then(responce => {
        setUsers(responce.data);
        setLoading(false);
      })
      .catch(err => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      })
    
      return () => cancel();
  }, [])

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((username) => username.id !== user.id))
    userService.deleteUser(user).catch(err => {
      setError(err.message)
      setUsers(originalUsers)
    })
  }

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = {id: 0, name: "Mostafa", username: "mostafa"};
    setUsers([...users, newUser])
    userService.addNewUser(newUser)
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
    userService.updateUser(user, updatedUsers)
    .catch((err) => {
      setError(err.message)
      setUsers(originalUsers)
    })
  }
  
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
