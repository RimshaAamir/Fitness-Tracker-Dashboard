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

export const fetchExercisesByName = async (name: string) => {
  const response = await api.get(`/exercises/name/${name}`);
  return response.data;
};  

export const fetchExercisesByBodyPart = async (bodyPart: string) => {
  const response = await api.get(`/exercises/bodyPart/${bodyPart}`);
  return response.data;
};

export const fetchExercisesByEquipment = async (equipment: string) => {
  const response = await api.get(`/exercises/equipment/${equipment}`);
  return response.data;
};

export const fetchEquipmentList = async () => {
    const response = await api.get(`/exercises/equipmentList`);
    return response.data;
}

export const fetchBodyPartList = async () => {
  const response = await api.get("/exercises/bodyPartList");
  return response.data;
};

export const fetchTargetList = async () => {
  const response = await api.get("/exercises/targetList");
  return response.data;
};

export const fetchExercisesByTarget = async (target: string) => {
  const response = await api.get(`/exercises/target/${target}`);
  return response.data;
};