export default class Game {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.reset();
    }
    // Configure game 
    static scoreOfLines = {
        1: 40,
        2: 80,
        3: 160,
        4: 1000
    };


    get level() {
        return Math.floor(this.lines * 0.1);
    }

    // Methods game 
    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.playfield = this.createPlayfield();
        this.activeFigure = this.createFigure();
        this.nextFigure = this.createFigure();
    }
    getState() {
        const playfield = this.createPlayfield();
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                if (this.playfield[y][x])
                    playfield[y][x] = this.playfield[y][x];
            }
        }

        this.lockFigure(playfield);
        return {
            nextFigure: this.nextFigure,
            level: this.level,
            score: this.score,
            lines: this.lines,
            playfield,
            isGameOver: this.topOut,
        }
    }

    createPlayfield() {
        const playfield = [];

        for (let y = 0; y < 20; y++) {
            playfield[y] = [];

            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
            }
        }

        return playfield;
    }

    createFigure() {
        const random = Math.floor(Math.random() * 7);
        const nameFigure = "JIOLZTS"[random];
        const newFigure = {
            x: 0,
            y: 0
        };

        const figures = {
            "I": [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                
            ],
            "J":[
                [0,0,0],
                [1,1,1],
                [0,0,1]
            ],
            "O": [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
            ],
            "L":[
                [0,0,0],
                [1,1,1],
                [1,0,0]
            ],
            "S":[
                [0,0,0],
                [0,1,1],
                [1,1,0]
            ],
            "T":[
                [0,0,0],
                [1,1,1],
                [0,1,0]
            ],
            "Z":[
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ],
        }


        if (figures[nameFigure]) {
            newFigure.block = figures[nameFigure];
            newFigure.x = Math.floor((10 - newFigure.block[0].length) / 2);
            newFigure.y = -1;
        }
        else throw new Error("Undefined figure");
        return newFigure;
    }

    updateFigure() {
        this.activeFigure = this.nextFigure;
        this.nextFigure = this.createFigure();
    }

    moveFigureRight() {
        this.activeFigure.x += 1;
        if (this.hasCollision()) {
            this.activeFigure.x -= 1;
            
        }
        
    }

    moveFigureLeft() {
        this.activeFigure.x -= 1;
        if (this.hasCollision()) {
            this.activeFigure.x += 1;
            
        } 
    }

    moveFigureDown() {
        if (this.topOut) return;

        this.activeFigure.y += 1;
        if (this.hasCollision()) {
            this.activeFigure.y -= 1;
            this.lockFigure(this.playfield);
            this.updateFigure();
            const countLines = this.removeLine();
            this.updateScore(countLines.length);
            
        }  
        
        if (this.hasCollision()) this.topOut = true;
    }

    // Метод делает проверку на косание активной фигуру с границами
    hasCollision() { 
        const { block, x: figureX, y: figureY } = this.activeFigure;

        for (let y = 0; y < block.length; y++) {
            for (let x = 0; x < block[y].length; x++) {
                if (
                    block[y][x] && ((this.playfield[figureY + y] === undefined ||
                    this.playfield[figureY + y][figureX + x] === undefined) ||
                    this.playfield[figureY + y][figureX + x])
                    ) 
                    return true;
            }
        }

        return false;
    }

    // Метод поворачивает фигуру на 90deg 
    rotateFigure() {
        const { block, x: figureX, y: figureY } = this.activeFigure;
        
        const length = block.length;
        const temp = [];

        for (let i = 0; i < length; i++) temp.push( new Array(length).fill(0) );

        for (let x = 0; x < length; x++) {
            for (let y = 0; y < length; y++) {
                temp[x][y] = block[length - 1 - y][x];
            }
        }
        
        this.activeFigure.block = temp;
        if (this.hasCollision()) {
            this.activeFigure.block = block;
        }
    }

    // Метод переносит активную фигуру на игровое поле 
    lockFigure(playfield) {
        const { block, x: figureX, y: figureY } = this.activeFigure;

        for (let y = 0; y < block.length; y++) {
            for (let x = 0; x < block[y].length; x++) {
                if (block[y][x])
                    playfield[figureY + y][figureX + x] = block[y][x]; 
            }
        }
    }

    removeLine() {
        const lines =  [];

        for (let y = this.rows-1; y >= 0; y--) {
            let countColumns = 0;

            for (let x = 0; this.columns > x; x++) {
                if (this.playfield[y][x])
                    countColumns += 1;
            }

            if (!countColumns) break;     
            if (countColumns >= this.columns) lines.unshift(y); 
        }


        for (let line of lines) {
            this.playfield.splice(line, 1);
            this.playfield.unshift(new Array(10).fill(0));
        }
        return lines;
    }

    updateScore(countLines) {
        if (countLines > 0) {
            this.score += Game.scoreOfLines[countLines] * (this.level + 1);
            this.lines += countLines;
        }

        
    }
} 