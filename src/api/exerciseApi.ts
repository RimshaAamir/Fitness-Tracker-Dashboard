import axios from "axios";

const API_HOST = "exercisedb.p.rapidapi.com";
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

const api = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST,
  },
});


export const fetchAllExercises = async () => {
  const response = await api.get("/exercises");
  return response.data; 
};


export const fetchExerciseById = async (id: string) => {
  const response = await api.get(`/exercises/exercise/${id}`);
  return response.data;
};
