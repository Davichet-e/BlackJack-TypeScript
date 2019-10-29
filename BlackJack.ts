import { Player } from "./Player";
import { Hand } from "./Hand";

import readLineSync = require("readline-sync");
import { Deck } from "./Deck";

let deck: Deck;
let players: Array<Player> = [];
let dealerHand: Hand;

function blackJack() {
  console.log("This BlackJack Game has been created by David Garcia Morillo");
  let nOfDecks: number;
  while (true) {
    nOfDecks = readLineSync.questionInt(
      "How many decks do you want to use (4-8)\n> ",
      { limitMessage: "Please, use only integral values" }
    );
    if (nOfDecks <= 3 || nOfDecks > 8)
      console.log("The number of decks must be between 4 and 8\n");
    else break;
  }

  deck = new Deck(nOfDecks);
  dealerHand = new Hand(deck);

  startGame();
  while (true) {
    // TODO console.log("Game Started")
    console.log(`The first card of the dealer is ${dealerHand.cards[0]}`);

    players.forEach(playerTurn);

    dealerTurn();
    endGame();
    if (!nextGame()) break;
  }
  // rl.close();
}

function startGame() {
  const numberOfPeople: number = askNumberOfPeople();
  askAndSetPlayerAttributes(numberOfPeople);
}

function askNumberOfPeople(): number {
  let numberOfPeople: number;
  while (true) {
    numberOfPeople = readLineSync.questionInt(
      "How many people are going to play? (1-5)\n> ",
      { limitMessage: "Please, use only integral values" }
    );

    if (!(0 < numberOfPeople && numberOfPeople <= 5))
      console.log("The number of people must be between 1 and 5\n");
    else break;
  }

  return numberOfPeople;
}

function askAndSetPlayerAttributes(numberOfPeople: number) {
  for (let i = 1; i < numberOfPeople + 1; i++) {
    const name: string = readLineSync.question(
      `Please, enter your name, Player ${i}\n> `
    );
    while (true) {
      const initialMoney: number = readLineSync.questionInt(
        "\nHow much money do you have? (Use only integral values)\n> ",
        { limitMessage: "Please, use only integral values.\n" }
      );

      if (initialMoney < 50)
        console.log("The initial money must be greater or equal than 50\n");
      else {
        players.push(new Player(name, initialMoney, deck));
        break;
      }
    }
  }
}

function askPlayerBet(player: Player) {
  while (true) {
    const bet = readLineSync.questionInt("What bet do you wanna make?\n> ", {
      limitMessage: "Please, use only integral values"
    });
    if (bet > player.actualMoney)
      console.log("Your bet cannot be greater than your actual money.\n");
    else if (bet <= 0) console.log("Your bet must be greater than 0.\n");
    else {
      player.bet = bet;
      break;
    }
  }
}

function playerWinOrLose(hand: Hand): boolean {
  let result: boolean = false;
  const playerPoints = hand.points;
  if (playerPoints === 21) {
    if (hand.hasBlackJack()) console.log("BLACKJACK!");
    else console.log("YOU GOT 21 POINTS!");

    result = true;
  } else if (playerPoints === 0) {
    console.log("BUST.\nI'm afraid you lose this game :(\n");
    result = true;
  }
  return result;
}

const checkIfYes = (userDecision: string): boolean =>
  ["y", "yes", "1", "true"].includes(userDecision.trim().toLowerCase());

function askPlayerAction(): boolean {
  const decision: string = readLineSync.question("What do you want to do?\n> ");
  return checkIfYes(decision);
}

