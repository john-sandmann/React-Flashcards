import React, { Component } from 'react';
import '../Sass/DisplayCards.scss';
import '../Sass/ManageCards.scss';

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
      this.props.toggle();
    }
  }

  componentDidMount() {
    if (localStorage.getItem('cards')) {
      this.setState({ cards: JSON.parse(localStorage.getItem('cards')) }, () => this.setState({ shouldRenderCards: true }));
    }
    else {
      localStorage.setItem('cards', JSON.stringify([]));
      this.setState({ cards: JSON.parse(localStorage.getItem('cards')) }, () => this.setState({ shouldRenderCards: true }));
    }
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
      if (this.state.gameHasStarted) {
        if (this.state.cards[0]) {
          let card = this.state.cards[this.state.currentCard];
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

class ManageCards extends Component {

  constructor(props) {
    super(props);

    this.state = {

      pergunta: '',
      resposta: '',

      redirectToDisplayCards: false,
      cardAdded: false,

      cards: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderCardAdded = this.renderCardAdded.bind(this);
    this.renderCards = this.renderCards.bind(this);
  }

  renderRedirectToDisplayCards() {
    if (this.state.renderRedirectToDisplayCards) {
      this.props.toggle();
    }
  }

  renderCardAdded() {
    if (this.state.cardAdded) {
      return <h4>Card added</h4>
    }
  }

  renderCards() {

    let removeCard = (id) => {
      let cards = JSON.parse(localStorage.getItem('cards'));

      cards = cards.filter((card) => {
        return card.id !== id
      });

      localStorage.setItem('cards', JSON.stringify(cards));

      this.setState({ cards: JSON.parse(localStorage.getItem('cards')) });
    }

    let updateCard = (id, pergunta, resposta) => {
      let cards = JSON.parse(localStorage.getItem('cards'));

      let newCards = [];
      cards.forEach((card) => {
        if (card.id === id) {
          card.pergunta = pergunta;
          card.resposta = resposta;

          newCards.push(card);
        } else {
          newCards.push(card);
        }
      });

      localStorage.setItem('cards', JSON.stringify(newCards));

      this.setState({ cards: JSON.parse(localStorage.getItem('cards')) });
    }

    return this.state.cards.map((card, index) => {
      return <div className="card" key={index}>
        <input type="text" value={card.pergunta} onChange={(e) => updateCard(card.id, e.target.value, card.resposta)} />
        <input type="text" value={card.resposta} onChange={(e) => updateCard(card.id, card.pergunta, e.target.value)} />
        <button onClick={() => removeCard(card.id)} >Remove card</button>
      </div>
    });
  }

  componentDidMount() {
    if (localStorage.getItem('cards')) {
      this.setState({ cards: JSON.parse(localStorage.getItem('cards')) });
    }
    else {
      localStorage.setItem('cards', JSON.stringify([]));
      this.setState({ cards: JSON.parse(localStorage.getItem('cards')) });
    }
  }

  handleSubmit(e) {

    let isNotEmptyString = (string) => {
      let onlySpaces = true;
      let i = string.length;

      if (string.length === 0) {
        return !onlySpaces;
      }
      else {
        while (i--) {
          if (string[i] !== ' ') {
            onlySpaces = false;
          }
        }
      }

      return !onlySpaces;
    }

    let makeId = (length) => {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;

      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    }

    let addQuestion = (pergunta, resposta) => {
      let id = makeId(30);

      if (localStorage.getItem('cards')) {
        let cards = JSON.parse(localStorage.getItem('cards'));
        cards.push({ id: id, pergunta: pergunta, resposta: resposta });
        localStorage.setItem('cards', JSON.stringify(cards));
      } else {
        let cards = [];
        cards.push({ id: id, pergunta: pergunta, resposta: resposta });
        localStorage.setItem('cards', JSON.stringify(cards));
      }

      this.setState({ cardAdded: true, cards: JSON.parse(localStorage.getItem('cards')) })
    }

    e.preventDefault();

    let pergunta = this.state.pergunta;
    let resposta = this.state.resposta;

    if (isNotEmptyString(pergunta) && isNotEmptyString(resposta)) addQuestion(pergunta, resposta);

    this.setState({ pergunta: '', resposta: '' });
  }

  render() {
    return (
      <div>
        {/* Go to DisplayCards*/}
        <button id="display-cards" onClick={() => { this.setState({ renderRedirectToDisplayCards: true }) }}>Display Cards</button>
        {this.renderRedirectToDisplayCards()}

        <div id="main-stuff">
          {/* Add new cards */}
          <h2>Create new card</h2>
          <form>
            <input value={this.state.pergunta} onChange={(e) => { this.setState({ pergunta: e.target.value }) }} type='text' placeholder='Pergunta' />
            <input value={this.state.resposta} onChange={(e) => { this.setState({ resposta: e.target.value }) }} type='text' placeholder='Resposta' />
            <button type='submit' onClick={this.handleSubmit}>Create card</button>
          </form>
          {this.renderCardAdded()}

          {/* Show all cards */}
          <div id="cards-displayer">
            {this.renderCards()}
          </div>
        </div>
      </div>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      displayCards: true,
    }
  }

  toogleState = () => this.setState({ displayCards: !this.state.displayCards });

  render() {
    return (
      <div>
        {this.state.displayCards ? <DisplayCards toggle={this.toogleState} /> : <ManageCards toggle={this.toogleState} />}
      </div>
    );
  }
}

export default App;