import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5001;

app.use(cors()); // Enable CORS
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'participants.json');

// Load participants from JSON file
const loadParticipants = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return { title: '', participants: [], drawResult: [] };
};

// Save participants to JSON file
const saveParticipants = (participants) => {
    fs.writeFileSync(filePath, JSON.stringify(participants, null, 2));
};

// Get all participants
app.get('/participants', (req, res) => {
    const participants = loadParticipants();
    res.json(participants);
});

// Add a new participant
app.post('/participants', (req, res) => {
    const participants = loadParticipants();
    const newParticipant = req.body;
    participants.participants.push(newParticipant);
    saveParticipants(participants);
    res.status(201).json(newParticipant);
});

// Remove a participant by name
app.delete('/participants/:name', (req, res) => {
    const { name } = req.params;
    const participantsData = loadParticipants();

    const initialLength = participantsData.participants.length;
    participantsData.participants = participantsData.participants.filter(p => p.name !== name);

    if (participantsData.participants.length < initialLength) {
        saveParticipants(participantsData);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Participant not found' });
    }
});

// Update the title with the generated code and save the draw result
app.post('/update-title', (req, res) => {
    const { title, drawResult } = req.body;
    const participantsData = loadParticipants();
    participantsData.title = title;
    participantsData.drawResult = drawResult; // Save the draw result
    saveParticipants(participantsData);
    res.status(200).json({ message: 'Title and draw result updated successfully' });
});

// Add a new participant to the array with the matching title
app.post('/participants/:title', (req, res) => {
    const { title } = req.params;
    const newParticipant = req.body;
    const participantsData = loadParticipants();

    if (participantsData.title === title) {
        participantsData.participants.push(newParticipant);
        saveParticipants(participantsData);
        res.status(201).json(newParticipant);
    } else {
        res.status(404).json({ message: 'Title not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
