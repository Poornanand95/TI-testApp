import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

class QuizSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      numberOfQuestions: 0,
      numberOfAnsweredQuestion: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      fiftyfiftyUsed: 0,
      hintUsed: 0,
    };
  }

  componentDidMount() {
    const { state } = this.props.location;
    this.setState({
      score: (state.score / state.numberOfQuestions) * 100,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestion: state.numberOfAnsweredQuestion,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      fiftyfiftyUsed: state.fiftyfiftyUsed,
      hintUsed: state.hintUsed,
    });
  }
  render() {
    const { state } = this.props.location;
    let stats, remark;
    const userScore = this.state.score;

    if (userScore <= 30) {
      remark = 'You need more Practice!';
    } else if (userScore > 30 && userScore <= 50) {
      remark = 'Better luck next time!';
    } else if (userScore <= 70 && userScore > 50) {
      remark = 'You can do better!';
    } else if (userScore >= 71 && userScore <= 84) {
      remark = 'You did great!';
    } else {
      remark = 'You are absolute genius!';
    }

    if (state !== undefined) {
      stats = (
        <div id='stats'>
          <div class='success-icon'>
            <span className='mdi mdi-check-circle-outline success-icon'></span>
          </div>
          <h1>Test has ended</h1>
          <div className='container'>
            <h4>{remark}</h4>
            <h2>Your Score: {this.state.score.toFixed(0)}&#37;</h2>
            <span className='stat left'>Total number of questions:</span>
            <span className='right'>{this.state.numberOfQuestions}</span>
            <br />

            <span className='stat left'>
              Total number of Answered questions:
            </span>
            <span className='right'>{this.state.numberOfAnsweredQuestion}</span>
            <br />

            <span className='stat left'>Number of correct answers:</span>
            <span className='right'>{this.state.correctAnswers}</span>
            <br />

            <span className='stat left'>Number of wrong answers:</span>
            <span className='right'>{this.state.wrongAnswers}</span>
            <br />

            <span className='stat left'>Number of hints used:</span>
            <span className='right'>{this.state.hintUsed}</span>
            <br />

            <span className='stat left'>Number of 50-50 used:</span>
            <span className='right'>{this.state.fiftyfiftyUsed}</span>
          </div>
          <section>
            <ul>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/play/quiz'>Retake</Link>
              </li>
            </ul>
          </section>
        </div>
      );
    } else {
      stats = (
        <section>
          <h1 className='no-stats'>No Statistics Available</h1>
          <ul>
            <li>
              <Link to='/'>Back to Home</Link>
            </li>
            <li>
              <Link to='/play/quiz'>Take a Test</Link>
            </li>
          </ul>
        </section>
      );
    }
    return (
      <Fragment>
        <Helmet>
          <title>Test Results</title>
        </Helmet>
        {stats}
      </Fragment>
    );
  }
}

export default QuizSummary;
