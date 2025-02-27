<script setup>
import { ref } from 'vue';
import { useStore } from '../stores/myStore.js';

const store = useStore();
const selectedFile = ref(null);

const onFileSelected = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleUpload = async () => {
  if (selectedFile.value) {
    try {
      const response = await store.uploadFile(selectedFile.value);
      console.log('Upload erfolgreich:', response);
      // Optionale Rückmeldung oder weitere Aktionen
      selectedFile.value = null;
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
    }
  } else {
    console.error('Keine Datei ausgewählt.');
  }
};
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-md" style="max-width: 400px; margin: auto">
        <q-card-section>
          <div class="text-h6">Datei hochladen</div>
        </q-card-section>
        <q-card-section>
          <!-- Hinzugefügtes name-Attribut -->
          <input type="file" name="file" @change="onFileSelected" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Hochladen" color="primary" @click="handleUpload" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
/* Füge hier ggf. eigene Styles hinzu */
</style>
