import { Hand } from "./Hand";
import { Deck, Card } from "./Deck";
/**
 *  Implement a casino player in TypeScript
 *
 *   @constructor
 *   @param {string} name
 *   @param {number} initialMoney
 */
export class Player {
  readonly hands: Array<Hand>;
  private _bet: number;
  private _actualMoney: number;
  private _deck: Deck;

  constructor(
    readonly name: string,
    readonly initialMoney: number,
    deck: Deck
  ) {
    this._bet = 0;
    this._actualMoney = initialMoney;
    this.hands = [new Hand(deck)];
    this._deck = deck;
  }

  get bet(): number {
    return this._bet;
  }

  set bet(value: number) {
    if (value < 0) throw new RangeError("Cannot assign a negative number");
    this._bet = value;
  }

  get actualMoney(): number {
    return this._actualMoney;
  }

  set actualMoney(value: number) {
    if (value < 0) throw new RangeError("Cannot assign to a negative number");
    this._actualMoney = value;
  }

  public resetHands = () =>
    this.hands.forEach((hand: Hand) => hand.initializeAttributes());

  public hit = (handIndex: number) => this.hands[handIndex].dealCard();

  /**
   * @returns An optional error message
   */
  public double(): string | undefined {
    if (this.bet * 2 > this.actualMoney)
      return "Cannot double because you have not enough money!";
    else if (this.hands[0].cards.length !== 2)
      return "Cannot double because you have already hit!";
    else if (this.hands.length > 1)
      return "Cannot double because you have already splitted!";

    this._bet *= 2;
  }

  public surrender(): string | undefined {
    if (this.hands[0].cards.length !== 2)
      return "Cannot double because you have already hit!";
    else if (this.hands.length > 1)
      return "Cannot double because you have already splitted!";

    this._bet /= 2;
    this.hands[0].points = 0;
  }

  public split(): string | undefined {
    const firsHandCards: Array<Card> = this.hands[0].cards;
    if (this._bet * 2 > this._actualMoney) {
      return "Cannot split because you have not enough money!";
    } else if (this.hands.length > 1) {
      return "Cannot split because you have already splitted!";
    } else if (firsHandCards.length !== 2) {
      return "Cannot split because you have already hit!";
    } else if (firsHandCards[0].name !== firsHandCards[1].name) {
      return "Cannot split because your cards are not equal!";
    }

    this._bet *= 2;

    const cards: Array<Card> = [
      this.hands[0].cards.pop(),
      this._deck.dealCard()
    ];
    this.hands.push(new Hand(this._deck, cards));

    this.hands[0].dealCard();
  }

  public win(): number {
    const moneyBefore: number = this._actualMoney;
    this._actualMoney += this._bet;

    // If has a BlackJack, sums 1.5 times the actual bet, otherwise just 1 time
    if (this.hands[0].hasBlackJack()) {
      this._actualMoney += this._bet / 2;
    }
    if (this.hands.length > 1 && this.hands[1].hasBlackJack()) {
      this._actualMoney += this._bet / 2;
    }
    return this._actualMoney - moneyBefore;
  }

  public lose() {
    this._actualMoney -= this._bet;
  }

  public toString = (): string => this.name;
}
