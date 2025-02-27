import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = 3000;

app.use(cors());
// Statische Dateien im "public" Ordner servieren
app.use(express.static('public'));

// Multer Speicher konfigurieren
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Use original filename instead of random numbers
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const uploadsFile = path.join(__dirname, 'uploads.json');

// Funktion zum Speichern der Upload-Infos
const saveUploadInfo = (fileData) => {
  let uploads = [];
  if (fs.existsSync(uploadsFile)) {
    uploads = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
  }
  uploads.push(fileData);
  fs.writeFileSync(uploadsFile, JSON.stringify(uploads, null, 2));
};

// Datei hochladen
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) throw new Error('Keine Datei hochgeladen');

    const fileData = {
      id: Date.now(),
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      uploadDate: new Date().toISOString(),
    };

    let uploads = [];
    if (fs.existsSync(uploadsFile)) {
      uploads = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
    }
    uploads.push(fileData);
    fs.writeFileSync(uploadsFile, JSON.stringify(uploads, null, 2));

    res.json({ message: 'Datei hochgeladen', file: fileData });
  } catch (error) {
    console.error('Upload Fehler:', error);
    res.status(500).json({ error: error.message });
  }
});

// Neues: Route zum Auslesen der Datei-Infos
app.get('/files', (req, res) => {
  let uploads = [];
  if (fs.existsSync(uploadsFile)) {
    uploads = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
  }
  res.json(uploads);
});

// Neues: Route zum Löschen einer Datei anhand der ID
app.delete('/files/:id', (req, res) => {
  let uploads = [];
  if (fs.existsSync(uploadsFile)) {
    uploads = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
  }
  const fileId = parseInt(req.params.id, 10);
  const fileToDelete = uploads.find((file) => file.id === fileId);
  if (!fileToDelete) return res.status(404).json({ error: 'Datei nicht gefunden' });

  // Datei vom Datenträger löschen
  const filePath = path.join(__dirname, 'public', fileToDelete.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const updatedUploads = uploads.filter((file) => file.id !== fileId);
  fs.writeFileSync(uploadsFile, JSON.stringify(updatedUploads, null, 2));

  res.json({ message: 'Datei gelöscht' });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
