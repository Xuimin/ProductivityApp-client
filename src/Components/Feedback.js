import React from 'react'
import {
  Container,
  Tabs,
  Tab
} from 'react-bootstrap'
import Contact from './Contact'
import Complain from './Forms/FeedbackForms/Complain'
import Comments from './Forms/FeedbackForms/Comments'
import EventReq from './Forms/FeedbackForms/EventRequest'
import ShowFeedback from './ShowFeedback'

function Feedback() {
  return (
    <Container>
      {
      JSON.parse(localStorage.getItem('userData'))?.isAdmin ? <ShowFeedback />
      :
      <Tabs>
        <Tab eventKey='contact' title='Contact'>
          <Contact />
        </Tab>

        <Tab eventKey='complain' title='Complain'>
          <Complain />
        </Tab>

        <Tab eventKey='comments' title='Comments'>
          <Comments />
        </Tab>

        <Tab eventKey='events' title='Events to Add'>
          <EventReq />
        </Tab>
      </Tabs>
      }
    </Container>
  )
}

export default Feedback