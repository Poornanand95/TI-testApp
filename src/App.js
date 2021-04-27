import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
import QuizInstructions from './components/quiz/QuizInstructions';
import Play from './components/quiz/Play';
import QuizSummary from './components/quiz/QuizSummary';
function App() {
  return (
    <Router>
      <Route exact path='/' component={Home} />
      <Route exact path='/play/instructions' component={QuizInstructions} />
      <Route exact path='/play/Quiz' component={Play} />
      <Route exact path='/play/quizSummary' component={QuizSummary} />
    </Router>
  );
}

export default App;
