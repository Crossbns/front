import { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Habits from './components/Habits';
import Daylies from './components/Daylies';
import Footer from './components/Footer';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    <div className="form-container">
     <Home/>
     <Habits/>
     <Daylies/>
    </div>
    <Footer/>
    </div>
  )
}


export default App;