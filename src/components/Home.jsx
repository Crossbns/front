import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

function Create() {
  const [task, setTask] = useState()
  const handleAdd = () => {
    axios.post('http://localhost:3001/add', {task: task})
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }
  return (
    <div className="create_form">
        <input type="text" placeholder='Ingresa una Tarea' onChange={(e) => setTask(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Agregar</button>
    </div>
  )
}

function Tasks() {
  const [todos, setTodos] = useState ([])

  useEffect(() => {
    axios.get('http://localhost:3001/get')
    .then(result => setTodos(result.data))
    .catch(err => console.log(err))
  }, [])

  const handleEdit = (id) => {
    axios.put('http://localhost:3001/update/'+id)
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }

  const handleDelete = (id) => {
    axios.delete('http://localhost:3001/delete/'+id)
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }

  
  return (
    <div className="home">
      <h2>Tareas</h2>
      <Create />
      <div className="task-container">
        {todos.length === 0 ? (
          <div>
            <h2>Sin registro</h2>
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
