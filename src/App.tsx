import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import NavBar from './components/NavBar';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
      const newTodoItem: Todo = {
        id: todos.length + 1,
        text: newTodo,
        completed: false,
      };
      const newTodos = [...todos, newTodoItem];
      setTodos(newTodos);
      setNewTodo('');
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    localStorage.setItem("todos", JSON.stringify(todos.filter((todo) => todo.id !== id)));
  };

  const startEditingTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setNewTodo('');
  };

  const saveTodo = () => {
    if (editingTodo) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id ? { ...todo, text: newTodo } : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
      setNewTodo('');
    }
  };

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  return (
    <Container style={{maxWidth: 800}}>
      <NavBar />
      <Form onSubmit={addTodo}>
      <Form.Control
        type="text"
        placeholder="Add a new todo..."
        value={newTodo}
        onChange={handleInputChange}
      />
        <Button className="mt-4 mb-4" variant="success" onClick={addTodo}>Add</Button>
      </Form>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item
          className="between"
            key={todo.id}
          >
            {editingTodo && editingTodo.id === todo.id ? (
              <input
                type="text"
                value={newTodo}
                onChange={handleInputChange}
              />
            ) : (
              <p className="lead" onClick={() => toggleTodo(todo.id)}>{todo.text}</p>
            )}
            <div>
            {editingTodo ? 
        <>
          <Button onClick={saveTodo} className="mx-2">Save</Button>
          <Button onClick={cancelEditing} variant="danger">Cancel</Button>
        </>
        : <>
            <Button onClick={() => startEditingTodo(todo)} className="mx-2">Edit</Button>
            <Button onClick={() => deleteTodo(todo.id)} variant="danger">Delete</Button>
            </>
}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default App;
