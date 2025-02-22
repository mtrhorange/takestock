import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

function App() {
  const [depId, setDepId] = useState<Number>();
  const [depName, setDepName] = useState("");

  const addDepartment = async () => {
    // fetch('http://localhost:8060/department', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //       "id":depId,
    //       "name":depName
    //     })
    // })
    // fetch('http://localhost:8060/department', {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }}
    // )
    const res = await axios.get("http://localhost:8060/department")
  }

  return (
    <div>
      <h1>Add Department</h1>
      <TextField 
      id="outlined-basic" 
      label="Id" 
      variant="outlined" 
      value={depId} 
      onChange={(e) => {
        setDepId(parseInt(e.target.value));
        }}
      />
      <TextField 
      id="outlined-basic" 
      label="Name" 
      variant="outlined" 
      value={depName} 
      onChange={(e) => {
        setDepName(e.target.value);
        }}
      />
      <Button onClick={addDepartment}>Add</Button>
      <h2>Departments:</h2>
    </div>
  );
}

export default App;
