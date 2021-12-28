import React, { useEffect, useState } from 'react'
import {
  Form, 
  Button,
  Card,
  Badge, 
  Container,
  FloatingLabel,
  Row
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function Complain() {
  const [ feedback, setFeedback ] = useState({
    category: 'Complain',
    email: JSON.parse(localStorage.getItem('userData'))?.email
  })
  const [ getFeedback, setGetFeedbacks ] = useState([])

  const onChangeHandler = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value
    })
  }

  const imageHandler = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.files[0]
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    
    let formData = new FormData() 
    formData.append('title', feedback.title)
    formData.append('email', feedback.email)
    formData.append('category', feedback.category)
    formData.append('feedbackDes', feedback.feedbackDes)
    formData.set('image', feedback.image)

    fetch(`${process.env.REACT_APP_API_URL}/feedback`, {
      method: "POST",
      headers: {
        'x-auth-token': localStorage.getItem('token')
      },
      body: formData 
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        title: data.msg,  
        icon: 'success',
        confirmButtonColor: '#b27092'
      })
    })
  }
  const getFeedbacks = () => {
    fetch(`${process.env.REACT_APP_API_URL}/feedback/Complain`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => setGetFeedbacks(data))
  }

  useEffect(() => {
    getFeedbacks()
  })
  
  let showFeedback = getFeedback?.map(feedbk => {
    return (
      <div className='col-md-6'>
        <Card className='mt-5'>
          <Card.Header>
            <div className='d-flex justify-content-between'>
              Published on: {feedbk.published.toString()}
              <Badge className='bg-d'>
                {feedbk.category} 
              </Badge>
            </div>
            <div className='d-flex justify-content-end'>
              {
              !feedbk.isView ? 
              <i className='bi-eye'>unread</i> 
              : <i className='bi-check-all'>read</i>
              }
            </div>
          </Card.Header>
          <Card.Body>
            {
            feedbk.image ?
            <img src={`${process.env.REACT_APP_API_URL}/${feedbk.image.split('/')[2]}`} 
            height={200} 
            className='width' 
            alt={feedbk.title} />
            : null
            }
            <Card.Title>{feedbk.title}</Card.Title>
            <Card.Text>
              {feedbk.feedbackDes}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  })

  return (
    <Container className='min'>
      <h2 className='text-d text-center mt-4'>We apologise if this website is not working properly for you. Please leave us a message down below so that we can assist you.</h2>
      <p className='text text-center'>**Please note that once the form is submited it cannot be undone.**</p>

      <Form encType="multiple/form-data" 
      method="POST"  
      onSubmit={onSubmitHandler}>
        <FloatingLabel controlId='floatingInput' 
        label='Email' 
        className='mb-3'>
          <Form.Control type='email' 
          name='email' 
          placeholder='Email' 
          value={JSON.parse(localStorage.getItem('userData'))?.email}
          required />
        </FloatingLabel>

        <FloatingLabel controlId='floatingInput' 
        label='Title' 
        className='mb-3'>
          <Form.Control type='text' 
          name='title' 
          placeholder='Title'
          onChange={onChangeHandler} 
          required />
        </FloatingLabel>

        <Form.Group>
          <Form.Label>Your Complains</Form.Label>
          <Form.Control as='textarea' 
          name='feedbackDes' 
          placeholder='Please input your complain here.' 
          onChange={onChangeHandler} 
          required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Image: </Form.Label>
          <Form.Control type='file' name='image' onChange={imageHandler} required />
        </Form.Group> 

        <Form.Control type='hidden' value='Complain' name='category'/>

        <Button type='submit'
        className='bg mt-3'>Send</Button>
      </Form>
      
      <Row>
        {showFeedback}

      </Row>
    </Container>
  )
}

export default Complain