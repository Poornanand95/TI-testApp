import React, { Components, Fragment, Fragments } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
const QuizInstructions = () => (
  <Fragment>
    <Helmet>
      <title>Test Instructions</title>
    </Helmet>
    <div className='instructions container'>
      <h1>How to take this test</h1>
      <p>Ensure you read this guid from start to finish</p>
      <ul className='browser-default' id='main-list'>
        <li>
          This test has a duration of 15 minutes and ends as soon as your time
          elapses.
        </li>
        <li>Each test consists of 15 questions.</li>
        <li>Every question contains 4 options</li>
      </ul>
      <div>
        <span className='left'>
          <Link to='/'>No take me back </Link>
        </span>
        <span className='right'>
          <Link to='/play/quiz'>Yes take me to the test </Link>
        </span>
      </div>
    </div>
  </Fragment>
);

export default QuizInstructions;
