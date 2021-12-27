import React, { useState } from 'react'
import { 
  Form,
  Button,
  InputGroup
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function AddTodo({setShow, getTodos}) {
  const [ todos, setTodos ] = useState({})

  const onChangeHandler = (e) => {
    setTodos({
      ...todos,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_API_URL}/todo`, {
      method: "POST",
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todos)
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire(data.msg)
      getTodos()
      setShow(false)
    })
  }

  return (
    <Form method="POST"  
    onSubmit={onSubmitHandler}>
      <InputGroup>
        <Form.Control type='text' 
        name='name' 
        placeholder='Todos Name' 
        onChange={onChangeHandler} 
        required />

        <Button type='submit' 
        className='bg'>
          <i className='bi-plus white'></i>
        </Button>
      </InputGroup>
    </Form>
  )
}

export default AddTodo