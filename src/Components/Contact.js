import React from 'react'
import {
  Card,
  Container
} from 'react-bootstrap'

function Contact() {
  return (
    <Container className='min'>
      <h2 className='my-5 text-center text'>Let's keep in touch! <i className='bi-emoji-heart-eyes'></i></h2>
      <Card className='md-width mx-auto'>
        <Card.Body>
          <Card.Title className='text-d my-2 text-center'>Contact Us</Card.Title>
          <Card.Subtitle className='text text-center mt-4 px-4'>Good day, we hope you are having a blast on this website. Wanna get to know us more? Follow us on... </Card.Subtitle>
          <Card.Text>
            <div className='text-center my-4'>
              <Card.Link className='cursor'>
                <i className='bi-instagram'> Instagram</i> <br />
              </Card.Link>

              <Card.Link className='cursor'>
                <i className='bi-facebook'> Facebook</i> <br />
              </Card.Link>

              <Card.Link className='cursor'>
                <i className='bi-whatsapp'> Whatsapp</i> <br />
              </Card.Link>

              <Card.Link className='cursor'>
                <i className='bi-envelope'> Email</i>
              </Card.Link>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Contact