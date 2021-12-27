import React, { useState } from 'react'
import {
  Form,
  FloatingLabel,
  Button
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function AddPlans({getPlans, id, data, setEditing}) {
  const [ plans, setPlans ] = useState({
    title: data.title,
    description: data.description,
    time: data.time,
    date: data.date
  })

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

  const onSubmitHandler = (e) => {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_API_URL}/planner/${id}`, {
      method: "PUT",
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plans)
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire(data.msg)
      setEditing(false)
      getPlans()
    })
  }

  return (
    <Form style={{fontSize: 15}} 
    onSubmit={onSubmitHandler}>
      <FloatingLabel controlId='floatingInput' 
      label='Title' 
      className='mb-3'>
        <Form.Control type='text' 
        name='title' 
        placeholder='Title' 
        onChange={onChangeHandler} 
        value={plans.title} />
      </FloatingLabel>

      <FloatingLabel controlId='floatingInput' 
      label='Description' 
      className='mb-3'>
        <Form.Control type='text' 
        name='description' 
        placeholder='Description' 
        onChange={onChangeHandler} 
        value={plans.description} />
      </FloatingLabel>

      <FloatingLabel controlId='floatingInput' 
      label='Date' 
      className='mb-3'>
        <Form.Control type='date' 
        name='date' 
        placeholder='Date' 
        min={today} 
        onChange={onChangeHandler} 
        value={plans.date} />
      </FloatingLabel>

      <FloatingLabel controlId='floatingInput' 
      label='Time' 
      className='mb-3'>
        <Form.Control type='time'
        name='time' 
        placeholder='Time' 
        onChange={onChangeHandler} 
        value={plans.time} />
      </FloatingLabel>

      <Button type='submit' 
      className='bg'>Save Changes</Button>
    </Form>
  )
}

export default AddPlans