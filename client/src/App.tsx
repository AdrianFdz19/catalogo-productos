import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<h1>Main</h1>} ></Route>
      </Routes>
    </div>
  )
}

export default App
