import React, {useEffect, useState} from 'react' // Importing React and hooks from 'react'
import axios from 'axios' // Importing axios for making HTTP requests
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs'; // Importing icons from 'react-icons/bs'

const API_URL = 'https://server-fqc9.onrender.com'; // API base URL

// Component for creating a new habit
function CreateHabit({ onAdd }) {
  const [habit, setHabit] = useState() // State for the new habit

  // Function to handle adding a new habit
  const handleAdd = () => {
    if (habit && habit.trim().length > 0) { // Check if the habit is not empty
      axios.post(`${API_URL}/add-habit`, {habit: habit}) // Send a POST request to add the habit
      .then(result => {
        onAdd(result.data); // Update the parent component with the new habit
      })
      .catch(err => {
        console.log(err); // Handle errors
      })
    } else {
      alert('Enter a valid habit.'); // Show an alert if the habit is empty
    }
  }

  return (
    <div className="create_form">
        <input type="text" placeholder='Add an habit' onChange={(e) => setHabit(e.target.value)}/> 
        <button type="button" onClick={handleAdd}>Add</button>
    </div>
  )
}

// Component for displaying and managing habits
function Habits() {
  const [habits, setHabits] = useState ([]) // State for the list of habits

  useEffect(() => { // Fetch habits when the component mounts
    axios.get(`${API_URL}/get-habits`)
    .then(result => setHabits(result.data)) // Update the state with the fetched habits
    .catch(err => console.log(err)) // Handle errors
  }, [])

  const handleAdd = (habit) => { // Function to handle adding a new habit to the list
    setHabits([...habits, habit]);
  }

  const handleEdit = (id) => { // Function to handle editing a habit
    axios.put(`${API_URL}/update-habit/${id}`) // Send a PUT request to update the habit
    .then(result => {
      setHabits(habits.map(habit => habit._id === id ? {...habit, done: true} : habit)); // Update the state with the updated habit
    })
    .catch(err => {
      console.log(err); // Handle errors
    })
  }

  const handleDelete = (id) => { // Function to handle deleting a habit
    axios.delete(`${API_URL}/delete-habit/${id}`) // Send a DELETE request to delete the habit
    .then(result => {
      setHabits(habits.filter(habit => habit._id !== id)); // Update the state by removing the deleted habit
    })
    .catch(err => {
      console.log(err); // Handle errors
    })
  }
  
  return (
    <div className="home">
      <h2>Habits</h2>
      <CreateHabit onAdd={handleAdd} />
      <div className="task-container">
      {
      habits.length === 0 
      ?
      <div><h2>No Logs</h2></div>
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

export default Habits; // Exporting the Habits component as default
