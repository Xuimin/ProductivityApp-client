import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { 
  Container,
  Row,
  Col,
  Modal,
  Button,
  Card
} from 'react-bootstrap'
import Goals from './Forms/GoalHabitForm/AddGoals'
import Habit from './Forms/GoalHabitForm/AddHabit'
import EditGoals from './Forms/GoalHabitForm/EditGoals'
import EditHabit from './Forms/GoalHabitForm/EditHabit'

function Habit_Goals() {
  const [ goalhabit, setGoalHabit ] = useState([])
  const [ show, setShow ] = useState(false)
  const [ show1, setShow1 ] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleClose1 = () => setShow1(false)
  const handleShow1 = () => setShow1(true)

  const [ editing, setEditing ] = useState(false)
  const [ editing1, setEditing1 ] = useState(false)

  const getHabitGoal = () => {
    fetch(`${process.env.REACT_APP_API_URL}/habits`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => setGoalHabit(data))
  }

  useEffect(() => {
    getHabitGoal()
  }, [])

  const deleteHandler = (id) => {
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
        fetch(`${process.env.REACT_APP_API_URL}/habits/` + id , {
          method: "DELETE",
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
          getHabitGoal()
          setShow1(false)
          setTimeout(() => window.location.reload(false), 1500)
        })
      }
    })
  }

  let showHabit = goalhabit?.habit?.map(gh => {
    return (
      gh.category === 'Habit' ?
      <>
        <Card key={gh._id}>
          <Card.Body>
            <Card.Title>
              <div className='d-flex justify-content-between text'>
                {gh.name}

                <div>
                  <i className='bi-trash cursor me-2' 
                  onClick={() => deleteHandler(gh._id)}></i>
                  <i className={
                    !editing ? 'bi-pencil cursor' : 'bi-x cursor'
                  } 
                  onClick={() => setEditing(!editing)}>
                  </i>
                </div>
              </div>
              {
              editing ? 
              <EditHabit getHabitGoal={getHabitGoal} 
              id={gh._id} 
              data={gh} 
              setEditing={setEditing} />
              : null
              }
            </Card.Title>
          </Card.Body>
        </Card>
      </>
      : null
    )
  })

  let showGoals = goalhabit?.habit?.map(gh => {
    return (
      gh.category === 'Goals' ?
      <>
        <Card key={gh._id}>
          <Card.Body>
            <Card.Title>
              <div className='d-flex justify-content-between text-d'>
                {gh.name}
                <div>
                  <i className='bi-trash me-2 cursor' 
                  onClick={() => deleteHandler(gh._id)}></i>
                  <i className={
                    !editing1 ? 'bi-pencil cursor' : 'bi-x cursor'
                  } onClick={() => setEditing1(!editing1)}>
                  </i>
                </div>
              </div>
            </Card.Title>
            <Card.Text>
              <p><i className='bi-stopwatch'> {gh.dueOn} {gh.timer}:00</i></p>
              {
              editing1 ? 
              <EditGoals getHabitGoal={getHabitGoal} 
              id={gh._id} 
              data={gh} 
              setEditing1={setEditing1} />
              : null
              } 
              <a data-type="countdown"
                data-name="Time left:"
                data-bg_color="#fce0ee"
                data-name_color="#512d38"
                data-dt={gh.dueOn + ' ' + gh.timer + ':00'}
                data-timezone="Asia/Singapore"
                style={{display: 'block', width: '100%', position: 'relative', 'padding-bottom': '25%'}}
                class="tickcounter"
                href="//www.tickcounter.com"
              >Countdown</a>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
      : null
    )
  })

  return (
    <Container className='min'>
      <Row> 
        <Col md='6' className='mb-5'>
          <h2 className='text-d'>Habits
          <i className='bi-plus-square ms-2 cursor'
          onClick={handleShow}></i>
          </h2>
          {showHabit}
        </Col>

        <Col md='6'>
          <h2 className='text-d'>Goals 
          <i className='bi-plus-circle ms-2 cursor'
          onClick={handleShow1}></i>
          </h2>
          {showGoals}
        </Col>
      </Row>

      <Modal show={show} 
      onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Habit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Habit getHabitGoal={getHabitGoal} 
          setShow={setShow} />
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-d' 
          onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} 
      onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Add Goals</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Goals getHabitGoal={getHabitGoal} 
          setShow1={setShow1} />
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-d' 
          onClick={handleClose1}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Habit_Goals