function playerTurn(player: Player) {
  console.log(`###### ${player}'s turn ######\n`);
  console.log(`${player}, your actual money is ${player.actualMoney} €\n`);

  askPlayerBet(player);

  console.log("\nYour cards are: ");
  console.log(
    `${player.hands[0].cards[0]} and ${player.hands[0].cards[1]} (${player.hands[0].points} points)\n`
  );

  let hasSplitted = false;
  let hasDoubled = false;
  for (const [i, hand] of player.hands.entries()) {
    // If the player has doubled, he can only hit one more time
    while (!playerWinOrLose(hand) && (!hasDoubled || hand.cards.length < 3)) {
      if (hasSplitted) {
        console.log(`(Hand #${i})`);
        console.log(`Your cards are: ${hand}`);
      }
      const userDecision = readLineSync
        .question(
          "\nWhat do you want to do?\nAvailable Commands: (h)it, (s)tand, (sp)lit, (d)ouble, (surr)ender\n> "
        )
        .trim()
        .toLowerCase();

      let breaking = false;
      switch (userDecision) {
        case "h":
        case "hit":
          player.hit(i);
          console.log(`Now, your cards are: ${hand}`);
          break;

        case "s":
        case "stand":
          console.log(`Player ${player} stood`);
          breaking = true;
          break;

        case "sp":
        case "split":
          if (!hasDoubled) {
            const errorMessage: string | undefined = player.split();
            if (errorMessage) console.log(errorMessage);
            else {
              hasSplitted = true;
              console.log("You have splitted the hand!");
            }
          } else
            console.log("You cannot split because you have already doubled");
          break;

        case "d":
        case "doubled":
          if (!hasDoubled) {
            const errorMessage: string | undefined = player.double();
            if (errorMessage) console.log(errorMessage);
            else {
              hasDoubled = true;
              console.log("You have doubled the bet!");
            }
          } else
            console.log("You cannot double because you have already doubled");
          break;

        case "surr":
        case "surrender":
          if (!hasDoubled) {
            const errorMessage: string | undefined = player.surrender();
            if (errorMessage) console.log(errorMessage);
            else {
              hasDoubled = true;
              console.log("You have surrendered!");
              breaking = true;
            }
          } else
            console.log(
              "You cannot surrender because you have already doubled"
            );
          break;

        default:
          console.log(
            "Invalid command!\nAvailable Commands: (h)it, (s)tand, (sp)lit, (d)ouble, (surr)ender"
          );
          break;
      }
      if (breaking) break;
    }
  }
}

function dealerLost(): boolean {
  if (dealerHand.points === 0) {
    console.log("The dealer busted. The game ended :)\n");
    return true;
  }
  return false;
}

function dealerTurn() {
  console.log("###### Dealer's Turn ######\n");
  console.log(
    `The dealer's cards are ${dealerHand.cards[0]} and ${dealerHand.cards[1]}\n`
  );

  while (!dealerLost() && dealerHand.points < 17) {
    console.log("The dealer is going to hit a card\n");
    dealerHand.dealCard();
    console.log(`Now, the dealer's cards are: ${dealerHand}`);
  }
}

function endGame() {
  // TODO console.log(results)
  const dealerPoints = dealerHand.points;

  for (const player of players) {
    for (const [i, hand] of player.hands.entries()) {
      const handPoints: number = hand.points;
      if (
        handPoints > dealerHand.points ||
        (hand.hasBlackJack() && dealerHand.hasBlackJack())
      ) {
        const moneyEarned: number = player.win();

        let handSpecification: string =
          player.hands.length === 1 ? "" : ` (#${i + 1} hand)`;

        console.log(`${player}${handSpecification} won ${moneyEarned}€ :)\n`);
      } else if (handPoints === 0 || handPoints < dealerHand.points) {
        player.lose();
        console.log(`${player} lost against the dealer :(\n`);
      } else console.log(`${player}, it is a tie! :|\n`);
    }
  }
}

function askIfReset(player: Player): boolean {
  let playerResets: boolean = false;
  let finalBalance: string = `${player.actualMoney - player.initialMoney} €`;

  if (!finalBalance.includes("-")) finalBalance = "+" + finalBalance;

  if (player.actualMoney > 0) {
    const decision: string = readLineSync.question(
      `${player}, do you want to play again? (y/n)\n> `
    );

    if (checkIfYes(decision)) {
      player.resetHands();
      playerResets = true;
    } else {
      console.log(
        `Thanks for playing, ${player}. Your final balance is ${finalBalance}\n`
      );
    }
  } else {
    console.log(
      `${player}, you have lost all your money. Thanks for playing\n`
    );
  }
  return playerResets;
}

function nextGame(): boolean {
  // TODO console.log(game finished)
  players = players.filter(askIfReset);

  console.log("\n\n\n\n\n");

  if (players.length) {
    dealerHand.initializeAttributes();
    return true;
  }
  return false;
}

blackJack();
