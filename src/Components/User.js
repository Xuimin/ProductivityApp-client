import React, { useEffect, useState } from 'react'
import {
  Container,
  ListGroup,
  Badge
} from 'react-bootstrap'

function User() {
  const [ users, setUser ] = useState([])

  const getUser = () => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then( res => res.json())
    .then(data => setUser(data))
  }

  useEffect(() => {
    getUser()
  }, [])

  let showUser = users?.map((user) => {
    return (
      <>
      <ListGroup.Item as="li" key={user.id}>
        <div className="ms-1 d-flex justify-content-between">
          <div>
            <div className="fw-bold text-d">{user.username}</div>
          </div>
          <Badge className='bg-d' 
          pill>
            <small>Joined:</small> {user.joinedEvents.length}
          </Badge>
        </div>
          <i className='bi-envelope-fill ms-2'></i> {user.email}
      </ListGroup.Item>
      </>
    )
  })

  return (
    <Container className='min'>
      <h2 className='text-center text-d my-5'>All Users</h2>
      <ListGroup as="ol">
        {showUser}
      </ListGroup>
    </Container>
  )
}

export default User