import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form, 
  Button,
  Container,
  FloatingLabel,
  Card
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function Register() {
  const [ user, setUser ] = useState({})
  const navigate = useNavigate()

  const onChangeHandler = (e) => {
    setUser({
      ...user, 
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
      if(data.errors) {
        Swal.fire(JSON.stringify(data.errors))
      } else {
        Swal.fire(data.msg)
        navigate('/')
      }
    })
    setUser({})
    e.target.reset()
  }
  
  return (
    <Container className='min'>
      <Card className='col-lg-6 mx-auto'>
        <Card.Body>
          <Card.Title>
            <h2 className='text text-center my-4'>
              Welcome, please register an account! <i className='bi-emoji-laughing'></i>
            </h2>
          </Card.Title>

          <Card.Text className='text-center'>
            <Form onSubmit={onSubmitHandler}
            className='px-3'>
              <FloatingLabel controlId='floatingInput' 
              label='Username' 
              className='mb-3'>
                <Form.Control type='text' 
                name='username' 
                placeholder='Username' 
                onChange={onChangeHandler} 
                required />
              </FloatingLabel>

              <FloatingLabel controlId='floatingInput' 
              label='Email' 
              className='mb-3'>
                <Form.Control type='email' 
                name='email' 
                placeholder='Email' 
                onChange={onChangeHandler} 
                required />
              </FloatingLabel>

              <FloatingLabel controlId='floatingInput' 
              label='Password' 
              className='mb-3'>
                <Form.Control type='password' 
                name='password' 
                placeholder='Password' 
                onChange={onChangeHandler} 
                required />
              </FloatingLabel>

              <FloatingLabel controlId='floatingInput' 
              label='Confirm Password' 
              className='mb-3'>
                <Form.Control type='password' 
                name='password2' 
                placeholder='Confirm Password' 
                onChange={onChangeHandler} 
                required />
              </FloatingLabel>
              <Button type="submit" 
              className='bg'>Register</Button>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register