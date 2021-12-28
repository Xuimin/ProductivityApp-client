import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Swal from 'sweetalert2'
import {
  Col, 
  Row,
  Container,
  FormControl,
  InputGroup, 
  Button, 
  ListGroup,
  Badge,
  Card,
  Modal
} from 'react-bootstrap'
import AddPlans from './Forms/PlannerForm/AddPlans'
import EditPlans from './Forms/PlannerForm/EditPlans'

function Home() {
  const [ date, setDate ] = useState(new Date())
  const [ events, setEvent ] = useState([])
  const [ plans, setPlan ] = useState([])
  const [ key, setKey ] = useState('')
  const [ quotes, setQuotes ] = useState([])
  const [ editing, setEditing ] = useState(false)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getEvents = () => {
    if(key) {
      fetch(`${process.env.REACT_APP_API_URL}/event/search/${key}`)
      .then(res => res.json())
      .then(data => setEvent(data))
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/event`)
      .then(res => res.json())
      .then(data => setEvent(data))
    }
  }

  useEffect(() => {
    getEvents()
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const getPlans = () => {
    fetch(`${process.env.REACT_APP_API_URL}/planner`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => setPlan(data))
  }

  useEffect(() => {
    getPlans()
  }, [])

  const getQuotes = () => {
    fetch("https://type.fit/api/quotes")
    .then(res => res.json())
    .then(data => setQuotes(data))
  }

  useEffect(() => {
    getQuotes()
  }, [])

  const q = Math.floor(Math.random() * quotes.length)

  const deleteHandler = (id) => {
    Swal.fire({
      'title': 'Are you sure?',
      'text': "You won't be able to revert this!",
      'icon': 'warning',
      'showCancelButton': true,
      'confirmButtonColor': '#3085d6',
      'cancelButtonColor': '#d33',
      'confirmButtonText': 'Yes, delete it!'
  }).then(result => {
      if(result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/planner/${id}`, {
          method: "DELETE",
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        })
        .then(res => res.json())
        .then(data => {
          Swal.fire('Deleted', data.msg, 'success')
          getPlans()
        })
      }
    })
  }

  const showCalendarDetails = events?.map(event => {
    // console.log(Date.parse(date))
    // console.log(Date.parse(event.date) - 28800000)
    return (
      <>
      {
      Date.parse(date) === (Date.parse(event.date) - 28800000) ? 
      <Card key={event._id}>
        <Card.Body>
          <Card.Title className='d-inline text'>{event.eventName} </Card.Title>
          <small>
            <Link to={`/event/${event._id}`} className='link'>
              [See Details]<i className='bi-arrow-right-circle ms-1'></i>
            </Link>
          </small>
        </Card.Body>
      </Card>
      : null
      }
      </>
    )
  })

  const showEvent = events?.map(event => {  
    return (
      <>
        {
          // console.log(Date.now()),
          // console.log(Date.parse(event.date)),
        Date.parse(event.date) + 86400000 > Date.now() ?
        <ListGroup.Item as="li"
        key={event._id}>
          <div className="ms-2 mt-2 me-auto d-flex justify-content-between">
            <h5 className="fw-bold text-d">
              {
                localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData') ?
                <Link className='link2'
                to={`/event/${event._id}`}>
                  {event.eventName}
                </Link>
                : event.eventName
              }
            </h5>
            <h5>
              <Badge className='ms-2 bg' 
              pill>
                {event.isGoing.length}
              </Badge>
            </h5>
          </div>
        
          <div className="ms-2 mb-2 me-auto">
            <i className='bi-clock'> {event.timeStart} → {event.timeEnd}</i> <br />
            <i className='bi-calendar3'> {event.date}</i>
          </div>
        </ListGroup.Item>
        : null
        }
      </>
    )
  })

  const showPlans = plans?.planner?.map(plan => {
    return (
      <>
      {
      Date.parse(date) === (Date.parse(plan.date) - 28800000) ?
      <Card key={plan._id}>
        <Card.Body>
          <Card.Title className='d-inline'>
            <div className='d-flex justify-content-between'>
              <h5 className='text-d'>{plan.title}</h5>
              <div>
                <i className='bi-trash cursor' 
                onClick={() => deleteHandler(plan._id)}> </i>
                <i className={
                  !editing ? 'bi-pencil cursor' : 'bi-x cursor'
                }
                onClick={() => setEditing(!editing)}> </i>
              </div>
            </div>
          </Card.Title>
          <Card.Text>
            <i className='bi-card-text'> {plan.description}</i> <br />
            <i className='bi-clock'> {plan.time}</i>
          </Card.Text>
            {
            editing ? 
            <EditPlans getPlans={getPlans} 
            id={plan._id} 
            data={plan} 
            key={plan._id}
            setEditing={setEditing} />
            : null
            }
        </Card.Body>
      </Card>
      : null
      }
      </>
    )
  })
  
  return (
    <Container className='min'>
      <Row>
        <Col md='4'>
          <div className='calendar-container'>
            <Calendar onChange={setDate} 
            value={date} />
          </div>
          <p className='mb-5'>
            <span>Selected Date </span>
            {date.toDateString()}
          </p>

          <div className='card card-body m-3 bg-l text-center'>
            <h6 className='mt-2'>{quotes[q]?.text}</h6>
            <p className='text-end mb-0'>-- {quotes[q]?.author}</p>
          </div>
        </Col>

        <Col md='5'>
          <h3 className='text-d'>Today's Event</h3>
          <div className='my-4'>
            {showCalendarDetails}
          </div>

          {
            localStorage.hasOwnProperty('userData') && localStorage.hasOwnProperty('token') ?
            <>
              <h3 className='text-d d-inline'>My Plans</h3>
              <i className='bi-calendar-plus ms-2 md cursor' onClick={handleShow}></i>
              <div className='my-4'>
                {showPlans}
              </div>
            </>
            : null
          }

          <Modal show={show} 
          onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Plans</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddPlans setShow={setShow} 
              getPlans={getPlans}/>
            </Modal.Body>
            <Modal.Footer>
              <Button className='bg-d' 
              onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>

        <Col md='3'>
          <InputGroup className="mb-3">
            <FormControl
              placeholder='Type to Search' 
              onChange={(e) => setKey(`${e.target.value}`)} />
            <Button variant="outline-secondary border">
              <i className='bi-search'></i>
            </Button>
          </InputGroup>
          {showEvent}
        </Col>
      </Row>
    </Container>  
  )
}

export default Home