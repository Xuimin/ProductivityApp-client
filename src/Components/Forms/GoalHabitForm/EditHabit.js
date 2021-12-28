import React, { useState } from 'react'
import { 
  Form,
  FloatingLabel,
  Button, 
  Card,
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function EditHabit({getHabitGoal, id, data, setEditing}) {
  const [ habits, setHabit ] = useState({
    category: 'Habit',
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
    setHabit({
      ...habits,
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
      body: JSON.stringify({
        name: habits.name,
        category: habits.category,
        timer: null,
        dueOn: null
      })
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        title: data.msg,  
        icon: 'success',
        confirmButtonColor: '#b27092'
      })
      getHabitGoal()
      setEditing(false)
    })
  }

  return (
    <Card className='mt-3'>
      <Card.Body>
        <Form style={{fontSize: 15}}
        encType="multiple/form-data" 
        onSubmit={onSubmitHandler}>
          <FloatingLabel controlId='floatingInput' 
          label='Habit Name' 
          className='mb-3'>
            <Form.Control type='text' 
            name='name' 
            placeholder='Habit Name' 
            onChange={onChangeHandler} 
            value={habits.name} 
            required />
          </FloatingLabel>

          <Button type='submit' 
          className='bg'>Save Changes</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default EditHabit