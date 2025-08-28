import './App.css'
import Dashboard from './pages/Dashboard';
import ExerciseDetails from './pages/ExerciseDetails';
import MyWorkouts from './pages/MyWorkouts';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
function App() {

return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path ="/exercise/:id" element={<ExerciseDetails/>}/>
        <Route path = "/workouts" element={<MyWorkouts/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );  
}

export default App
