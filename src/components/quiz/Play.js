import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import classnames from 'classnames';

import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';

import correctNotification from '../../assets/audio/correct-answer.mp3';
import wrongNotification from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: '',
      numberOfQuestions: 0,
      numberOfAnsweredQuestion: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hints: 5,
      fiftyfifty: 2,
      usedfiftyfifty: false,
      nextButtonDisabled: false,
      previousButtonDisabled: true,
      previousRandomNumbers: [],
      time: {},
    };
    this.interval = null;
    this.correctSound = React.createRef();
    this.wrongSound = React.createRef();
    this.buttonSound = React.createRef();
  }

  componentDidMount() {
    const {
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion,
    } = this.state;
    this.displayQuestions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  displayQuestions = (
    questions = this.state.questions,
    currentQuestion,
    nextQuestion,
    previousQuestion
  ) => {
    let { currentQuestionIndex } = this.state;
    if (!isEmpty(this.state.questions)) {
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];
      const answer = currentQuestion.answer;
      this.setState(
        {
          currentQuestion,
          nextQuestion,
          previousQuestion,
          numberOfQuestions: questions.length,
          answer,
          previousRandomNumbers: [],
        },
        () => {
          this.showOptions();
          this.handleDisableButton();
        }
      );
    }
  };

  handleOptionClick = (e) => {
    if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
      setTimeout(() => {
        this.correctSound.current.play();
      }, 500);
      this.correctAnswer();
    } else {
      setTimeout(() => {
        this.wrongSound.current.play();
      }, 500);
      this.wrongAnswer();
    }
  };

  handleNextButtonClick = () => {
    this.playButtonSound();
    if (this.state.nextQuestion != undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
        }),
        () => {
          this.displayQuestions(
            this.state.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };
  handlePreviousButtonClick = () => {
    this.playButtonSound();
    if (this.state.previousQuestion != undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
        }),
        () => {
          this.displayQuestions(
            this.state.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };
  handleQuitButtonClick = () => {
    this.playButtonSound();
    if (window.confirm('Are you sure, you want to quit?')) {
      this.props.history.push('/');
    }
  };

  handleButtonClick = (e) => {
    switch (e.target.id) {
      case 'next-button':
        this.handleNextButtonClick();
        break;

      case 'previous-button':
        this.handlePreviousButtonClick();
        break;
      case 'quit-button':
        this.handleQuitButtonClick();
        break;
      default:
        break;
    }
    this.playButtonSound();
  };

  playButtonSound = () => {
    this.buttonSound.current.play();
  };

  correctAnswer = () => {
    M.toast({
      html: 'Correct Answer!',
      classes: 'toast-valid',
      displayLength: 1000,
    });
    this.setState(
      (prevState) => ({
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestion: prevState.numberOfAnsweredQuestion + 1,
      }),
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGame();
        } else {
          this.displayQuestions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      }
    );
  };
  wrongAnswer = () => {
    navigator.vibrate(1000);
    M.toast({
      html: 'Wrong Answer!',
      classes: 'toast-invalid',
      displayLength: 1000,
    });
    this.setState(
      (prevState) => ({
        wrongAnswers: prevState.wrongAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestion: prevState.numberOfAnsweredQuestion + 1,
      }),
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGame();
        } else {
          this.displayQuestions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      }
    );
  };

  showOptions = () => {
    const options = Array.from(document.querySelectorAll('.option'));

    options.forEach((option) => {
      option.style.visibility = 'visible';
    });
    this.setState({
      usedfiftyfifty: false,
    });
  };

  handleHints = () => {
    if (this.state.hints > 0) {
      const options = Array.from(document.querySelectorAll('.option'));
      let indexOfAnswer;

      options.forEach((option, index) => {
        if (
          option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()
        ) {
          indexOfAnswer = index;
        }
      });

      while (true) {
        const randomNumber = Math.round(Math.random() * 3);
        if (
          randomNumber !== indexOfAnswer &&
          !this.state.previousRandomNumbers.includes(randomNumber)
        ) {
          options.forEach((option, index) => {
            if (index === randomNumber) {
              option.style.visibility = 'hidden';
              this.setState((prevState) => ({
                hints: prevState.hints - 1,
                previousRandomNumbers: prevState.previousRandomNumbers.concat(
                  randomNumber
                ),
              }));
            }
          });
          break;
        }
        if (this.state.previousRandomNumbers.length >= 3) break;
      }
    }
  };

  handleFiftyFifty = () => {
    if (this.state.fiftyfifty > 0 && this.state.usedfiftyfifty === false) {
      const options = document.querySelectorAll('.option');
      const randomNumbers = [];
      let indexOfAnswer;

      options.forEach((option, index) => {
        if (
          option.innerHTML.toLowerCase() ===
          this.state.answer.toLocaleLowerCase()
        ) {
          indexOfAnswer = index;
        }
      });
      let count = 0;
      do {
        const randomNumber = Math.round(Math.random() * 3);
        if (randomNumber !== indexOfAnswer) {
          if (
            randomNumbers.length < 2 &&
            !randomNumbers.includes(randomNumber) &&
            !randomNumbers.includes(indexOfAnswer)
          ) {
            randomNumbers.push(randomNumber);
            count++;
          } else {
            while (true) {
              const newRandomNumber = Math.round(Math.random() * 3);
              if (
                !randomNumbers.includes(newRandomNumber) &&
                !randomNumbers.includes(indexOfAnswer)
              ) {
                randomNumbers.push(newRandomNumber);
                count++;
                break;
              }
            }
          }
        }
      } while (count < 2);
      options.forEach((option, index) => {
        if (randomNumbers.includes(index)) {
          option.style.visibility = 'hidden';
        }
      });
      this.setState((prevState) => ({
        fiftyfifty: prevState.fiftyfifty - 1,
        usedfiftyfifty: true,
      }));
    }
  };

  startTimer = () => {
    const countDownTime = Date.now() + 902000;
    this.interval = setInterval(() => {
      const now = new Date();
      const distance = countDownTime - now;

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(this.interval);
        this.setState(
          {
            time: {
              minutes: 0,
              seconds: 0,
            },
          },
          () => {
            this.endGame();
          }
        );
      } else {
        this.setState({
          time: {
            minutes,
            seconds,
          },
        });
      }
    }, 1000);
  };

  handleDisableButton = () => {
    if (
      this.state.previousQuestion === undefined ||
      this.state.currentQuestionIndex === 0
    ) {
      this.setState({
        previousButtonDisabled: true,
      });
    } else {
      this.setState({
        previousButtonDisabled: false,
      });
    }
    if (
      this.state.nextQuestion === undefined ||
      this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions
    ) {
      this.setState({
        nextButtonDisabled: true,
      });
    } else {
      this.setState({
        nextButtonDisabled: false,
      });
    }
  };

  endGame = () => {
    alert('Test has ended!');
    const { state } = this;
    const playerStats = {
      score: state.score,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestion:
        this.state.correctAnswers + this.state.wrongAnswers,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      fiftyfiftyUsed: 2 - state.fiftyfifty,
      hintUsed: 5 - state.hints,
    };
    console.log(playerStats);
    setTimeout(() => {
      this.props.history.push('/play/quizSummary', playerStats);
    }, 1000);
  };
  render() {
    const {
      currentQuestion,
      currentQuestionIndex,
      numberOfQuestions,
      hints,
      fiftyfifty,
      time,
    } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Test Pages</title>
        </Helmet>
        <Fragment>
          <audio ref={this.correctSound} src={correctNotification}></audio>
          <audio ref={this.wrongSound} src={wrongNotification}></audio>
          <audio ref={this.buttonSound} src={buttonSound}></audio>
        </Fragment>
        <div className='questions'>
          <div class='branding'>
            <h2>Tech</h2>
            <h2 className='innovators'>Innovators</h2>
          </div>
          <div className='lifeline-container'>
            <p>
              <span
                onClick={this.handleFiftyFifty}
                className='mdi mdi-set-center mdi-24px lifeline-icon'
              >
                <span className='lifeline'> {fiftyfifty}</span>
              </span>
            </p>
            <p>
              <span
                onClick={this.handleHints}
                className='lifeline'
                className='mdi mdi-lightbulb-on-outline lifeline-icon mdi-24px'
              >
                <span>{hints}</span>
              </span>
            </p>
          </div>
          <div>
            <p>
              <span className='left' style={{ float: 'left' }}>
                {currentQuestionIndex + 1} of {numberOfQuestions}
              </span>
              <span className='right'>
                {time.minutes}:{time.seconds}
                <span className='mdi mdi-clock-outline mdi-24px'></span>
              </span>
            </p>
          </div>
          <h5>{currentQuestion.question}</h5>
          <div className='options-container'>
            <p onClick={this.handleOptionClick} className='option'>
              {currentQuestion.optionA}
            </p>
            <p onClick={this.handleOptionClick} className='option'>
              {currentQuestion.optionB}
            </p>
          </div>
          <div className='options-container'>
            <p onClick={this.handleOptionClick} className='option'>
              {currentQuestion.optionC}
            </p>
            <p onClick={this.handleOptionClick} className='option'>
              {currentQuestion.optionD}
            </p>
          </div>

          <div className='button-container'>
            <button
              className={classnames('', {
                disable: this.state.previousButtonDisabled,
              })}
              id='previous-button'
              onClick={this.handleButtonClick}
            >
              Previous
            </button>
            <button
              className={classnames('', {
                disable: this.state.nextButtonDisabled,
              })}
              id='next-button'
              onClick={this.handleButtonClick}
            >
              Next
            </button>
            <button id='quit-button' onClick={this.handleButtonClick}>
              Quit
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Play;
