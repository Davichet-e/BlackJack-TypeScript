import { Deck, Card } from "./Deck";

/**
 * Represent a 21 BlackJack in TypeScript
 */
export class Hand {
  private _deck: Deck;
  private _cards: Array<Card>;
  private _points: number;
  private _aces: number;

  constructor(deck: Deck, fromCards?: Array<Card>) {
    this._deck = deck;
    if (fromCards) {
      this._cards = fromCards;
    } else {
      this._cards = this._deck.getInitialCards();
    }
    this._points = Hand.calculatePoints(this.cards);
    this._aces = 0;
    this.cards.forEach(this.checkIfAce);
    this.checkAcePoints();
  }

  get cards(): Array<Card> {
    return this._cards;
  }

  get points(): number {
    return this._points;
  }

  set points(value: number) {
    this._points = value;
  }

  public hasBlackJack = () => this._cards.length === 2 && this._points === 21;

  public initializeAttributes() {
    this._cards = this._deck.getInitialCards();
    this._points = Hand.calculatePoints(this.cards);
    this._aces = 0;
    this.cards.forEach(this.checkIfAce);
    this.checkAcePoints();
  }

  public dealCard() {
    const card: Card = this._deck.dealCard();
    this.checkIfAce(card);
    this._cards.push(card);
    this.updatePoints(card);
    if (this._points > 21) this._points = 0;
  }

  private checkIfAce(card: Card) {
    if (card.name === "ACE") this._aces++;
  }

  private checkAcePoints() {
    while (this.points > 21 && this._aces > 0) {
      this._points -= 10;
      this._aces--;
    }
  }

  private updatePoints(card: Card) {
    this._points = Hand.calculatePoints(this._cards);
    this.checkAcePoints();
  }

  public toString = (): string =>
    `${this._cards.map(card => card.toString()).join(", ")} (${
      this.points != 0 ? this._points : "> 21"
    } points)`;

  static calculatePoints = (cards: Array<Card>): number =>
    cards.reduce((acc, current) => acc + current.value, 0);
}
