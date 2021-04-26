import React, { Fragment, Fragments } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import TI_Logo from '../assets/img/TI_Logo.png';

const Home = () => (
  <Fragment>
    <Helmet>
      <title>Quiz Time</title>
    </Helmet>
    <div id='home'>
      <section>
        <div style={{ textAlign: 'center' }}>
          <img className='logo' src={TI_Logo} width='100px' />
          {/* <span className='mdi mdi-cube-outline cube '></span> */}
        </div>
        <h1>Take Test</h1>
        <div className='play-button-container'>
          <ul>
            <li>
              <Link className='play-button' to='/play/instructions'>
                Start
              </Link>
            </li>
          </ul>
        </div>
        <div className='auth-container'>
          <Link to='/login' className='auth-buttons' id='login-button'>
            Login
          </Link>
          <Link to='/register' className='auth-buttons' id='signup-button'>
            Register
          </Link>
        </div>
        <div className='website'>
          <a target='_blank' href='https://techinnovators.in'>
            www.techinnovators.in
          </a>
        </div>
      </section>
    </div>
  </Fragment>
);
export default Home;
