import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import jwt_decoded from 'jwt-decode'
import {
  Container,
  Offcanvas,
  ListGroup
} from 'react-bootstrap'

import TopNav from './Components/Partials/Navbar'
import Footer from './Components/Partials/Footer'

import Login from './Components/Forms/AuthForm/Login'
import Register from './Components/Forms/AuthForm/Register'
import User from './Components/User'
import Home from './Components/Home'
import Todo from './Components/Todo'
import Habit from './Components/Habit_Goals'
import Event from './Components/Event'
import EventDetails from './Components/EventDetails'
import Feedback from './Components/Feedback'
import './Styles/styles.css'

function App() {
  const [ token, setToken ] = useState('')
  const [ userData, setUserData ] = useState({})
  const [ user, setUser ] = useState({})
  const [ events, setEvent ] = useState([])
  const [ show, setShow ] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const loginHandler = (data) => {
    let decoded = jwt_decoded(data)
    setToken(data)
    setUserData(decoded)
    console.log(userData)
    console.log(token)

    localStorage.setItem('userData', JSON.stringify(decoded))
    localStorage.setItem('token', data)
  }

  const logoutHandler = () => {
    setToken()
    setUserData({})

    localStorage.removeItem('token')
    localStorage.removeItem('userData')
  }

  const getUser = () => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/user`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => setUser(data))
  }

  useEffect(() => {
    getUser()
  }, [])

  const getEvent = () => {
    fetch(`${process.env.REACT_APP_API_URL}/event`)
    .then(res => res.json())
    .then(data => setEvent(data))
  }

  useEffect(() => {
    getEvent()
  }, [])

  let showEvent = events?.map(event => {
    let joined;
    let user;
    if(localStorage.hasOwnProperty('userData')) {
      user = JSON.parse(localStorage.getItem('userData')).id
    }
    event.isGoing.forEach(join => {
      joined = join.userId
    })
      
    return (
      <>
        {
        user === joined ?
        <ListGroup.Item key={`${event._id}-${event.eventName}`}
        as="li">
          <Link to={`/event/${event._id}`} 
          onClick={() => setShow(false)}>
            {event.eventName} 
          </Link>
        </ListGroup.Item>
        : null
        }
      </>
    )
  })

  const username = JSON.parse(localStorage.getItem('userData'))?.username
  return (
    <div className="App">
      <TopNav logoutHandler={logoutHandler} />

      <Container>
        {
        localStorage.hasOwnProperty('userData') ?
        <>
          <h4>
            <i className='bi-person mb-5' 
            onClick={handleShow}> {username}</i>
          </h4>

          <Offcanvas show={show} 
          onHide={handleClose}>
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
              <div className='text-center mb-2 p-4'>
                <i className='bi-person lg border1 p-3'></i>
              </div>

              <h3 className='text'>{user.username} 
                {
                  user.isAdmin ? <small className='text italic'>(Admin)</small>
                : null
                }
              </h3> 
              <p>
                Email: {user.email}
              </p>

              <hr className='text-d'/>

              <h6 className='text'>Joined events: </h6>
              <ListGroup as='ul'>
                {showEvent}
              </ListGroup>
            </Offcanvas.Body>
          </Offcanvas>
        </>
        : <h4 className='text mb-5'>You are not logged in! Please logged in</h4>
        }
      </Container>
      
      <Routes> 
        {
        localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData') ?
        <>
          <Route path='/' element={<Home />} />
          <Route path='/habit' element={<Habit />} />
          <Route path='/todo' element={<Todo />} />
          <Route path='/event' element={<Event />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/event/:id' element={<EventDetails />} />
          <Route path='auth' element={<User />} />
        </>
        : 
        <>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login loginHandler={loginHandler} />} />
        </>
        }
      </Routes>

      <Footer />
    </div>
  )
}

export default App
