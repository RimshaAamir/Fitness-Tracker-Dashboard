import { useState, useEffect } from 'react';
import { fetchEquipmentList, fetchBodyPartList, fetchTargetList } from '../api/exerciseApi';

export const useFilterLists = () => {
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [bodyPartList, setBodyPartList] = useState<string[]>([]);
  const [targetList, setTargetList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilterLists = async () => {
      try {
        const [equipments, bodyParts, targets] = await Promise.all([
          fetchEquipmentList(),
          fetchBodyPartList(),
          fetchTargetList(),
        ]);
        setEquipmentList(equipments);
        setBodyPartList(bodyParts);
        setTargetList(targets);
      } catch {
        setError("Can't load filter options");
      }
    };
    loadFilterLists();
  }, []);

  return { equipmentList, bodyPartList, targetList, error };
};