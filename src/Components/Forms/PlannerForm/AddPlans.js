import React, { useState } from 'react'
import {
  Form,
  FloatingLabel,
  Button
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function AddPlans({setShow, getPlans}) {
  const [ plans, setPlans ] = useState({})

  var today = new Date()
  const d = today.getDate()
  const m = today.getMonth() + 1
  const y = today.getFullYear()
  today = y + '-' + m + '-' + d

  const onChangeHandler = (e) => {
    setPlans({
      ...plans, 
      [e.target.name]: e.target.value
    })
  }
  console.log(plans)

  const onSubmitHandler = (e) => {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_API_URL}/planner`, {
      method: "POST",
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plans)
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        title: data.msg,  
        icon: 'success',
        confirmButtonColor: '#b27092'
      })
      setShow(false)
      getPlans()
    })
  }

  return (
    <Form method="POST"  
    onSubmit={onSubmitHandler}>
      <FloatingLabel controlId='floatingInput' 
      label='Title' 
      className='mb-3'>
        <Form.Control type='text' 
        name='title' 
        placeholder='Title' 
        onChange={onChangeHandler} 
        required />
      </FloatingLabel>

      <FloatingLabel controlId='floatingInput' 
      label='Description' 
      className='mb-3'>
        <Form.Control type='text' 
        name='description' 
        placeholder='Description' 
        onChange={onChangeHandler} 
        required />
      </FloatingLabel>

      <FloatingLabel controlId='floatingInput' 
      label='Date' 
      className='mb-3'>
        <Form.Control type='date' 
        name='date' 
        placeholder='Date' 
        min={today} 
        onChange={onChangeHandler} 
        required />
      </FloatingLabel>

      <FloatingLabel controlId='floatingInput' 
      label='Time' 
      className='mb-3'>
        <Form.Control type='time' 
        name='time' 
        placeholder='Time' 
        onChange={onChangeHandler} 
        required />
      </FloatingLabel>

      <Button type='submit' 
      className='bg'>Add to Planner</Button>
    </Form>
  )
}

export default AddPlans