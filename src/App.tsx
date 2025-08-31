import './App.css';
import Dashboard from './pages/Dashboard';
import ExerciseDetails from './pages/ExerciseDetails';
import MyWorkouts from './pages/MyWorkouts';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



function App() {
  return (
 <>
  <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercise/:id" element={<ExerciseDetails />} />
            <Route
              path="/workouts"
              element={
                <>
                  <SignedIn>
                    <MyWorkouts />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </BrowserRouter></>
  );
}

export default App;