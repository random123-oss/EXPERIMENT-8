const API_URL = '/api/books';

const form = document.getElementById('book-form');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const bookList = document.getElementById('book-list');
const errorText = document.getElementById('error');
const emptyText = document.getElementById('empty');

// saari books laao aur table me dikhao
async function loadBooks() {
  const res = await fetch(API_URL);
  const books = await res.json();

  bookList.innerHTML = '';

  if (books.length === 0) {
    emptyText.classList.remove('hidden');
  } else {
    emptyText.classList.add('hidden');
  }

  books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year || '-'}</td>
      <td>
        <button onclick="editBook(${book.id})">Edit</button>
        <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    `;
    bookList.appendChild(row);
  });
}

// form submit - add ya update dono yahi handle karega
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorText.textContent = '';

  const bookData = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    year: yearInput.value ? parseInt(yearInput.value) : null
  };

  const id = bookIdInput.value;
  let res;

  if (id) {
    // id hai matlab edit mode
    res = await fetch(API_URL + '/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
  } else {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
  }

  if (!res.ok) {
    const err = await res.json();
    errorText.textContent = err.message;
    return;
  }

  resetForm();
  loadBooks();
});

// edit click karne par form me data bhar do
async function editBook(id) {
  const res = await fetch(API_URL + '/' + id);
  const book = await res.json();

  bookIdInput.value = book.id;
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year || '';

  saveBtn.textContent = 'Update book';
  cancelBtn.classList.remove('hidden');
  titleInput.focus();
}

async function deleteBook(id) {
  const sure = confirm('Delete this book?');
  if (!sure) return;

  await fetch(API_URL + '/' + id, { method: 'DELETE' });
  loadBooks();
}

function resetForm() {
  form.reset();
  bookIdInput.value = '';
  saveBtn.textContent = 'Add book';
  cancelBtn.classList.add('hidden');
}

cancelBtn.addEventListener('click', resetForm);

loadBooks();