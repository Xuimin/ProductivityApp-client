import React, { useState } from 'react'
import { 
  Form,
  FloatingLabel,
  Button,
  Card
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function EditGoals({getHabitGoal, setEditing1, id, data}) {
  const [ goals, setGoals ] = useState({
    category: 'Goals',
    name: data.name,
    timer: data.timer,
    dueOn: data.dueOn
  })

  var today = new Date()
  const d = today.getDate()
  const m = today.getMonth() + 1
  const y = today.getFullYear()
  today = y + '-' + m + '-' + d

  const onChangeHandler = (e) => {
    setGoals({
      ...goals,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_API_URL}/habits/` + id, {
      method: "PUT",
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(goals)
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: data.msg,
        showConfirmButton: false,
        timer: 1500
      })
      getHabitGoal()
      setEditing1(false)
      setTimeout(() => window.location.reload(false), 1500)
    })
  }

  return (
    <Card className='mt-3'>
      <Card.Body>
        <Form style={{fontSize: 15}} 
        encType="multiple/form-data"  
        onSubmit={onSubmitHandler}>
          <FloatingLabel controlId='floatingInput' 
          label='Goals Name' 
          className='mb-3'>
            <Form.Control type='text' 
            name='name' 
            placeholder='Goals Name' 
            onChange={onChangeHandler} 
            value={goals.name} 
            required />
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' 
          label='Timer' 
          className='mb-3'>
            <Form.Control type='time' 
            name='timer' 
            placeholder='Timer' 
            onChange={onChangeHandler} 
            required/>
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' 
          label='Due Date' 
          className='mb-3'>
            <Form.Control type='date' 
            name='dueOn' 
            placeholder='Due Date' 
            min={today} 
            onChange={onChangeHandler} 
            required/>
          </FloatingLabel>
          <Button type='submit' 
          className='bg'>Save Changes</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default EditGoals