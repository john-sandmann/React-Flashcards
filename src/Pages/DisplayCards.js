import React, { Component } from 'react';
import '../Sass/DisplayCards.scss';
import { Redirect } from 'react-router-dom';

class DisplayCards extends Component {

  constructor(props) {
    super(props);

    this.state = {
      redirectToManageCards: false,

      mode: 'Random',
      gameHasStarted: false,
      cards: [],
      currentCard: 0,
      shouldRenderCards: false,
      showAnswer: false,
    }

    this.changeMode = this.changeMode.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  renderRedirectToManageCards() {
    if (this.state.redirectToManageCards) {
      return <Redirect to='/ManageCards' />
    }
  }

  componentDidMount() {
    this.setState({ cards: JSON.parse(localStorage.getItem('cards')) }, this.setState({ shouldRenderCards: true }));
  }

  renderStartOptions() {
    if (!this.state.gameHasStarted) {
      return <div className="startGame">
        <button onClick={this.changeMode} >Change Gamemode</button>
        {this.state.mode}
        <button onClick={this.startGame}>Start game</button>
      </div>
    }
  }

  changeMode() {

    let nextGamemode = (mode) => {

      let modeArr = ['Ordered', 'Random']

      let currentModeIndex = modeArr.indexOf(mode);

      if (modeArr.length - 1 == currentModeIndex) {
        currentModeIndex = 0;
      }
      else {
        currentModeIndex += 1;
      }

      return modeArr[currentModeIndex];
    }

    this.setState({ mode: nextGamemode(this.state.mode) });
  }

  startGame() {
    this.setState({ gameHasStarted: true });
  }

  renderCard() {

    let nextCard = (mode) => {
      if (mode === "Random") {
        let cardsLength = this.state.cards.length
        let randomInt = Math.floor(Math.random() * cardsLength);
        this.setState({ currentCard: randomInt });
      }
      else if (mode === "Ordered") {
        if (this.state.currentCard + 1 == this.state.cards.length) {
          this.setState({ currentCard: 0 });
        }
        else {
          this.setState({ currentCard: this.state.currentCard + 1 });
        }
      }
      this.setState({ showAnswer: false });
    }

    if (this.state.shouldRenderCards) {
      let card = this.state.cards[this.state.currentCard];
      if (this.state.gameHasStarted) {
        if (this.state.cards[0]) {
          return <div className="card">
            <h1>{this.state.showAnswer ? card.resposta : card.pergunta}</h1>
            <button onClick={() => this.setState({ showAnswer: true })}>
              Show Answer
            </button>
            <button onClick={() => nextCard(this.state.mode)}>
              Next Card
            </button>
            <button onClick={() => window.location.reload()}>Restart game</button>
          </div>
        }
        return <h3>You first need to add cards to play the game!</h3>
      }
    }
  }

  render() {
    return (
      <div>
        {/* Go to ManageCards*/}
        <button onClick={() => { this.setState({ redirectToManageCards: true }) }}>Manage Cards</button>
        {this.renderRedirectToManageCards()}
        {this.state.mode}

        <div id="main-stuff">
          {this.renderStartOptions()}
          {this.renderCard()}
        </div>
      </div>
    );
  }
}

export default DisplayCards;