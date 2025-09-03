import "./App.css";
import Dashboard from "./pages/Dashboard";
import ExerciseDetails from "./pages/ExerciseDetails";
import MyWorkouts from "./pages/MyWorkouts";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
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
      <Footer />
    </BrowserRouter>
  );
}

export default App;