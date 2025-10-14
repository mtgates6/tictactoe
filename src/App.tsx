import { useState } from 'react'
import './App.css'
import Gameboard from "./components/Gameboard";

function App() {

  return (
    <>
      <div>
        <h1>Tic Tac Toe</h1>
        <Gameboard />
      </div>
    </>
  )
}

export default App;
