import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

const API_URL = 'https://server-fqc9.onrender.com';

function CreateDaylies({ onAdd }) {
  const [Daylies, setDaylies] = useState()
  const handleAdd = () => {
    if (Daylies && Daylies.trim().length > 0) { // Verifica si el pendiente no está vacío
      axios.post(`${API_URL}/add-Daylies`, {Daylies: Daylies})
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
      alert('Enter a valid daily.'); // Muestra un mensaje si el pendiente está vacío
    }
  }
  return (
    <div className="create_form">
        <input type="text" placeholder='Add a daily' onChange={(e) => setDaylies(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Add</button>
    </div>
  )
}

function Daylies() {
  const [Daylies, setDaylies] = useState ([])

  useEffect(() => {
    axios.get(`${API_URL}/get-Daylies`)
    .then(result => setDaylies(result.data))
    .catch(err => console.log(err))
  }, [])

  const handleAdd = (Daylie) => {
    setDaylies([...Daylies, Daylie]);
  }

  const handleEdit = (id) => {
    axios.put(`${API_URL}/update-Daylies/${id}`)
    .then(result => {
      setDaylies(Daylies.map(Daylie => Daylie._id === id ? {...Daylie, done: true} : Daylie));
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
    axios.delete(`${API_URL}/delete-Daylies/${id}`)
    .then(result => {
      setDaylies(Daylies.filter(Daylie => Daylie._id !== id));
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
      <h2>Daylies</h2>
      <CreateDaylies onAdd={handleAdd} />
      <div className="task-container"> 
      {
      Daylies.length === 0 
      ?
      <div><h2>No Logs</h2></div>
      :
      Daylies.map(Daylie => (
        <div key={Daylie._id} className='task'>
          <div className='checkbox' onClick={() => handleEdit(Daylie._id)}>
          {Daylie.done ? <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
          :<BsCircleFill className='icon'/>
          }
          <p className={Daylie.done ? "line_through": ""}>{Daylie.name}</p>
          </div>
          <div>
            <span><BsFillTrashFill className='icon' 
            onClick={()=>handleDelete(Daylie._id)}/></span>
          </div>
        </div>
      ))
      }
    </div>
    </div>
  )
}

export default Daylies;
