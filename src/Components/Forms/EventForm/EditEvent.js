import React, { useState } from 'react'
import {
  Form, 
  Button, 
  FloatingLabel, 
  Col,
  Row
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function EditEvent({events, setShow, id}) {
  const [ event, setEvent ] = useState({
    eventName: events.eventName,
    description: events.description,
    category: events.category,
    timeStart: events.timeStart,
    timeEnd: events.timeEnd,
    location: events.location,
    date: events.date,
    image: events.image,
    _id: events._id
  })

  var today = new Date()
  const d = today.getDate()
  const m = today.getMonth() + 1
  const y = today.getFullYear()
  today = y + '-' + m + '-' + d

  const onChangeHandler = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value
    })
  }
  
  const imageHandler = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.files[0]
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    
    let formData = new FormData() 
    formData.append('eventName', event.eventName)
    formData.append('description', event.description)
    formData.append('category', event.category)
    formData.append('timeStart', event.timeStart)
    formData.append('timeEnd', event.timeEnd)
    formData.append('location', event.location)
    formData.append('date', event.date)
    formData.set('image', event.image)

    fetch(`${process.env.REACT_APP_API_URL}/event/${id}`, {
      method: "PUT",
      headers: {
        'x-auth-token': localStorage.getItem('token')
      },
      body: formData 
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: data.msg,
        showConfirmButton: false,
        timer: 1500
      })
      setShow(false)
      setTimeout(() => window.location.reload(false), 1500)
    })
  }

  return (
    <Form encType="multiple/form-data" 
    onSubmit={onSubmitHandler}>
      <FloatingLabel controlId='floatingInput' 
      label='Event Name' 
      className='mb-3'>
        <Form.Control type='text' 
        name='eventName' 
        placeholder='Event Name' 
        onChange={onChangeHandler} />
      </FloatingLabel>

      <FloatingLabel controlId='floatingInput' 
      label='Event Description' 
      className='mb-3'>
        <Form.Control type='text' 
        name='description' 
        placeholder='Event description' 
        onChange={onChangeHandler} />
      </FloatingLabel>

      <Row>
        <Col>
          <FloatingLabel controlId='floatingInput' 
          label='Event Date' 
          className='mb-3'>
            <Form.Control type='date' 
            name='date' 
            min={today} 
            placeholder='Event Date' 
            onChange={onChangeHandler} />
          </FloatingLabel>
        </Col>

        <Col md='6'>
          <FloatingLabel controlId='floatingInput' 
          label='Event Location' 
          className='mb-3'>
            <Form.Control type='text' 
            name='location' 
            placeholder='Event Location' 
            onChange={onChangeHandler} />
          </FloatingLabel>
        </Col>
      </Row>

      <Row>
        <Col md='6'>
          <FloatingLabel controlId='floatingInput' 
          label='Event Time Start' 
          className='mb-3'>
            <Form.Control type='time' 
            name='timeStart' 
            placeholder='Event Time Start' 
            onChange={onChangeHandler} />
          </FloatingLabel>
        </Col>

        <Col md='6'>
          <FloatingLabel controlId='floatingInput' 
          label='Event Time End' 
          className='mb-3'>
            <Form.Control type='time' 
            name='timeEnd' 
            placeholder='Event Time End' 
            onChange={onChangeHandler} />
          </FloatingLabel>
        </Col>
      </Row>

      <Form.Group>
        <Form.Label>Image: </Form.Label>
        <Form.Control type='file' 
        name='image' 
        onChange={imageHandler} />
      </Form.Group>

      <Form.Select name="category" 
      className='mt-4' 
      onChange={onChangeHandler}>
        <option value="everyone">Choose Category</option>
        <option value='everyone'>Everyone</option>
        <option value='student'>Student</option>
        <option value='children'>Children below 12</option>
        <option value='teenage'>Young Adult above 18</option>
      </Form.Select>
      <Button type='submit' 
      className='bg mt-3'>Save Changes</Button>
    </Form>
  )
}

export default EditEvent