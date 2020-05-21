import React, { Component } from 'react';
import '../Sass/ManageCards.scss';
import { Redirect } from 'react-router-dom';

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
            return <Redirect to='/' />
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
        this.setState({ cards: JSON.parse(localStorage.getItem('cards')) });
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

export default ManageCards;