const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('./public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        const notes = JSON.parse(data);
        res.json(notes);
    })

})

app.post('/api/notes', (req, res) => {

    const newNote = req.body;
    newNote.id = uuidv4();
    console.log(newNote);


    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        const notes = JSON.parse(data)
        console.log(notes);
        notes.push(newNote)
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                throw err;
            }
            res.json(notes);
        })
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const deleteNote = req.params.id;
    console.log(deleteNote);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        const notes = JSON.parse(data)

        for (var i = 0; i < notes.length; i++) {
            if (notes[i].id == deleteNote) {
                notes.splice(i, 1);
                break;
            }
        }
        console.log(notes);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                throw err;
            }
            res.json(notes);
        })
    })

})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});