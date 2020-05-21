import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import DisplayCards from './Pages/DisplayCards.js';
import ManageCards from './Pages/ManageCards.js';

import './Sass/index.scss';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/React-Flashcards" component={DisplayCards}/>
      <Route exact path="/ManageCards" component={ManageCards}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);