import React, { useState, useEffect } from 'react'
import {
  Container, 
  Card, 
  Badge,
  Form, 
  Row
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function ShowFeedback() {
  const [ feedbacks, setFeedback ] = useState([])
  const [ category, setCategory ] = useState('')

  const getFeedback = () => {
    fetch(`${process.env.REACT_APP_API_URL}/feedback/${category}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => setFeedback(data))
  }

  useEffect(() => {
    getFeedback()
  }, [category]) // eslint-disable-line react-hooks/exhaustive-deps

  const readHandler = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/feedback/${id}`, {
      method: "PUT",
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire(data.msg)
      getFeedback()
    })
  }

  let showFeedback = feedbacks?.map(feedback => {
    return (
      <div className='col-md-6'
      key={feedback._id}>
        <Card className='mt-5' style={
          !feedback.isView ? 
          {backgroundColor: '#e0f5fc'} 
          : {backgroundColor: '#fce0ee'}
        }>
          <Card.Header>
            <div className='d-flex justify-content-between'>
              <div className='text-d'>
                <i className='bi-inbox'> : </i> {feedback.email} <br/>
                <i className='bi-send'> : </i>{feedback.published.toString()}
              </div>
              <div>
                <Badge className='bg-d'>
                  {feedback.category} 
                </Badge> <br />

                <button onClick={() => readHandler(feedback._id)}
                className='cursor link2 no-deco'>
                {
                  !feedback.isView ? 
                  <i className='bi-eye'> unread</i> 
                  : <i className='bi-check-all'> read</i>
                }
                </button>
              </div>
            </div>

          </Card.Header>
          <Card.Body>
            {
            feedback.image ?
            <img src={`${process.env.REACT_APP_API_URL}/${feedback.image.split('/')[2]}`} 
            height={250} 
            className='width'
            alt={feedback.title} />
            : null
            }
            <Card.Title>{feedback.title}</Card.Title>
            <Card.Text>
              {feedback.feedbackDes}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  })

  return (
    <Container className='min'>
      <h2 className='text-center text-d my-5'>Feedbacks</h2>
        <Form.Select onClick={(e) => setCategory(e.target.value)}>
          <option value=''>All</option>
          <option value='Comment'>Comments</option>
          <option value='Complain'>Complains</option>
          <option value='Event Request'>Event Request</option>
        </Form.Select>

        <Row>
          {showFeedback}
        </Row>
        
    </Container>
  )
}

export default ShowFeedback