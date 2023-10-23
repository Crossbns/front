import React, {useEffect, useState} from 'react' // Import React and hooks
import axios from 'axios' // Import axios for HTTP requests
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs'; // Import icons

const API_URL = 'https://server-fqc9.onrender.com'; // API base URL

// Component to create a new task
function Create({ onAdd }) {
  const [task, setTask] = useState() // State for the new task

  // Function to add a new task
  const handleAdd = () => {
    if (task && task.trim().length > 0) { // Check if the task is not empty
      axios.post(`${API_URL}/add`, {task: task}) // Send a POST request to add the task
      .then(result => {
        onAdd(result.data); // Update the parent component with the new task
      })
      .catch(err => {
        console.log(err); // Handle errors
      })
    } else {
      alert('Enter a valid task.'); // Show an alert if the task is empty
    }
  }

  return (
    <div className="create_form">
        <input type="text" placeholder='Add a task' onChange={(e) => setTask(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Add</button>
    </div>
  )
}

// Component to display and manage tasks
function Tasks() {
  const [todos, setTodos] = useState ([]) // State for the list of tasks

  useEffect(() => { // Fetch tasks when the component mounts
    axios.get(`${API_URL}/get`)
    .then(result => setTodos(result.data)) // Update the state with the fetched tasks
    .catch(err => console.log(err)) // Handle errors
  }, [])

  const handleAdd = (todo) => { // Function to handle adding a new task to the list
    setTodos([...todos, todo]);
  }

  const handleEdit = (id) => { // Function to handle editing a task
    axios.put(`${API_URL}/update/${id}`) // Send a PUT request to update the task
    .then(result => {
      setTodos(todos.map(todo => todo._id === id ? {...todo, done: true} : todo)); // Update the state with the updated task
    })
    .catch(err => {
      console.log(err); // Handle errors
    })
  }

  const handleDelete = (id) => { // Function to handle deleting a task
    axios.delete(`${API_URL}/delete/${id}`) // Send a DELETE request to delete the task
    .then(result => {
      setTodos(todos.filter(todo => todo._id !== id)); // Update the state by removing the deleted task
    })
    .catch(err => {
      console.log(err); // Handle errors
    })
  }
  
  return (
    <div className="home">
      <h2>To Do</h2>
      <Create onAdd={handleAdd} />
      <div className="task-container">
        {console.log(todos)} {/* Check the state of todos before mapping it */}
        {todos.length === 0 ? (
          <div>
            <h2>No Logs</h2>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo._id} className="task">
              <div className="checkbox" onClick={() => handleEdit(todo._id)}>
                {todo.done ? (
                  <BsFillCheckCircleFill className="icon"></BsFillCheckCircleFill>
                ) : (
                  <BsCircleFill className="icon" />
                )}
                <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
              </div>
  
              <div>
                <span>
                  <BsFillTrashFill
                    className="icon"
                    onClick={() => handleDelete(todo._id)}
                  />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default Tasks; // Export Tasks component as default
