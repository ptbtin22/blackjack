"use strict";

let cardImg = document.getElementById("img");

const VALUES = [
  "ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
];

const SUITS = ["spades", "clubs", "diamonds", "hearts"];

class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }
  get cardPoints() {
    if (this.value == "jack" || this.value == "queen" || this.value == "king")
      return 10;
    else if (this.value == "ace") return 11;
    else {
      return parseInt(this.value);
    }
  }
}

class Hand {
  constructor() {
    this.cards = [];
    this.points = 0;
  }
  addCard(card) {
    this.cards.push(card);
    this.points += card.cardPoints;
    if (this.points > 21) {
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].value == "ace") {
          this.points -= 10;
          this.cards[i].value = "1"; // change this so that next time it won't subtract another 10
          if (this.points <= 21) break;
        }
      }
    }
  }
  busted() {
    return this.points > 21;
  }
  showHand(kind) {
    if (kind === 1) {
      this.cards.forEach((card) => {
        let cardImg = document.createElement("img");
        cardImg.src = `PNG-cards-1.3/${card.value}_of_${card.suit}.png`;
        document.getElementById("dealer-cards").append(cardImg);
      });
    } else if (kind === 2) {
      this.cards.forEach((card) => {
        let cardImg = document.createElement("img");
        cardImg.src = `PNG-cards-1.3/${card.value}_of_${card.suit}.png`;
        document.getElementById("player-cards").append(cardImg);
      });
    }
  }
  showCard_Hidden() {
    return `${this.cards[0].value + this.cards[0].suit}  (hidden)`;
  }
}

let allDecks = [];

const createDeck = () => {
  const deck = [];
  for (let i = 0; i < VALUES.length; i++) {
    for (let j = 0; j < SUITS.length; j++) {
      const card = new Card(VALUES[i], SUITS[j]);
      deck.push(card);
    }
  }
  return deck;
};

const shuffleDeck = (num = 1) => {
  for (let i = 0; i < num; i++) {
    allDecks = [...allDecks, ...createDeck()];
  }
  for (let i = allDecks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allDecks[i], allDecks[j]] = [allDecks[j], allDecks[i]];
  }
};

const dealCards = () => {
  for (let i = 0; i < 4; i++) {
    if (i % 2 === 0) {
      playerHand.addCard(allDecks.pop());
    } else {
      dealerHand.addCard(allDecks.pop());
    }
  }
};

function hasBlackJack(hand) {
  return (
    ((hand.cards[0].value == "10" ||
      hand.cards[0].value == "jack" ||
      hand.cards[0].value == "queen" ||
      hand.cards[0].value == "king") &&
      hand.cards[1].value == "ace") ||
    ((hand.cards[1].value == "10" ||
      hand.cards[1].value == "jack" ||
      hand.cards[1].value == "queen" ||
      hand.cards[1].value == "king") &&
      hand.cards[0].value == "ace")
  );
}

const playerHand = new Hand();
const dealerHand = new Hand();

window.onload = function () {
  shuffleDeck();
  dealCards();
  dealerHand.showHand(1);
  playerHand.showHand(2);
};

/* if (hasBlackJack(playerHand)) {
  console.log("Player has BlackJack!");
  console.log(
    "Dealer's hand revealed:",
    dealerHand.showCard(),
    dealerHand.points
  );
  if (hasBlackJack(dealerHand)) {
    console.log("It's a draw!");
  } else {
    console.log("You win!");
  }
} else {
  if (hasBlackJack(dealerHand)) {
    console.log("Sorry, dealer has BlackJack! Dealer wins!");
    console.log("Dealer's hand:", dealerHand.showCard(), dealerHand.points);
  } else {
    do {
      const playerChoice = prompt("Hit or stay: ");
      if (playerChoice.toLowerCase() == "stay") {
        break;
      } else if (playerChoice.toLowerCase() == "hit") {
        playerHand.addCard(allDecks[idx++]);
        console.log("Player's hand:", playerHand.showCard(), playerHand.points);
      }
    } while (!playerHand.busted());
    console.log(
      "Dealer's hand revealed:",
      dealerHand.showCard(),
      dealerHand.points
    );
    while (dealerHand.points < 17) {
      dealerHand.addCard(allDecks[idx++]);
      console.log("Dealer's hand:", dealerHand.showCard(), dealerHand.points);
    }
    if (dealerHand.busted() && playerHand.busted()) {
      console.log("It's a draw!");
    } else if (dealerHand.busted && !playerHand.busted()) {
      console.log("Player wins!");
    } else {
      console.log("Dealer wins");
    }
  }
} */
