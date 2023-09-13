import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

function CreateHabit() {
  const [habit, setHabit] = useState()
  const handleAdd = () => {
    axios.post('http://localhost:3001/add-habit', {habit: habit})
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
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
    axios.get('http://localhost:3001/get-habits')
    .then(result => setHabits(result.data))
    .catch(err => console.log(err))
  }, [])

  const handleEdit = (id) => {
    axios.put(`http://localhost:3001/update-habit/${id}`)
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete-habit/${id}`)
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }
  
  return (
    <div className="home">
      <h2>Hábitos</h2>
      <CreateHabit />
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
