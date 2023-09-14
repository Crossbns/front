import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

const API_URL = 'https://server-fqc9.onrender.com';

function CreateHabit({ onAdd }) {
  const [habit, setHabit] = useState()
  const handleAdd = () => {
    if (habit && habit.trim().length > 0) { // Verifica si el hábito no está vacío
      axios.post(`${API_URL}/add-habit`, {habit: habit})
      .then(result => {
        onAdd(result.data);
      })
      .catch(err => {
        if (err.code === 'ECONNABORTED') {
          console.log('La solicitud se ha agotado');
        } else {
          console.log(err);
        }
      })
    } else {
      alert('Por favor, ingresa un hábito válido.'); // Muestra un mensaje si el hábito está vacío
    }
  }
  return (
    <div className="create_form">
        <input type="text" placeholder='Ingresa un Hábito' onChange={(e) => setHabit(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Agregar</button>
    </div>
  )
}

function Habits() {
  const [habits, setHabits] = useState ([])

  useEffect(() => {
    axios.get(`${API_URL}/get-habits`)
    .then(result => setHabits(result.data))
    .catch(err => console.log(err))
  }, [])

  const handleAdd = (habit) => {
    setHabits([...habits, habit]);
  }

  const handleEdit = (id) => {
    axios.put(`${API_URL}/update-habit/${id}`)
    .then(result => {
      setHabits(habits.map(habit => habit._id === id ? {...habit, done: true} : habit));
    })
    .catch(err => {
      if (err.code === 'ECONNABORTED') {
        console.log('La solicitud se ha agotado');
      } else {
        console.log(err);
      }
    })
  }

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/delete-habit/${id}`)
    .then(result => {
      setHabits(habits.filter(habit => habit._id !== id));
    })
    .catch(err => {
      if (err.code === 'ECONNABORTED') {
        console.log('La solicitud se ha agotado');
      } else {
        console.log(err);
      }
    })
  }
  
  return (
    <div className="home">
      <h2>Hábitos</h2>
      <CreateHabit onAdd={handleAdd} />
      <div className="task-container">
      {
      habits.length === 0 
      ?
      <div><h2>Sin registro</h2></div>
      :
      habits.map(habit => (
        <div key={habit._id} className='task'>
          <div className='checkbox' onClick={() => handleEdit(habit._id)}>
          {habit.done ? <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
          :<BsCircleFill className='icon'/>
          }
          <p className={habit.done ? "line_through": ""}>{habit.name}</p>
          </div>
          <div>
            <span><BsFillTrashFill className='icon' 
            onClick={()=>handleDelete(habit._id)}/></span>
          </div>
        </div>
      ))
      }
    </div>
    </div>
  )
}

export default Habits;
