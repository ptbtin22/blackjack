"use strict";

class Hand {
  value;
  suit;
}

const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const dealerHand = [];
const playerHand = [];

const SUITS = ["♠️", "♣️", "♦️", "♥"];

let allDecks = [];

const createDeck = () => {
  const deck = [];
  for (let i = 0; i < VALUES.length; i++) {
    for (let j = 0; j < SUITS.length; j++) {
      const card = VALUES[i] + SUITS[j];
      deck.push(card);
    }
  }
  return deck;
};

console.log(createDeck());

const shuffleDeck = (num) => {
  for (let i = 0; i < num; i++) {
    allDecks = [...allDecks, ...createDeck()];
  }
  for (let i = allDecks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allDecks[i], allDecks[j]] = [allDecks[j], allDecks[i]];
  }
};

shuffleDeck(5);
console.log(allDecks);

const dealCards = () => {
  for (let i = 0; i < 4; i++) {
    if (i % 2 === 0) {
      playerHand.push(allDecks[i]);
    } else {
      dealerHand.push(allDecks[i]);
    }
  }
};

let idx = 4;

dealCards();

console.log("Cards are dealt");

console.log("Player's hand: ", playerHand);
console.log("Dealer's hand:", dealerHand.slice(0, 1));

const playerChoice = prompt("Hit or stay?");
if (playerChoice.toLocaleLowerCase() === "hit") {
  playerHand.push(allDecks[idx++]);
  console.log("Player's hand: ", playerHand);
  console.log("Dealer's hand:", dealerHand);
} else if (playerChoice.toLocaleLowerCase() === "stay") {
  console.log("Player's hand: ", playerHand);
  console.log("Dealer's hand:", dealerHand.slice(0, 1));
}

console.log("HI");
