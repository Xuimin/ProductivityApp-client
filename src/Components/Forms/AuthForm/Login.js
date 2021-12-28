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
import { GoogleLogin } from 'react-google-login'

function Login({loginHandler}) {
  const [ user, setUser ] = useState({})
  const clientId = '511679159025-ufrrp2o8nelsacpediciqustdjvj9am1.apps.googleusercontent.com'

  const navigate = useNavigate()

  const onChangeHandler = (e) => {
    setUser({
      ...user, 
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Login Successfully',
        showConfirmButton: false,
        timer: 1500
      })
      loginHandler(data.token)
      setTimeout(() => window.location.reload(false), 1500)
      navigate('/')
    })
  }

  const onLoginSuccess = (res) => {
    loginHandler(res.tokenId)
    Swal.fire({
      icon: 'success',
      title: 'Login Successfully',
      showConfirmButton: false,
      timer: 1500
    })
    fetch(`${process.env.REACT_APP_API_URL}/auth/googleLogin`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(res.profileObj)
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: data.msg,
        showConfirmButton: false,
        timer: 1500
      })
      loginHandler(data.token)
      setTimeout(() => { window.location.reload(false)}, 1500)
      navigate('/')
    })
  }
  
  const onFailureSuccess = () => {
    alert('Sorry Login Fail. Please try again later.')
  }

  return (
    <Container className='min'>
      <Card className='col-lg-6 mx-auto'>
        <Card.Body>
          <Card.Title>
            <h2 className='text text-center my-4'>
              Let's go! Login to your account <i className='bi-emoji-laughing'></i>
            </h2>
          </Card.Title>

          <Card.Text className='text-center'>
            <Form onSubmit={onSubmitHandler}
            className='px-3'>
              <FloatingLabel controlId='floatingInput' 
              label='Email' 
              className='mb-3'>
                <Form.Control type='email' 
                name='email' 
                placeholder='Email' 
                onChange={onChangeHandler} 
                required />
              </FloatingLabel>

              <FloatingLabel 
              controlId='floatingInput' 
              label='Password' 
              className='mb-3'>
                <Form.Control 
                type='password' 
                name='password' 
                placeholder='Password' 
                onChange={onChangeHandler} 
                required />
              </FloatingLabel>

              <Button type="submit" 
              className='bg'>Login</Button> 
                  
              <br /><br />
              <p>Or</p>
              
              <GoogleLogin
              clientId={clientId}
              buttonText="Login With Google"
              onSuccess={onLoginSuccess}
              onFailure={onFailureSuccess}
              cookiePolicy={'single_host_origin'} />
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login