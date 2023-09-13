import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

function CreateDaylies() {
  const [Daylies, setDaylies] = useState()
  const handleAdd = () => {
    axios.post('http://localhost:3001/add-Daylies', {Daylies: Daylies})
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }
  return (
    <div className="create_form">
        <input type="text" placeholder='Ingresa un Pendiente' onChange={(e) => setDaylies(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Agregar</button>
    </div>
  )
}

function Daylies() {
  const [Daylies, setDaylies] = useState ([])

  useEffect(() => {
    axios.get('http://localhost:3001/get-Daylies')
    .then(result => setDaylies(result.data))
    .catch(err => console.log(err))
  }, [])

  const handleEdit = (id) => {
    axios.put(`http://localhost:3001/update-Daylies/${id}`)
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete-Daylies/${id}`)
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }
  
  return (
    <div className="home">
      <h2>Pendientes</h2>
      <CreateDaylies />
      <div className="task-container"> 
      {
      Daylies.length === 0 
      ?
      <div><h2>Sin registro</h2></div>
      :
      Daylies.map(Daylies => (
        <div key={Daylies._id} className='task'>
          <div className='checkbox' onClick={() => handleEdit(Daylies._id)}>
          {Daylies.done ? <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
          :<BsCircleFill className='icon'/>
          }
          <p className={Daylies.done ? "line_through": ""}>{Daylies.name}</p>
          </div>
          <div>
            <span><BsFillTrashFill className='icon' 
            onClick={()=>handleDelete(Daylies._id)}/></span>
          </div>
        </div>
      ))
      }
    </div>
    </div>
  )
}

export default Daylies;
