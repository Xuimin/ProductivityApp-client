import React, { useEffect, useState } from 'react' 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Swal from 'sweetalert2'
import {
  Row,
  Col,
  Button, 
  Container, 
  Modal,
  Card
} from 'react-bootstrap'
import AddTodo from './Forms/TodoForm/AddTodo'

function Todo() {
  const [ todos, setTodos ] = useState([])
  const [ show, setShow ] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getTodos = () => {
    fetch(`${process.env.REACT_APP_API_URL}/todo`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => setTodos(data))
  }

  useEffect(() => {
    getTodos()
  }, [])

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result

    if(!destination) {
      return;
    }

    if(source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const id = draggableId
    const start = source.droppableId
    const end = destination.droppableId

    if(start !== end && end === '1') {
      fetch(`${process.env.REACT_APP_API_URL}/todo/complete/${id}`, {
        method: "PUT",
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title:  data.msg,
          showConfirmButton: false,
          timer: 1500
        })
        getTodos()
      }) 
    } else if(start !== end) {
      fetch(`${process.env.REACT_APP_API_URL}/todo/complete/${id}`, {
        method: "PUT",
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title:  data.msg,
          showConfirmButton: false,
          timer: 1500
        })
        getTodos()
      })
    }
  }

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
        fetch(`${process.env.REACT_APP_API_URL}/todo/` + id , {
          method: "DELETE",
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        })
        .then(res => res.json())
        .then(data => {
          Swal.fire('Deleted', data.msg, 'success')
          getTodos()
        })
      }
    })
  }

  const completeHandler = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/todo/complete/${id}`, {
      method: "PUT",
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title:  data.msg,
        showConfirmButton: false,
        timer: 1500
      })
      getTodos()
    })
  }

  return (
    <Container className='min'>
      <h2 className='text-center text-d my-5'>
        To Do List <i className='bi-file-earmark-plus cursor' 
        onClick={handleShow}></i>
      </h2>
     
      <Modal show={show} 
      onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTodo getTodos={getTodos} 
          setShow={setShow} />
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-d' 
          onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className='container'>
          <Row>
            <Col sm='6' className='mb-5'>
              <Droppable droppableId='0'>
                { (provided, snapshot) => (
                  <div className='todos' 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}>
                    <h5 className='text'>Active Task</h5>
                    {
                      todos?.target?.map((todo, index) => (
                        !todo.isFinish ?
                        <Draggable key={todo._id} 
                        draggableId={todo._id} 
                        index={index}>
                          {(provided, snapshot) => (
                            <Card ref={provided.innerRef} 
                            key={todo._id} 
                            index={index} 
                            {...provided.draggableProps} 
                            {...provided.dragHandleProps}>
                              <Card.Body>
                                <div className='d-flex justify-content-between'>
                                  <h6 className='text-d'>{todo.name}</h6>

                                  <div>
                                    <i className='bi-trash cursor mx-2' 
                                    onClick={() => deleteHandler(todo._id)}></i>
                                    <i className='bi-clipboard cursor'
                                    onClick={() => completeHandler(todo._id)}></i>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          )}
                        </Draggable>
                        : null
                      ))
                    }
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
            
            <Col sm='6'>
              <Droppable droppableId='1'>
                { (provided) => (
                  <div className='todos remove'
                  ref={provided.innerRef} 
                  {...provided.droppableProps}>
                    <h5 className='text'>Completed Task</h5>
                    {
                      todos?.target?.map((todo, index) => (
                        todo.isFinish ?
                        <Draggable key={todo._id}
                        draggableId={todo._id} 
                        index={index}>
                          { (provided) => (
                            <Card ref={provided.innerRef} 
                            key={todo._id} 
                            index={index} 
                            {...provided.draggableProps} 
                            {...provided.dragHandleProps}>
                              <Card.Body>
                                <div className='d-flex justify-content-between'>
                                  <h6 className='text-d'>{todo.name}</h6>
                                    
                                  <div>
                                    <i className='bi-trash cursor mx-2' 
                                    onClick={() => deleteHandler(todo._id)}></i>
                                    <i className='bi-clipboard-check cursor'
                                    onClick={() => completeHandler(todo._id)}></i>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          )}
                        </Draggable>
                        : null
                      ))
                    }
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
          </Row>
        </div>
      </DragDropContext>
    </Container>
  )
}

export default Todo
