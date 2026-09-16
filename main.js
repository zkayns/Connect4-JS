class ConnectFourGame {
    constructor() {};
    create() {
        this.gameCanvas=document.createElement("canvas");
        this.gameCanvas.width=560;
        this.gameCanvas.height=508;
        this.gameCanvas.style.border="1px solid black";
        this.gameContext=this.gameCanvas.getContext("2d");
        document.body.appendChild(this.gameCanvas);
        this.gameCanvas.addEventListener("mousedown", (e)=>this.mouseDown(e));
        this.created=true;
        this.start();
    };
    start() {
        this.board=[
            [".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", "."]
        ];
        this.turn=false;
        this.gameOver=false;
        this.draw();
    };
    draw() {
        this.gameContext.fillStyle="#00f";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        for (let i=0; i<42; i++) {
            let x=i%7;
            let y=Math.floor(i/7);
            if (this.board[y][x]=="X") this.gameContext.fillStyle="#f00";
            else if (this.board[y][x]=="O") this.gameContext.fillStyle="#ff0";
            else this.gameContext.fillStyle="#fff";
            this.gameContext.beginPath();
            this.gameContext.arc(x*80+40, y*80+68, 30, 0, 360);
            this.gameContext.closePath();
            this.gameContext.fill();
        };
        this.gameContext.fillStyle="#fff";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, 28);
        this.gameContext.fillStyle="#000";
        this.gameContext.font="16px monospace";
        this.gameContext.textBaseline="top";
        this.gameContext.textAlign="left";
        this.gameContext.fillText(`${this.turn?"YELLOW":"RED"}'S TURN`, 8, 8);
        this.gameContext.textAlign="right";
        this.gameContext.fillText("CONNECT 4", this.gameCanvas.width-8, 8);
        if (this.gameOver) {
            this.gameContext.fillStyle=`#f${this.turn?"f":"0"}0c`;
            this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
            this.gameContext.fillStyle="#000";
            this.gameContext.font="32px monospace";
            this.gameContext.textBaseline="middle";
            this.gameContext.textAlign="center";
            this.gameContext.fillText(`${this.turn?"YELLOW":"RED"} WINS!`, this.gameCanvas.width/2, this.gameCanvas.height/2);
        };
    };
    mouseDown(e) {
        if (this.gameOver) {
            this.start();
            return;
        };
        let x=Math.floor(e.layerX/80);
        if (!this.columnIsFull(x)) {
            this.board[this.dropY(x)][x]=this.turn?"O":"X";
            if (this.checkForConnection()) return;
            this.turn=!this.turn;
            this.draw();
        };
    };
    checkForConnection() {
        if (this.board.some(i=>i.join("").includes("XXXX")||i.join("").includes("OOOO"))) return this.connection();
        let diagMaps=[
            structuredClone(this.board).map((i, idx)=>{
                let j=0;
                while ((j++)<idx) i=[...i.pop(), ...i];
                return i;
            }),
            structuredClone(this.board).map((i, idx)=>{
                let j=0;
                while ((j++)<idx) i=[...i.slice(1, 6), i[0]];
                return i;
            })
        ];
        for (let i=0; i<7; i++) {
            let diagChecks=diagMaps.map(j=>j.map(k=>k[i]).join(""));
            if (diagChecks.some(j=>j.includes("XXXX")||j.includes("OOOO"))) return this.connection();
            let vertMap=this.board.map(j=>j[i]).join("");
            if (vertMap.includes("XXXX")||vertMap.includes("OOOO")) return this.connection();
        };
        return false;
    };
    connection(p) {
        this.gameOver=true;
        this.draw();
        return true;
    };
    columnIsFull(x) {
        return !this.board.some(i=>i[x]==".");
    };
    dropY(x) {
        return this.board.map(i=>i[x]).join("").lastIndexOf(".");
    };
};
new ConnectFourGame().create();
