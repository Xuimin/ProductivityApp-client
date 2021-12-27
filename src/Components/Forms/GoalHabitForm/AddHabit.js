import React, { useState } from 'react'
import { 
  Form,
  FloatingLabel,
  Button
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function Habit({getHabitGoal, setShow}) {
  const [ habit, setHabit ] = useState({
    category: 'Habit'
  })

  const onChangeHandler = (e) => {
    setHabit({
      ...habit,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    
    fetch(`${process.env.REACT_APP_API_URL}/habits`, {
      method: "POST",
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: habit.name,
        category: habit.category,
        timer: null,
        dueOn: null
      })
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire(data.msg)
      getHabitGoal()
      setShow(false)
    })
  }

  return (
    <Form encType="multiple/form-data" 
    method="POST"  
    onSubmit={onSubmitHandler}>
      <FloatingLabel controlId='floatingInput' 
      label='Habit Name' 
      className='mb-3'>
        <Form.Control type='text' 
        name='name' 
        placeholder='Habit Name' 
        onChange={onChangeHandler} 
        required />
      </FloatingLabel>

      <Button type='submit' 
      className='bg'>Add Habit</Button>
    </Form>
  )
}

export default Habit