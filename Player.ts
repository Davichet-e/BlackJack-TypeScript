import { BlackJackHand } from "./Hand";
/**
 *  Implement a casino player in TypeScript
 *
 *   @constructor
 *   @param {string} name
 *   @param {number} initialMoney
 */
export class Player {
  private _actualBet: number;
  private _actualMoney: number;
  readonly hand: BlackJackHand;

  constructor(readonly name: string, readonly initialMoney: number) {
    this._actualBet = 0;
    this._actualMoney = initialMoney;
    this.hand = new BlackJackHand();
  }

  get actualBet(): number {
    return this._actualBet;
  }

  set actualBet(value: number) {
    if (value < 0) throw new RangeError("Cannot assign a negative number");
    this._actualBet = value;
  }

  get actualMoney(): number {
    return this._actualMoney;
  }

  set actualMoney(value: number) {
    if (value < 0) throw new RangeError("Cannot assign to a negative number");
    this._actualMoney = value;
  }

  public toString = (): string => this.name;
}
