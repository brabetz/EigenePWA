import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useStore = defineStore('MyStore', () => {
  const dataStore = ref([]);

  // Methode zum Abrufen der Dateien vom neuen Server
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/files');
      dataStore.value = response.data;
    } catch (error) {
      console.error(error);
    }
  };

  // Methode zum Hochladen einer Datei, angepasst an den neuen Server
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Füge die neue Datei (inklusive uploadDate) dem Store hinzu
      dataStore.value.push(response.data.file);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Neue Methode zum Löschen einer Datei vom neuen Server
  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/files/${id}`);
      dataStore.value = dataStore.value.filter((file) => file.id !== id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    dataStore,
    fetchFiles,
    uploadFile,
    deleteFile,
  };
});
