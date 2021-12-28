import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  Card
} from 'react-bootstrap'
import EditEvent from './Forms/EventForm/EditEvent'

function EventDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [ event, setEvent ] = useState({})

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/event/` + id)
    .then(res => res.json())
    .then(data => setEvent(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [ show, setShow ] = useState(false)
  const [ fullscreen, setFullscreen ] = useState(true)
  const handleClose = () => setShow(false)

  function handleShow(breakpoint) {
    setFullscreen(breakpoint)
    setShow(true)
  }

  const deleteHandler = () => {
    Swal.fire({
      'title': 'Are you sure?',
      'text': "You won't be able to revert this!",
      'icon': 'warning',
      'showCancelButton': true,
      'confirmButtonColor': '#b27092',
      'cancelButtonColor': '#512d38',
      'confirmButtonText': 'Yes, delete it!'
  }).then(result => {
      if(result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/event/` + id , {
          method: "DELETE",
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        })
        .then(res => res.json())
        .then(data => {
          Swal.fire({
            title: 'Deleted', 
            text: data.msg, 
            icon: 'success',
            confirmButtonColor: '#b27092'
          })
          navigate('/event')
        })
      }
    })
  }

  return (
    <Container className='min'>
      <h1>Event Details</h1>
      <br />

      <button onClick={() => navigate('/')} 
      className='cursor link2 no-deco'>
        <i className='bi-box-arrow-left'> </i>
        Go back to Home Page
      </button>
      <br />
      <button onClick={() => navigate('/event')}
      className='cursor link2 no-deco'>
        <i className='bi-box-arrow-left'> </i>
        Go back to Event Page
      </button>

      <div>
        <Row className='m-auto'>
          <Col md='5' className='text-center my-auto'>
            {
            event.image ?
            <img src={`${process.env.REACT_APP_API_URL}/${event.image.split('/')[2]}`} 
            height={300} 
            className='width'
            alt={event.eventName} />
            : null
            }
          </Col>

          <Col md='5' className='my-auto'>
            <Card>
              <Card.Body>
                <h4 className='text-d'>
                  {event.eventName} 
                  {
                    JSON.parse(localStorage.getItem('userData')).isAdmin ?
                    <i onClick={handleShow} className='bi-pencil ms-2 cursor'></i>
                    : null
                  }
                  <small style={{fontSize: 12}}>
                    {
                    event.isUpdated ? 
                    'edited' : null
                    }
                  </small>
                </h4>
                <p>
                  <i className='bi-card-text'> </i>
                  {event.description}
                </p>
                <p>
                  <i className='bi-geo-alt'> </i>
                  {event.location}
                </p>
                <p>
                  <i className='bi-people'> </i>
                  {event.category}
                </p>
                <p>
                  <i className='bi-clock'> </i>
                  {event.timeStart} - {event.timeEnd}
                </p>
                <p>
                  <i className='bi-calendar3'> </i>
                  {event.date}
                </p>
                <div className='text-end'>
                  {
                    JSON.parse(localStorage.getItem('userData')).isAdmin ?
                    <Button className='bg'
                    onClick={deleteHandler}>Delete</Button>
                    : null
                  }
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={show} 
        fullscreen={fullscreen} 
        onHide={() => 
        setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Edit {event.eventName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditEvent events={event} 
            setShow={setShow} 
            id={id} />
          </Modal.Body>
          <Modal.Footer>
            <Button className='bg-d' 
            onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  )
}

export default EventDetails