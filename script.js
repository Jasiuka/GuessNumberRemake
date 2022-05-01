"use strict";

// general
const secretBox = document.querySelector(".secret-num-box");
const modal = document.querySelector(".modal");
const appElement = document.querySelector(".app");
const inputNameBox = document.querySelector(".box-input");

// inputs
const inputNum = document.querySelector(".num-input");
const nameInput = document.querySelector(".name");
// buttons
const checkBtn = document.querySelector(".submit");
const againBtn = document.querySelector(".again");
const modalBtns = document.querySelector(".btns-modal");
const btnYes = document.querySelector(".btn-yes");
const btnNo = document.querySelector(".btn-no");
const btnEN = document.querySelector(".en");
const btnLT = document.querySelector(".lith");
// text
const gameName = document.querySelector(".game-name");
const message = document.querySelector(".message");
const scoreboardTitle = document.querySelector(".scoreboard-title");
const scoreboardList_name = document.querySelector(".sb-list-name");
const scoreboardList_score = document.querySelector(".sb-list-score");
const pointsText = document.querySelector(".points-text");
const highscoreText = document.querySelector(".highscore-text");

// numbers
const pointsNum = document.querySelector(".points-num");
const highScore = document.querySelector(".high-points-num");
const secretNum = document.querySelector(".secret-num");

class Player {
  id = (Date.now() + "").slice(-7);

  constructor(name, score) {
    this.name = name;
    this.score = score;

    console.log(this.id);
  }
}

class App {
  #random;
  #game = true;
  #points = 20;
  #highscore = 0;
  #lithuanian = false;
  #players = [];

  constructor(input) {
    this.input = input;
    // generate random secret num
    this._generateRandom();
    this._getLocalStorage();

    if (this.#game === true) {
      checkBtn.addEventListener("click", this._submitNum.bind(this));
    }

    againBtn.addEventListener("click", this._initialParam.bind(this));

    btnYes.addEventListener("click", this._pressYes);

    btnNo.addEventListener("click", this._pressNo);

    inputNameBox.addEventListener("submit", this._submitPlayer.bind(this));

    // btnLT.addEventListener("click", this._lithuanianLang.bind(this));
  }

  _generateRandom() {
    this.#random = Math.trunc(Math.random() * 20) + 1;
    console.log(this.#random);
  }

  _submitNum() {
    this.input = Number(inputNum.value);

    // check if input number is valid
    if (this.input <= 0 || !this.input) {
      message.textContent = "Number should be positive";
    } else {
      // correct number
      this._correctNumber();

      // wrong number
      this._wrongNumber();
    }
  }

  _correctNumber() {
    if (this.input === this.#random) {
      secretBox.style.backgroundColor = "green";
      secretNum.textContent = this.#random;
      message.textContent = "Correct number!";
      this.#game = false;
      // change highscore if points are higher
      if (this.#points > this.#highscore) {
        this.#highscore = this.#points;
        highScore.textContent = this.#highscore;
        modal.classList.remove("hidden");
      }
    }
  }

  _wrongNumber() {
    if (this.input !== this.#random && this.#game) {
      if (this.#points === 1) {
        this.#points = 0;
        pointsNum.textContent = this.#points;
        message.textContent = "Game Over!";
        this.#game = false;
      } else {
        if (this.input !== this.#random && this.#game) {
          //   secretBox.style.backgroundColor = "red";
          message.style.color = "red";
          inputNum.style.boxShadow = "0 0 24px red";
          setTimeout(function () {
            message.style.color = "black";
            secretBox.style.backgroundColor = "black";
            inputNum.style.boxShadow = "none";
          }, 1000);
          message.textContent =
            this.input < this.#random
              ? "Number is too small!"
              : "Number is too big!";
          this.#points--;
          pointsNum.textContent = this.#points;
        }
      }
    }
  }

  _initialParam() {
    pointsNum.textContent = this.#points = 20;
    this.#game = true;
    message.textContent = "Guess number..";
    inputNum.value = "";
    secretBox.style.backgroundColor = "black";
    secretNum.textContent = "?";
    this._generateRandom();
  }

  _pressYes() {
    modalBtns.style.display = "none";
    inputNameBox.style.display = "flex";
  }

  _pressNo() {
    modal.classList.add("hidden");
  }

  _submitPlayer(e) {
    e.preventDefault();
    const name = nameInput.value;
    const score = this.#highscore;
    let player;
    console.log(this.#highscore);

    player = new Player(name, score);
    this.#players.push(player);
    this._pressNo();
    this._addToScoreboard(player);

    this._setLocalStorage();
  }

  _addToScoreboard(player) {
    const html = `<tr>
    <td>${player.name}</td>
    <td>${player.score}</td>
  </tr>`;

    document.querySelector(".tbody").insertAdjacentHTML("afterbegin", html);
  }

  _setLocalStorage() {
    localStorage.setItem("players", JSON.stringify(this.#players));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("players"));
    if (!data) return;
    this.#players = data;
    this.#players.forEach((player) => {
      this._addToScoreboard(player);
    });
  }

  _lithuanianLang() {
    this.#lithuanian = true;
    gameName.textContent = "Spėk Skaičių";
    message.textContent = "Spėk skaičiu..";
    scoreboardTitle.textContent = "Rezultatai";
    scoreboardList_name.textContent = "Vardas";
    scoreboardList_score.textContent = "Aukščiausias rez.";
    pointsText.textContent = "Taškai:";
    highscoreText.textContent = "Geriausias rezultatas:";
  }
}

const app = new App();
