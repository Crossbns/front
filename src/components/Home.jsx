import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

const API_URL = 'https://server-fqc9.onrender.com';

function Create({ onAdd }) {
  const [task, setTask] = useState()
  const handleAdd = () => {
    if (task && task.trim().length > 0) { // Verifica si la tarea no está vacía
      axios.post(`${API_URL}/add`, {task: task})
      .then(result => {
        onAdd(result.data);
      })
      .catch(err => {
        if (err.code === 'ECONNABORTED') {
          console.log('Request has been exhausted');
        } else {
          console.log(err);
        }
      })
    } else {
      alert('Enter a valid task.'); // Muestra un mensaje si la tarea está vacía
    }
  }
  return (
    <div className="create_form">
        <input type="text" placeholder='Add a task' onChange={(e) => setTask(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Add</button>
    </div>
  )
}

function Tasks() {
  const [todos, setTodos] = useState ([])

  useEffect(() => {
    axios.get(`${API_URL}/get`)
    .then(result => setTodos(result.data))
    .catch(err => console.log(err))
  }, [])

  const handleAdd = (todo) => {
    setTodos([...todos, todo]);
  }

  const handleEdit = (id) => {
    axios.put(`${API_URL}/update/${id}`)
    .then(result => {
      setTodos(todos.map(todo => todo._id === id ? {...todo, done: true} : todo));
    })
    .catch(err => {
      if (err.code === 'ECONNABORTED') {
        console.log('Request has been exhausted');
      } else {
        console.log(err);
      }
    })
  }

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/delete/${id}`)
    .then(result => {
      setTodos(todos.filter(todo => todo._id !== id));
    })
    .catch(err => {
      if (err.code === 'ECONNABORTED') {
        console.log('Request has been exhausted');
      } else {
        console.log(err);
      }
    })
  }
  
  return (
    <div className="home">
      <h2>To Do</h2>
      <Create onAdd={handleAdd} />
      <div className="task-container">
        {console.log(todos)} {/* Verificar el estado de todos antes de mapearlo */}
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
export default Tasks;
