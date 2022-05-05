"use strict";

// color for wrong input: #fa5252
// color for correct input: #51cf66

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
const formLabel = document.querySelector(".form-label");
const modalTitle = document.querySelector(".save-score-text");

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
  #gameon = false;

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

    btnLT.addEventListener("click", this._lithuanianLang.bind(this));
    btnEN.addEventListener("click", this._englishLang.bind(this));
  }

  _generateRandom() {
    this.#random = Math.trunc(Math.random() * 20) + 1;
    console.log(this.#random);
  }

  _submitNum() {
    this.input = Number(inputNum.value);
    this.#gameon = true;

    // check if input number is valid
    if (this.input <= 0 || !this.input) {
      message.textContent = !this.#lithuanian
        ? "Number should be positive"
        : "Skaičius turėtų būt teigiamas";
    } else {
      // correct number
      this._correctNumber();

      // wrong number
      this._wrongNumber();
    }
  }

  _correctNumber() {
    if (this.input === this.#random) {
      secretBox.style.backgroundColor = "#51cf66";
      inputNum.style.boxShadow = "0 0 12px #51cf66";
      secretNum.textContent = this.#random;
      message.textContent = !this.#lithuanian
        ? "Correct number!"
        : "Teisingas skaičius!";
      this.#game = false;
      // change highscore if points are higher
      if (this.#points > this.#highscore) {
        this.#highscore = this.#points;
        highScore.textContent = this.#highscore;
        setTimeout(() => modal.classList.remove("hidden"), 1500);
      }
    }
  }

  _wrongNumber() {
    if (this.input !== this.#random && this.#game) {
      if (this.#points === 1) {
        this.#points = 0;
        pointsNum.textContent = this.#points;
        message.textContent = !this.#lithuanian
          ? "Game Over!"
          : "Žaidimo pabaiga!";
        this.#game = false;
      } else {
        if (this.input !== this.#random && this.#game) {
          //   secretBox.style.backgroundColor = "red";
          message.style.color = "#fa5252";
          inputNum.style.boxShadow = "0 0 24px #fa5252";
          setTimeout(function () {
            message.style.color = "#212529";
            secretBox.style.backgroundColor = "#343a40";
            inputNum.style.boxShadow = "none";
          }, 500);
          message.textContent =
            this.input < this.#random
              ? `${
                  !this.#lithuanian
                    ? "Number is too small!"
                    : "Skaičius per mažas!"
                }`
              : `${
                  !this.#lithuanian
                    ? "Number is too big!"
                    : "Skaičius per didelis!"
                }`;
          this.#points--;
          pointsNum.textContent = this.#points;
        }
      }
    }
  }

  _initialParam() {
    this.#gameon = false;
    pointsNum.textContent = this.#points = 20;
    this.#game = true;
    message.textContent = !this.#lithuanian
      ? "Guess number.."
      : "Spėk skaičiu..";
    inputNum.value = "";
    secretBox.style.backgroundColor = "#343a40";
    inputNum.style.boxShadow = "none";
    secretNum.textContent = "?";
    modalTitle.style.display = "block";
    this._generateRandom();
  }

  _pressYes() {
    modalBtns.style.display = "none";
    modalTitle.style.display = "none";
    inputNameBox.style.display = "flex";
  }

  _pressNo() {
    modal.classList.add("hidden");
  }

  _submitPlayer(e) {
    e.preventDefault();
    const name = nameInput.value;
    nameInput.value = "";
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
    if (!this.#gameon) {
      this.#lithuanian = true;
      gameName.textContent = "Spėk Skaičių";
      message.textContent = "Spėk skaičių..";
      scoreboardTitle.textContent = "Rezultatai";
      scoreboardList_name.textContent = "Vardas";
      scoreboardList_score.textContent = "Aukščiausias rez.";
      pointsText.textContent = "Taškai:";
      pointsNum.textContent = this.#points;
      highscoreText.textContent = "Geriausias rezultatas:";
      highScore.textContent = this.#highscore;
      formLabel.textContent = "Tavo vardas";
      modalTitle.textContent = "Ar norite išsaugoti savo rezultatą?";
      btnYes.textContent = "Taip";
      btnNo.textContent = "Ne";
    }
  }

  _englishLang() {
    if (!this.#gameon) {
      this.#lithuanian = false;
      gameName.textContent = "Guess Number";
      message.textContent = "Guess number..";
      scoreboardTitle.textContent = "Scoreboard";
      scoreboardList_name.textContent = "Name";
      scoreboardList_score.textContent = "Highscore";
      pointsText.textContent = "Points:";
      pointsNum.textContent = this.#points;
      highscoreText.textContent = "Highscore:";
      highScore.textContent = this.#highscore;
      formLabel.textContent = "Your name";
      modalTitle.textContent = "Do you want to save your highscore?";
    }
  }
}

const app = new App();
