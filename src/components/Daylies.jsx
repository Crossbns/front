import React, {useEffect, useState} from 'react' // Importing React and hooks from 'react'
import axios from 'axios' // Importing axios for making HTTP requests
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs'; // Importing icons from 'react-icons/bs'

const API_URL = 'https://server-fqc9.onrender.com'; // API base URL

// Component for creating a new daily task
function CreateDaylies({ onAdd }) {
  const [Daylies, setDaylies] = useState() // State for the new daily task

  // Function to handle adding a new daily task
  const handleAdd = () => {
    if (Daylies && Daylies.trim().length > 0) { // Check if the daily task is not empty
      axios.post(`${API_URL}/add-Daylies`, {Daylies: Daylies}) // Send a POST request to add the daily task
      .then(result => {
        onAdd(result.data); // Update the parent component with the new daily task
      })
      .catch(err => {
        console.log(err); // Handle errors
      })
    } else {
      alert('Enter a valid daily.'); // Show an alert if the daily task is empty
    }
  }

  return (
    <div className="create_form">
        <input type="text" placeholder='Add a daily' onChange={(e) => setDaylies(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Add</button>
    </div>
  )
}

// Component for displaying and managing daily tasks
function Daylies() {
  const [Daylies, setDaylies] = useState ([]) // State for the list of daily tasks

  useEffect(() => { // Fetch daily tasks when the component mounts
    axios.get(`${API_URL}/get-Daylies`)
    .then(result => setDaylies(result.data)) // Update the state with the fetched daily tasks
    .catch(err => console.log(err)) // Handle errors
  }, [])

  const handleAdd = (Daylie) => { // Function to handle adding a new daily task to the list
    setDaylies([...Daylies, Daylie]);
  }

  const handleEdit = (id) => { // Function to handle editing a daily task
    axios.put(`${API_URL}/update-Daylies/${id}`) // Send a PUT request to update the daily task
    .then(result => {
      setDaylies(Daylies.map(Daylie => Daylie._id === id ? {...Daylie, done: true} : Daylie)); // Update the state with the updated daily task
    })
    .catch(err => {
      console.log(err); // Handle errors
    })
  }

  const handleDelete = (id) => { // Function to handle deleting a daily task
    axios.delete(`${API_URL}/delete-Daylies/${id}`) // Send a DELETE request to delete the daily task
    .then(result => {
      setDaylies(Daylies.filter(Daylie => Daylie._id !== id)); // Update the state by removing the deleted daily task
    })
    .catch(err => {
      console.log(err); // Handle errors
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

export default Daylies; // Exporting the Daylies component as default
