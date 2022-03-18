export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isPlayed = false;
        this.intervalId = null;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
        this.view.renderStartScreen();
    }

    update() {
        this.game.moveFigureDown();
        this.updateView();
    }

    play() {
        this.isPlayed = true;
        this.startTimer();
        this.updateView();
    }

    pause() {
        this.isPlayed = false;
        this.stopTimer();
        this.view.renderPauseScreen();
    }

    updateView() {
        const state = this.game.getState();

        if (state.isGameOver)
            this.view.renderGameOverScreen(state);
        else if (!this.isPlayed)
            this.view.renderPauseScreen();
        else 
            this.view.render(state);
    }

    startTimer() {
        let speedGame =  1000 - this.game.level * 100; 
        
        if (speedGame < 0) speedGame = 100;
        if (!this.intervalId){
            this.intervalId = setInterval(() => {
                this.update();
            }, speedGame > 0 ? speedGame : 100);
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

    }

    reset() {
        this.game.reset();
        this.play();
    }

    handleKeyDown(event) {
        switch(event.keyCode) {
            case 13:
                if (this.game.getState().isGameOver) this.reset();
                else if (this.isPlayed) this.pause();
                else this.play(); 
                break;
            case 37: 
                this.game.moveFigureLeft();
                this.updateView();
                break;
            case 38: 
                this.game.rotateFigure();
                this.updateView();
                break;
            case 39: 
                this.game.moveFigureRight();
                this.updateView();
                break;
            case 40: 
                this.game.moveFigureDown();
                this.stopTimer();
                this.updateView();
                break;
        }
    }

    handleKeyUp(event) {
        if (event.keyCode === 40) {
            this.startTimer();
        }
    }
}