import { BlackJackPlayer } from "./BlackJackPlayer";
import { BlackJackHand } from "./Hand";

const readLineSync = require("readline-sync");

let players: Array<BlackJackPlayer> = [];
const dealerHand: BlackJackHand = new BlackJackHand();

export function blackJack() {
  startGame();
  while (true) {
    // TODO console.log("Game Started")
    console.log(
      `\t\t\t\tThe first card of the dealer is ${dealerHand.cards[0]}`
    );

    players.forEach(playerTurn);

    dealerTurn();
    endGame();
    if (!nextGame()) break;
  }
  // rl.close();
}

export function startGame() {
  console.log(
    "\t\t\t\tThis BlackJack Game has been created by David Garcia Morillo"
  );
  const numberOfPeople: number = askNumberOfPeople();
  askAndSetPlayerAttributes(numberOfPeople);
}

export function askNumberOfPeople(): number {
  let numberOfPeople: number;
  while (true) {
    numberOfPeople = readLineSync.questionInt(
      "\t\t\t\tHow many people are going to play? (1-5)\n\t\t\t\t",
      { limitMessage: "\t\t\t\tPlease, use only integral values" }
    );

    if (!(0 < numberOfPeople && numberOfPeople <= 5))
      console.log("\t\t\t\tThe number of people must be between 1 and 5\n");
    else break;
  }

  return numberOfPeople;
}

export function askAndSetPlayerAttributes(numberOfPeople: number) {
  for (let i = 0; i < numberOfPeople; i++) {
    const name: string = readLineSync.question(
      `\t\t\t\tPlease, enter your name, Player ${i + 1}\n\t\t\t\t`
    );
    let initialMoney: number;
    while (true) {
      initialMoney = readLineSync.questionInt(
        "\n\t\t\t\tHow much money do you have? (Use only integral values)\n\t\t\t\t",
        { limitMessage: "\t\t\t\tPlease, use only integral values" }
      );

      if (initialMoney < 50)
        console.log(
          "\t\t\t\tThe initial money must be greater or equal than 50\n"
        );
      else {
        players.push(new BlackJackPlayer(name, initialMoney));
        break;
      }
    }
  }
}

export function askPlayerBet(player: BlackJackPlayer) {
  let bet: number;
  while (true) {
    bet = readLineSync.questionInt(
      "\t\t\t\tWhat bet do you wanna make?\n\t\t\t\t",
      { limitMessage: "\t\t\t\tPlease, use only integral values" }
    );
    if (bet > player.actualMoney)
      console.log(
        "\t\t\t\tYour bet cannot be greater than your actual money.\n"
      );
    else if (bet <= 0)
      console.log("\t\t\t\tYour bet must be greater than 0.\n");
    else {
      player.actualBet = bet;
      break;
    }
  }
}

export function playerWinOrLose(player: BlackJackPlayer): boolean {
  let result: boolean = false;
  const playerPoints = player.hand.points;
  if (playerPoints === 21) {
    console.log("\t\t\t\tBLACKJACK");
    result = true;
  } else if (playerPoints === 0) {
    console.log("\t\t\t\tBUST.\n\t\t\t\tI'm afraid you lose this game :(\n");
    result = true;
  }
  return result;
}

export const checkIfYes = (userDecision: string): boolean =>
  ["y", "yes", "1", "true"].includes(userDecision.trim().toLowerCase());

export function askIfHit(): boolean {
  const decision: string = readLineSync.question(
    "\t\t\t\tDo you wanna hit?\n\t\t\t\t"
  );
  return checkIfYes(decision);
}

export function playerTurn(player: BlackJackPlayer) {
  //TODO console.log("player turn")
  console.log(
    `\t\t\t\t${player}, your actual money is ${player.actualMoney} €\n`
  );

  askPlayerBet(player);

  console.log("\n\t\t\t\tYour cards are: ");
  console.log(`\t\t\t\t${player.hand.cards[0]} and ${player.hand.cards[1]}\n`);

  while (!playerWinOrLose(player)) {
    if (askIfHit()) {
      player.hand.dealCard();
      console.log(`\t\t\t\tNow, your cards are: ${player.hand}`);
    } else {
      console.log(`\t\t\t\t${player} stood`);
      break;
    }
  }
}

export function dealerLost(): boolean {
  if (dealerHand.points === 0) {
    console.log("\t\t\t\tThe dealer busted. The game ended :)\n");
    return true;
  }
  return false;
}

export function dealerTurn() {
  // TODO console.log(Dealer's turn);
  console.log(
    `\t\t\t\tThe dealer's cards are ${dealerHand.cards[0]} and ${dealerHand.cards[1]}\n`
  );

  while (!dealerLost() && dealerHand.points < 17) {
    console.log("\t\t\t\tThe dealer is going to hit a card\n");
    dealerHand.dealCard();
    console.log(`\t\t\t\tNow, the dealer's cards are: ${dealerHand}`);
  }
}

export function endGame() {
  // TODO console.log(results)
  players.forEach(player => {
    if (player.hand.points === 21 || player.hand.points > dealerHand.points) {
      player.actualMoney += player.actualBet;
      console.log(`\t\t\t\t${player} won ${player.actualBet * 2}€ :)\n`);
    } else if (
      player.hand.points === 0 ||
      player.hand.points < dealerHand.points
    ) {
      player.actualMoney -= player.actualBet;
      console.log(`\t\t\t\t${player} lost against the dealer :(\n`);
    } else console.log(`\t\t\t\t${player}, it is a tie! :|\n`);
  });
}

export function askIfReset(player: BlackJackPlayer): boolean {
  let playerResets: boolean = false;
  let finalBalance: string = `${player.actualMoney - player.initialMoney} €`;

  if (!finalBalance.includes("-")) finalBalance = "+" + finalBalance;

  if (player.actualMoney > 0) {
    const decision: string = readLineSync.question(
      `\t\t\t\t${player}, do you want to play again? (y/n)\n\t\t\t\t`
    );

    if (checkIfYes(decision)) {
      player.hand.initializeAttributes();
      playerResets = true;
    } else {
      console.log(
        `\t\t\t\tThanks for playing, ${player}. Your final balance is ${finalBalance}\n`
      );
    }
  } else {
    console.log(
      `\t\t\t\t${player}, you have lost all your money. Thanks for playing\n`
    );
  }
  return playerResets;
}

export function nextGame(): boolean {
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
