import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Navbar, 
  Nav, 
  Container,
  Offcanvas
} from 'react-bootstrap'
import Swal from 'sweetalert2'

function TopNav({logoutHandler}) {
  let navigate = useNavigate()

  return (
    <Navbar expand='lg' className='bg mb-5 sticky-top'>
      <Container>
        <Navbar.Brand href='/'>
          𝒫𝑅🏵𝒹𝓊𝒸𝓉𝒾𝓋𝒾𝓉𝓎
        </Navbar.Brand>
        <Navbar.Toggle id="offcanvasNavbar"/>
        <Navbar.Collapse>
          {
          localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData') ?
          <>
            <Nav.Link as={Link} 
            to='/'>Home</Nav.Link>
            <Nav.Link as={Link} 
            to='/event'>All Event</Nav.Link>
            
            {
            JSON.parse(localStorage.getItem('userData'))?.isAdmin ?
            <Nav.Link as={Link} 
            to='auth'>
              <i className='bi-person-lines-fill white'></i>
            </Nav.Link>
            : 
            <>
              <Nav.Link as={Link} 
              to='/todo'>Todo List</Nav.Link>
              <Nav.Link as={Link} 
              to='/habit'>Goals & Habit Tracker</Nav.Link>
            </>
            }
            <Nav.Link as={Link} 
            to='/feedback'>Feedback</Nav.Link>
            <Nav.Link onClick={() => {
              logoutHandler()
              Swal.fire({
                title: 'Logged Out Successfully',  
                icon: 'success',
                confirmButtonColor: '#b27092'
              })
            navigate('/')
            }}>Logout</Nav.Link>
          </>
          :
          <>
            <Nav.Link as={Link} 
            to='/'>Home</Nav.Link>
            <Nav.Link as={Link} 
            to='/register'>Register</Nav.Link>
            <Nav.Link as={Link} 
            to='/login'>Login</Nav.Link>
          </>
          }

        </Navbar.Collapse>
        <Navbar.Offcanvas id='offcanvasNavbar'
        placement='start'>
          <Offcanvas.Header closeButton />
          <Offcanvas.Body>
            <Nav className='me-auto'>
              <Nav.Link as={Link} 
              to='/'>Home</Nav.Link>
              {
              localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData') ?
              <>
                <Nav.Link as={Link} 
                to='/event'>All Event</Nav.Link>
                
                {
                JSON.parse(localStorage.getItem('userData'))?.isAdmin ?
                <Nav.Link as={Link} 
                to='auth'>
                  <i className='bi-person-lines-fill'> See User</i>
                </Nav.Link>
                : 
                <>
                  <Nav.Link as={Link} 
                  to='/todo'>Todo List</Nav.Link>
                  <Nav.Link as={Link} 
                  to='/habit'>Goals & Habit Tracker</Nav.Link>
                </>
                }

                <Nav.Link as={Link} 
                to='/feedback'>Feedback</Nav.Link>
                <Nav.Link onClick={() => {
                  logoutHandler()
                  Swal.fire({
                    title: 'Logged Out Successfully',  
                    icon: 'success',
                    confirmButtonColor: '#b27092'
                  })
                  navigate('/')
                }}>Logout</Nav.Link>

              </>
              : 
              <>
                <Nav.Link as={Link} 
                to='/register'>Register</Nav.Link>
                <Nav.Link as={Link} 
                to='/login'>Login</Nav.Link>
              </>
              }
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default TopNav