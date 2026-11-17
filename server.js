const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// body ko json me padhne ke liye
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});

// database nahi hai abhi, bas array use kar rahe hai
let books = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', year: 2018 },
  { id: 2, title: 'The Alchemist', author: 'Paulo Coelho', year: 1988 }
];
let nextId = 3;

// GET all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// GET one book by id
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// POST - add new book
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const newBook = {
    id: nextId++,
    title: title,
    author: author,
    year: year || null
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT - update a book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author, year } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  book.title = title;
  book.author = author;
  book.year = year || null;

  res.json(book);
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.json({ message: 'Book deleted' });
});

app.listen(PORT, () => {
  console.log('Server chal raha hai: http://localhost:' + PORT);
});