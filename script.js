"use strict";

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

const SUITS = ["♠️", "♣️", "♦️", "♥"];

class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }
  get cardPoints() {
    if (this.value == "J" || this.value == "Q" || this.value == "K") return 10;
    else if (this.value == "A") return 11;
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
        if (this.cards[i].value == "A") {
          this.points -= 10;
          if (this.points <= 21) break;
        }
      }
    }
  }
  busted() {
    return this.points > 21;
  }
  showCard() {
    let res = "";
    this.cards.forEach((card) => {
      res += `${card.value}${card.suit} `;
    });
    return res;
  }
  showCard_Hidden() {
    return `${this.cards[0].value + this.cards[0].suit}  (hidden)`;
  }
}

const playerHand = new Hand();
const dealerHand = new Hand();

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

shuffleDeck();

const dealCards = () => {
  for (let i = 0; i < 4; i++) {
    if (i % 2 === 0) {
      playerHand.addCard(allDecks[i]);
    } else {
      dealerHand.addCard(allDecks[i]);
    }
  }
};

function hasBlackJack(hand) {
  return (
    ((hand.cards[0].value == "10" ||
      hand.cards[0].value == "J" ||
      hand.cards[0].value == "Q" ||
      hand.cards[0].value == "K") &&
      hand.cards[1].value == "A") ||
    ((hand.cards[1].value == "10" ||
      hand.cards[1].value == "J" ||
      hand.cards[1].value == "Q" ||
      hand.cards[1].value == "K") &&
      hand.cards[0].value == "A") ||
    (hand.cards[0].value == "A" && hand.cards[1].value == "A")
  );
}

let idx = 4;

dealCards();

console.log("Early game");
console.log("Cards are dealt");

console.log("Player's hand:", playerHand.showCard(), playerHand.points);
console.log("Dealer's hand:", dealerHand.showCard_Hidden());

if (hasBlackJack(playerHand)) {
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
  if (
    playerHand.busted() ||
    hasBlackJack(dealerHand) ||
    dealerHand.points > playerHand.points
  ) {
    console.log("Dealer wins!");
  } else if (dealerHand.points == playerHand.points) {
    console.log("It's a draw!");
  } else {
    while (dealerHand.points <= playerHand.points) {
      dealerHand.addCard(allDecks[idx++]);
      if (dealerHand.busted()) {
        console.log("Dealer's hand:", dealerHand.showCard(), dealerHand.points);
        console.log("Dealer busted! Player wins!");
        break;
      }
      if (dealerHand.points > playerHand.points) {
        console.log("Dealer's hand:", dealerHand.showCard(), dealerHand.points);
        console.log("Dealer wins!");
        break;
      }
    }
  }
}
/* chien thuat::: tinh truoc cac con bai khong phai At, chua At lai tinh diem cuoi cung
    neu trong tay nguoi choi da co 21 diem, viec 'hit' chac chan se dan den busted du` la` quan At
    A A 
*/
