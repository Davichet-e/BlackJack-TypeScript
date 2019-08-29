import { Deck, Card } from "./Deck";

/**
 * Represent a 21 BlackJack in TypeScript
 */
export class BlackJackHand {
  static readonly deck: Deck = new Deck();
  private _cards: Array<Card>;
  private _points: number;

  private _aces: number;

  constructor() {
    this.initializeAttributes();
  }

  get cards(): Array<Card> {
    return this._cards;
  }

  get points(): number {
    return this._points;
  }

  public initializeAttributes() {
    this._cards = BlackJackHand.deck.getInitialCards();
    this._points = BlackJackHand.calculatePoints(this.cards);
    this._aces = 0;
    this.cards.forEach(this.checkIfAce);
    this.checkAcePoints();
  }

  public dealCard() {
    const card: Card = BlackJackHand.deck.dealCard();
    this.checkIfAce(card);
    this._cards.push(card);
    this.updatePoints(card);
    this.checkIfLost();
  }

  private checkIfAce(card: Card) {
    if (card.name === "ACE") this._aces += 1;
  }

  private checkAcePoints() {
    while (this.points > 21 && this._aces > 0) {
      this._points -= 10;
      this._aces -= 1;
    }
  }

  private updatePoints(card: Card) {
    this._points += card.value;
    this.checkAcePoints();
  }

  private checkIfLost() {
    if (this._points > 21) this._points = 0;
  }

  public toString = (): string =>
    this._cards.map(card => card.toString()).join(", ");

  static calculatePoints = (cards: Array<Card>): number =>
    cards.reduce((acc, current) => acc + current.value, 0);
}
