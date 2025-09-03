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

// // Remove API usage for fetchAllExercises, use local JSON instead
// export const fetchAllExercises = async () => {
//   // Adjust the path as needed based on your project structure
//   const response = await fetch('../../data/exercices.json');
//   if (!response.ok) {
//     throw new Error('Failed to load exercises data');
//   }
//   return await response.json();
// };
export const fetchAllExercises = async () => {
  const response = await api.get("/exercises");
  return response.data; 
};


// export const fetchExerciseById = async (id: string) => {
//   const response = await fetch('../../data/exercise1.json');
//   return await response.json();
// };

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

// export const fetchEquipmentList = async () => {
//   const response = await fetch('../../data/equipmentList.json');
//   if (!response.ok) {
//     throw new Error('Failed to load equipment list');
//   }
//   return await response.json();
// };

// export const fetchBodyPartList = async () => {
//   const response = await fetch('../../data/bodyPartList.json');
//   if (!response.ok) {
//     throw new Error('Failed to load body part list');
//   }
//   return await response.json();
// };

// export const fetchTargetList = async () => {
//   const response = await fetch('../../data/targetList.json');
//   if (!response.ok) {
//     throw new Error('Failed to load target list');
//   }
//   return await response.json();
// };


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

export const fetchExerciseImage = async (resolution: number, exerciseId: string) => {
  const response = await api.get(`/image`, {
    params: {
      resolution,
      exerciseId,
    },
    responseType: "arraybuffer", 
  });

  const binary = new Uint8Array(response.data);   // Convert binary data to base64 so it can be used as <img src="..." />
  let binaryString = "";
  for (let i = 0; i < binary.length; i++) {
    binaryString += String.fromCharCode(binary[i]);
  }
  const base64Image = btoa(binaryString);
  const contentType = response.headers["content-type"] || "image/gif";
  
  return `data:${contentType};base64,${base64Image}`;
};

