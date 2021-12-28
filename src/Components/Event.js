import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { 
  Accordion,
  Button,
  Container,
  Modal,
  Form
} from 'react-bootstrap'
import AddEvent from './Forms/EventForm/AddEvent'

function Event() {
  const [ events, setEvent ] = useState([])
  const [ show, setShow ] = useState(false)
  const [ fullscreen, setFullscreen ] = useState(true)
  const handleClose = () => setShow(false)
  const [ category, setCategory ] = useState('')

  function handleShow(breakpoint) {
    setFullscreen(breakpoint)
    setShow(true)
  }

  const getEvents = () => {
    fetch(`${process.env.REACT_APP_API_URL}/event/${category}`)
    .then(res => res.json())
    .then(data => setEvent(data))
  }

  useEffect(() => {
    getEvents()
  }, [category]) // eslint-disable-line react-hooks/exhaustive-deps

  const joinHandler = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/event/join/${id}`, {
      method: "POST",
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: data.msg,
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => window.location.reload(false), 1500)
    })
  }

  let showEvent = events?.map(event => {
    const user = JSON.parse(localStorage.getItem('userData'))?.id
    let users;
    event.isGoing?.forEach(user => {
      users = user.userId
    })
    return (
      <>
        <Accordion.Item key={event._id}
        eventKey={event._id}>
          <Accordion.Header>
            <Link className='link2'
            to={`/event/${event._id}`}>
            {event.eventName} ({event.category})
            </Link>
          </Accordion.Header>
            <Accordion.Body>
              <div className='d-flex justify-content-between'>
                <div>
                  <i className='bi-geo-alt'> {event.location}</i> <br />
                  <i className='bi-calendar3'> {event.date}</i> <br />
                  <i className='bi-clock'> {event.timeStart} → { event.timeEnd}</i>
                </div>

                <Button className='bg'
                onClick={() =>joinHandler(event._id)}>
                  {
                  users === user ?
                  'Unjoin' : 'Join'
                  }
                </Button>
              </div>
          </Accordion.Body> 
        </Accordion.Item>
      </>
    )
  })

  return (
    <Container className='min'>
      <h2 className='text-center text-d'>All Events
      {
        JSON.parse(localStorage.getItem('userData')).isAdmin ?
        <i className='bi-patch-plus md cursor ms-3' 
        onClick={() => handleShow('md-down')}></i>
        : null
      }  
      </h2>

      <div className='d-flex justify-content-end my-4'>
        <div className='sm-width'>
          <Form.Select className='cursor'
          onClick={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value='category/everyone'>Everyone</option>
            <option value='category/student'>Student</option>
            <option value='category/children'>Children below 12</option>
            <option value='category/teenage'>Young Adult above 18</option>
          </Form.Select>
        </div>
      </div>

      <Modal show={show} 
      fullscreen={fullscreen} 
      onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add New Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEvent getEvents={getEvents} 
          setShow={setShow} />
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-d' 
          onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Accordion>
        {showEvent}
      </Accordion>
    </Container>
  )
}

export default Event