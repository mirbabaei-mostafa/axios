import userService, {User} from './services/user-service'
import useUsers from './hooks/useUsers'

const App = () => {

  const {users, error, isLoading, setUsers, setError} = useUsers()

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((username) => username.id !== user.id))
    userService.delete(user.id).catch(err => {
      setError(err.message)
      setUsers(originalUsers)
    })
  }

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = {id: 0, name: "Mostafa", username: "mostafa"};
    setUsers([...users, newUser])
    userService.create(newUser)
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
    setUsers(users.map((u) => u.id === user.id ? updatedUsers : u))
    userService.update(updatedUsers)
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
