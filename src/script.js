// helper functions

function removeFromArray(arr, elm) {
    for( var i = arr.length-1; i>=0; i--) 
    {      
        if(arr[i] == elm) {
            arr.splice(i, 1);
        }
    }
}


//raw distance
function heuristic (a,b){   
    return Math.hypot(a.x - b.x, a.y - a.y);
}

const renderGrid = document.getElementById('algo-grid');
let tableState = "";


let cols = 20;
let rows = 20;

let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let shortestPath = [];
let start, end, w, h, timer;

function Node (i,j){
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previous = undefined;
    this.neighbors = [];


    this.show = function(color){
        return "<div id='node-" + this.x + "-"+ this.y +"' class='grid-node' style='width:"+w+"px; height:"+w+"px'></div>";
    }

    this.addNeighbors = function(grid){
        let x = this.x;
        let y = this.y;

        if (x < cols - 1 ) {
            this.neighbors.push(grid[x + 1][y]);
        }
        if (x > 0) {
            this.neighbors.push(grid[x - 1][y]);
        }
        if(y < rows - 1)
        {
            this.neighbors.push(grid[x][y + 1]);
        }
        if (y > 0) {
            this.neighbors.push(grid[x][y - 1]);
        }
    }
}


function setup() {

    w = renderGrid.offsetWidth/cols - 2 ;

    h = renderGrid.offsetHeight/rows - 2 ;

    for(var i = 0; i<cols; i++)
    {
        grid[i] = new Array(rows);
    }


    //loops set array and creates nodes for each
    for(var i = 0; i<cols; i++) {
        for(var j = 0; j<rows; j++)
        {
            grid[i][j] = new Node(i,j);
        }
    }

    for(var i = 0; i<cols; i++) {
        for(var j = 0; j<rows; j++)
        {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[2][5];
    end = grid[18][12];

    openSet.push(start);

}


function initialRender (){
    for (let i = 0; i<cols; i++){
        for(var j = 0; j<rows; j++){
            tableState += grid[i][j].show();
        }
    }

    renderGrid.innerHTML = tableState

    document.getElementById('node-2-5').classList.add("start");
    document.getElementById('node-18-12').classList.add("end");
    
}

function mainLoop(){
    if(openSet.length > 0) {
        var lowestIndex = 0;
        for (let i = 0; i<openSet.length; i++) {
            if(openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        var current = openSet[lowestIndex];
        if (openSet[lowestIndex] === end) {

            // find the shortest path
            var tempNode = current;
            shortestPath.push(tempNode)

            while(tempNode.previous) {
                shortestPath.push(tempNode.previous);
                tempNode = tempNode.previous;
            }

            clearTimeout(timer); 
            console.log("Done!");
        }

        removeFromArray(openSet, current);
        // openSet.remove(current);
        closedSet.push(current);
 
        let neighbors = current.neighbors;

        for (let i = 0; i< neighbors.length; i++) {

            currentNeighbor = neighbors[i];

            if(!closedSet.includes(currentNeighbor)) {
                var tempGvalue =  current.g + 1;
                
                if(openSet.includes(currentNeighbor)) {
                    if (tempGvalue < currentNeighbor.g) {
                        currentNeighbor.g = tempGvalue;
                    }
                }
                else {
                    currentNeighbor.g = tempGvalue;
                    openSet.push(currentNeighbor);
                }

                currentNeighbor.h = heuristic(currentNeighbor, end);
                currentNeighbor.f = currentNeighbor.g + currentNeighbor.h;

                currentNeighbor.previous = current;
            }

        }

    }

    for(i=0; i<closedSet.length; i++){
        document.getElementById('node-' + closedSet[i].x + "-" + closedSet[i].y).classList.add("viewed");
    }

    // console.log(shortestPath);
    if(shortestPath.length > 0) {
        for(i=0; i<shortestPath.length; i++){
            document.getElementById('node-' + shortestPath[i].x + "-" + shortestPath[i].y).classList.remove("viewed");
            document.getElementById('node-' + shortestPath[i].x + "-" + shortestPath[i].y).classList.add("path");
        }
    }
}

window.onload = function() {
    setup();
    initialRender();
    timer = setInterval(function() { 
        mainLoop();
      }, 66);
};