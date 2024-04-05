"use strict";

var canHit = true;

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
  addCardDealer(card) {
    this.cards.push(card);
    this.points += card.cardPoints;
    let cardImg = document.createElement("img");
    if (this.cards.length === 2) {
      cardImg.src = `PNG-cards-1.3/down_card.jpg`;
      cardImg.id = "hidden-card";
    } else {
      cardImg.src = `PNG-cards-1.3/${card.value}_of_${card.suit}.png`;
    }
    document.getElementById("dealer-cards").append(cardImg);
    if (this.points > 21) {
      for (const card of this.cards) {
        if (card.value == "ace") {
          this.points -= 10;
          card.value = "1"; // change this so that next time it won't subtract another 10
          if (this.points <= 21) break;
        }
      }
    }
  }
  addCardPlayer(card) {
    this.cards.push(card);
    this.points += card.cardPoints;
    let cardImg = document.createElement("img");
    cardImg.src = `PNG-cards-1.3/${card.value}_of_${card.suit}.png`;
    document.getElementById("player-cards").append(cardImg);
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
      playerHand.addCardPlayer(allDecks.pop());
    } else {
      dealerHand.addCardDealer(allDecks.pop());
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

function initializeGame() {
  allDecks = [];
  shuffleDeck();
  dealCards();
  canHit = true;
  document.getElementById("stay").disabled = false;
  document.getElementById("hit").disabled = false;
  if (hasBlackJack(playerHand)) {
    canHit = false;
    showNotification("You have blackjack!");
    document.getElementById("stay").disabled = true;
    document.getElementById("hit").disabled = true;
    setTimeout(function () {
      if (hasBlackJack(dealerHand)) {
        showNotification("Dealer also has BlackJack! It's a draw!");
      } else {
        showNotification("Dealer doesn't have BlackJack! You won!");
      }
      let hiddenCardImg = document.getElementById("hidden-card");
      hiddenCardImg.src = `PNG-cards-1.3/${dealerHand.cards[1].value}_of_${dealerHand.cards[1].suit}.png`;
    }, 2000);
  } else {
    if (hasBlackJack(dealerHand)) {
      document.getElementById("stay").disabled = true;
      document.getElementById("hit").disabled = true;
      canHit = false;
      showNotification("Dealer has BlackJack! Dealer wins");
      let hiddenCardImg = document.getElementById("hidden-card");
      hiddenCardImg.src = `PNG-cards-1.3/${dealerHand.cards[1].value}_of_${dealerHand.cards[1].suit}.png`;
    }
  }
}

window.onload = function () {
  initializeGame();
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  document.getElementById("next-game").addEventListener("click", next_game);
};

function next_game() {
  playerHand.cards = [];
  dealerHand.cards = [];

  playerHand.points = 0;
  dealerHand.points = 0;

  document.getElementById("player-cards").innerHTML = "";
  document.getElementById("dealer-cards").innerHTML = "";

  initializeGame();
}

function showNotification(message) {
  let notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(function () {
    notification.style.display = "none";
  }, 2000); // Hide the notification after 2 seconds
}

function stay() {
  playHitSound();
  canHit = false;
  let hiddenCardImg = document.getElementById("hidden-card");
  hiddenCardImg.src = `PNG-cards-1.3/${dealerHand.cards[1].value}_of_${dealerHand.cards[1].suit}.png`;
  setTimeout(
    function () {
      while (dealerHand.points < 17) {
        dealerHand.addCardDealer(allDecks.pop());
      }
      if (hasBlackJack(dealerHand)) {
        showNotification("The dealer has BlackJack! Dealer wins!");
      } else if (dealerHand.busted() && playerHand.busted()) {
        showNotification("Dealer busted! It's a draw!");
      } else if (dealerHand.busted() && !playerHand.busted()) {
        showNotification("Dealer busted! You won!");
      } else if (!dealerHand.busted() && playerHand.busted()) {
        showNotification("Dealer wins!");
      } else if (!dealerHand.busted() && !playerHand.busted()) {
        if (dealerHand.points === playerHand.points) {
          showNotification("It's a draw!");
        } else if (dealerHand.points > playerHand.points) {
          showNotification("Dealer wins!");
        } else {
          showNotification("You won!");
        }
      }
    },
    playerHand.busted() ? 2000 : 0
  );
}

function playHitSound() {
  let audio = new Audio("sfx/hit_card.mp3");
  audio.play();
}

function hit() {
  if (!canHit) {
    return;
  }
  playerHand.addCardPlayer(allDecks.pop());
  playHitSound();
  if (playerHand.busted()) {
    showNotification("You busted!");

    stay();
  }
}
