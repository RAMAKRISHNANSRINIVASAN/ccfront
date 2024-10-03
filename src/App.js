import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Form,
  Header,
  List,
  Select,
  Input,
  Segment,
  Container,
  Grid,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'; // Import Semantic UI CSS
import './App.css'; // Import custom CSS for additional styling

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState('0'); // Admin = 0, User = 1
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [isbn, setIsbn] = useState(''); // Treating ISBN as long
  const [newTitle, setNewTitle] = useState('');
  const [books, setBooks] = useState([]); // State to hold the list of books
  const [fetchedBook, setFetchedBook] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
  const [openLoginModal, setOpenLoginModal] = useState(false); // State to control login modal
  const [openSignupModal, setOpenSignupModal] = useState(false); // State to control signup modal

  // Fetch all books when the component loads after login
  const fetchBooks = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:9000/api/admin/getBooks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching the books!', error);
      });
  };

  // Handle login
  const loginUser = (e) => {
    e.preventDefault();
    const loginData = { email, password };

    axios
      .post('http://localhost:9000/api/auth/login', loginData)
      .then((response) => {
        const token = response.data.jwt;
        localStorage.setItem('token', token);
        setIsLoggedIn(true); // Set logged in state
        setOpenLoginModal(false); // Close login modal
        alert('Login successful!');
        fetchBooks(); // Fetch books after login
      })
      .catch((error) => {
        console.error('Login failed!', error);
        alert('Login failed! Please check your credentials.');
      });
  };

  // Handle signup
  const signupUser = (e) => {
    e.preventDefault();
    const signupData = {
      email: signupEmail,
      password: signupPassword,
      name,
      userRole: parseInt(userRole, 10),
    };

    axios
      .post('http://localhost:9000/api/auth/signup', signupData)
      .then(() => {
        alert('Signup successful! You can now log in.');
        setOpenSignupModal(false); // Close signup modal
        // Reset signup fields
        setSignupEmail('');
        setSignupPassword('');
        setName('');
        setUserRole('0');
      })
      .catch((error) => {
        console.error('Signup failed!', error);
        alert('Signup failed! Please try again.');
      });
  };

  // Add a book
  const addBook = (e) => {
    e.preventDefault();
    const book = { title, author, publicationYear: parseInt(publicationYear, 10) };
    const token = localStorage.getItem('token');

    axios
      .post('http://localhost:9000/api/admin/addNewBook', book, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        alert('Book added successfully');
        fetchBooks(); // Fetch updated book list
        // Reset book fields
        setTitle('');
        setAuthor('');
        setPublicationYear('');
      })
      .catch((error) => {
        console.error('Error adding the book!', error);
      });
  };

  // Update book title
  const updateBook = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axios
      .put(`http://localhost:9000/api/admin/updateBook/${isbn}/${newTitle}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('Book updated successfully');
        fetchBooks(); // Fetch updated book list
        // Reset update fields
        setIsbn('');
        setNewTitle('');
      })
      .catch((error) => {
        console.error('Error updating the book!', error);
      });
  };

  const getBookById = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve JWT token from local storage

    axios
      .get(`http://localhost:9000/api/admin/getBookById/${isbn}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setFetchedBook(response.data);
          alert('Book found!');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          alert('Book not found!');
        } else if (error.response && error.response.status === 403) {
          alert('You are not authorized to access this resource.');
        } else {
          console.error('Error fetching the book!', error);
        }
      });
  };

  // Remove book
  const removeBook = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axios
      .delete(`http://localhost:9000/api/admin/removeBook/${isbn}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('Book removed successfully');
        fetchBooks(); // Fetch updated book list
        // Reset ISBN field
        setIsbn('');
      })
      .catch((error) => {
        console.error('Error removing the book!', error);
      });
  };

  return (
    <Container className="app-container">
      <Header as="h1" textAlign="center">Book Management</Header>

      <div className="button-container">
        <Button primary onClick={() => setOpenLoginModal(true)}>
          Login
        </Button>
        <Button secondary onClick={() => setOpenSignupModal(true)}>
          Signup
        </Button>
      </div>

      {/* Login Modal */}
      <Modal open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
        <Header content="Login" />
        <Modal.Content>
          <Form onSubmit={loginUser}>
            <Form.Field>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Field>
            <Button type="submit" primary fluid>Login</Button>
          </Form>
        </Modal.Content>
      </Modal>

      {/* Signup Modal */}
      <Modal open={openSignupModal} onClose={() => setOpenSignupModal(false)}>
        <Header content="Signup" />
        <Modal.Content>
          <Form onSubmit={signupUser}>
            <Form.Field>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field>
              <Select
                placeholder="Select Role"
                value={userRole}
                onChange={(e, { value }) => setUserRole(value)}
                options={[
                  { key: 0, value: '0', text: 'Admin' },
                  { key: 1, value: '1', text: 'User' },
                ]}
                required
              />
            </Form.Field>
            <Button type="submit" secondary fluid>Signup</Button>
          </Form>
        </Modal.Content>
      </Modal>

      {/* Book Management Section */}
      {isLoggedIn && (
        <Segment>
          <Header as="h2">Manage Books</Header>
          <Form onSubmit={addBook}>
            <Form.Field>
              <Input
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="number"
                placeholder="Publication Year"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                required
              />
            </Form.Field>
            <Button primary type="submit">Add Book</Button>
          </Form>

          <Header as="h3">Update Book</Header>
          <Form onSubmit={updateBook}>
            <Form.Field>
              <Input
                type="text"
                placeholder="ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="text"
                placeholder="New Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </Form.Field>
            <Button secondary type="submit">Update Book</Button>
          </Form>

          <Header as="h3">Find Book by ISBN</Header>
          <Form onSubmit={getBookById}>
            <Form.Field>
              <Input
                type="text"
                placeholder="ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </Form.Field>
            <Button type="submit">Find Book</Button>
          </Form>

          <Header as="h3">Remove Book</Header>
          <Form onSubmit={removeBook}>
            <Form.Field>
              <Input
                type="text"
                placeholder="ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </Form.Field>
            <Button type="submit" negative>Remove Book</Button>
          </Form>

          {/* Display Fetched Book Details */}
          {fetchedBook && (
            <Segment>
              <Header as="h4">Fetched Book Details:</Header>
              <List>
                <List.Item>Title: {fetchedBook.title}</List.Item>
                <List.Item>Author: {fetchedBook.author}</List.Item>
                <List.Item>Publication Year: {fetchedBook.publicationYear}</List.Item>
                <List.Item>ISBN: {fetchedBook.isbn}</List.Item>
              </List>
            </Segment>
          )}
        </Segment>
      )}

      {/* Display List of Books */}
      {books.length > 0 && (
        <Segment>
          <Header as="h3">Books List</Header>
          <List>
            {books.map((book) => (
              <List.Item key={book.isbn}>
                {book.title} by {book.author} (Published: {book.publicationYear}, ISBN: {book.isbn})
              </List.Item>
            ))}
          </List>
        </Segment>
      )}
    </Container>
  );
}

export default App;
