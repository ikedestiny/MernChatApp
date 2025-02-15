import { Routes, Route, Navigate } from 'react-router-dom'
import Chat from './pages/Chat'
import Register from './pages/Register'
import Login from './pages/Login'
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import Navbar from './components/Navbar'
import { userStore } from "./state/userStore";


function App() {
  const { LoggedInUsername } = userStore()

  return (
    <>
      <Navbar />

      <Container >
        <Routes>
          <Route path='/' element={LoggedInUsername ? <Chat /> : <Login />} />
          <Route path='/register' element={LoggedInUsername ? <Chat /> : <Register />} />
          <Route path='/login' element={LoggedInUsername ? <Chat /> : <Login />} />
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>


  )
}

export default App
