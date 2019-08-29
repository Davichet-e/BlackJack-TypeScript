export class Card {
  constructor(
    readonly name: string,
    readonly value: number,
    readonly suit: string
  ) {}

  public toString = (): string => `${this.name} of ${this.suit}`;
}

function shuffle(array: Array<Card>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class Deck {
  static readonly suits: Array<string> = ["♣", "♥", "♠", "♦"];
  static readonly cards: { [name: string]: number } = {
    ACE: 11,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    JACK: 10,
    QUEEN: 10,
    KING: 10
  };

  private readonly _deck: Array<Card> = [];

  constructor() {
    for (const suit of Deck.suits) {
      for (const [cardName, cardValue] of Object.entries(Deck.cards)) {
        this._deck.push(new Card(cardName, cardValue, suit));
      }
    }
    shuffle(this._deck);
  }

  public dealCard = (): Card => this._deck.pop();

  public getInitialCards = (): [Card, Card] => [
    this._deck.pop(),
    this._deck.pop()
  ];
}
