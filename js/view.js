export default class View {
    colors = {
        1: "#6df7c1",
        2: "#393457",
        3: "#f7e476",
        4: "#c92464",
        5: "#f48cb6",
        6: "#11adc1",
        7: "#6a3771"
    };

    constructor(container, width, height, rows, columns) {
        this.container = container;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.ctx = this.canvas.getContext("2d");

        container.append(this.canvas);

        this.mainColor = "#606c81";

        this.playfieldBorderWidth = 2;
        this.playfieldX = this.playfieldBorderWidth;
        this.playfieldY = this.playfieldBorderWidth;

        this.playfieldWidth = this.width * 2 / 3;
        this.playfieldHeight = this.height;

        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows;

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;
        this.figurePanelScale = 0.5;
    }

    render(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    renderStartScreen() {
        this.ctx.fillStyle = this.mainColor;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle"
        this.ctx.font = "24px 'Arial'";

        this.ctx.fillText("Press Enter to Start", this.playfieldInnerWidth / 2, this.playfieldInnerHeight / 2);
    }

    renderPauseScreen() {
        this.ctx.fillStyle = this.mainColor;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle"
        this.ctx.font = "24px 'Arial'";

        this.ctx.fillText("Pause! Press Enter to Game", this.playfieldInnerWidth / 2, this.playfieldInnerHeight / 2);
    }

    renderGameOverScreen({ score }) {
        this.clearScreen();
        this.ctx.fillStyle = this.mainColor;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle"
        this.ctx.font = "24px 'Arial'";

        this.ctx.fillText("game Over", this.playfieldInnerWidth / 2, this.playfieldInnerHeight / 2 - 48);
        this.ctx.fillText(`Score: ${score}`, this.playfieldInnerWidth / 2, this.playfieldInnerHeight / 2);
    }

    renderPanel({ level, lines, score, nextFigure }) {
        this.ctx.textAlign = "start";
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = this.mainColor;
        this.ctx.font = "16px 'Arial'";

        this.ctx.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);
        this.ctx.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
        this.ctx.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
                
        
        for (let y = 0; y < nextFigure.block.length; y++) {
            
            for (let x = 0; x < nextFigure.block[y].length; x++) {
                const block = nextFigure.block[y][x];

                if (block) {
                        this.renderBlock(
                            this.panelX + (x * this.blockWidth * this.figurePanelScale),
                            this.panelY + 100 + (y * this.blockHeight * this.figurePanelScale),
                            this.blockWidth * this.figurePanelScale,
                            this.blockHeight * this.figurePanelScale,
                            this.colors[block]);
                }
            }
        }
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    renderPlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            const row = playfield[y];

            for (let x = 0; x < playfield[y].length; x++) {
                const column = row[x];

                if (column) {
                    this.renderBlock(
                        this.playfieldX + (x * this.blockWidth),
                        this.playfieldY + (y * this.blockHeight), 
                        this.blockWidth, 
                        this.blockHeight,
                        this.colors[column]);
                }
            }  
        }

        this.ctx.strokeStyle = "#606c81";
        this.ctx.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
        this.ctx.lineWidth = this.playfieldBorderWidth;
    }

    renderBlock(x, y, blockWidth, blockHeight, color = "#333") {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = "#606c81";
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(x, y, blockWidth, blockHeight);
        this.ctx.strokeRect(x, y, blockWidth, blockHeight);
    }
}