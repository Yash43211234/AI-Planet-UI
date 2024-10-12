const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// Use CORS middleware
app.use(cors());

// Middleware for parsing form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Use your MySQL username
  password: '',  // Use your MySQL password
  database: 'challengesDB'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.get('/challenge/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM challenges WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Challenge not found');
    }
  });
});

app.get('/challenges', (req, res) => {
  const query = 'SELECT * FROM challenges';
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


// Route to handle form submission
app.post('/submit', upload.single('image'), (req, res) => {
  const { challengeName, startDate, endDate, description, levelType } = req.body;
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

console.log(imagePath);


console.log("++++++++");

  const query = 'INSERT INTO challenges (challengeName, startDate, endDate, description, image, levelType) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [challengeName, startDate, endDate, description, imagePath, levelType], (err, result) => {
    if (err) throw err;
    res.send('Challenge submitted successfully!');
  });
});

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
