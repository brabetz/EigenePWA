<script setup>
import { useStore } from '../stores/myStore.js';
import { computed, onMounted } from 'vue';

const store = useStore();

// Lade die Dateien wenn die Komponente gemountet wird
onMounted(() => {
  store.fetchFiles();
});

// Verwende den dataStore aus dem Pinia Store als reaktive Quelle
const files = computed(() => store.dataStore);

// Löscht die Datei und aktualisiert die Liste
const deleteFile = async (id) => {
  await store.deleteFile(id);
  store.fetchFiles();
};

// Erstelle die Download-URL basierend auf dem Serverpfad
const downloadFileUrl = (file) => {
  return `http://localhost:3000${file.path}`;
};
</script>

<template>
  <q-page padding>
    <div class="q-gutter-md row justify-center">
      <q-card
        v-for="file in files"
        :key="file.id"
        class="my-card q-ma-md"
        style="
          width: 300px;
          height: 20vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <q-card-section>
          <div class="text-h6">{{ file.filename }}</div>
          <div class="text-subtitle2">Hochgeladen am: {{ file.uploadDate }}</div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-none">
          <q-btn
            flat
            label="Download"
            tag="a"
            :href="downloadFileUrl(file)"
            :download="file.filename"
            target="_blank"
          />
          <q-btn flat label="Löschen" color="negative" @click="deleteFile(file.id)" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped></style>
