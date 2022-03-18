import Game from "./game.js";
import View from "./view.js";
import Controller from "./controller.js"

// Config
const widthCanvas = 480;
const heightCanvas = 640;
const rowCanvas = 20;
const columnCanvas = 10;

const containerCanavs = document.getElementById("container-canvas");

const game = new Game(rowCanvas, columnCanvas);
const view = new View(containerCanavs, widthCanvas, heightCanvas, rowCanvas, columnCanvas);
const controller = new Controller(game, view);


