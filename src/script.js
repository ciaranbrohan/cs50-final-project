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
    let xChange = Math.abs(a.x - b.x);
    let yChange = Math.abs(a.y - b.y);

    return xChange + yChange;
}

const renderGrid = document.getElementById('algo-grid');
const visualiseBtn = document.getElementById('visualisation-btn');
const clearBtn = document.getElementById('clear-btn');

let tableState = "";


let cols = 20;
let rows = 20;

let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let shortestPath = [];
let start, end, w, h, timer;

// start and end col values
let startx = 3;
let starty = 5;
let endx = cols-1;
let endy = rows-1;


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

    start = grid[startx][starty];
    end = grid[endx][endy];

    openSet.push(start);

}


function initialRender (){
    for (let i = 0; i<cols; i++){
        for(var j = 0; j<rows; j++){
            tableState += grid[i][j].show();
        }
    }

    renderGrid.innerHTML = tableState + "<div id='cursor'></div>"

    document.getElementById(`node-${startx}-${starty}`).classList.add("start");
    document.getElementById(`node-${endx}-${endy}`).classList.add("end");
    
}

function a_star(){
       

    while(openSet.length > 0) {

        // Grab the lowest f(x) to process next
        var lowestIndex = 0;
        for (let i = 0; i<openSet.length; i++) {
            if(openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        var currentNode = openSet[lowestIndex];

        if (openSet[lowestIndex] === end) {

            // find the shortest path
            var tempNode = currentNode;
            
            shortestPath.push(tempNode)

            while(tempNode.previous) {
                shortestPath.push(tempNode.previous);
                tempNode = tempNode.previous;
            }
            openSet = [];
            clearTimeout(timer); 
            console.log("Done!");
        }

        removeFromArray(openSet, currentNode);
        // openSet.remove(current);
        closedSet.push(currentNode);
 
        let neighbors = currentNode.neighbors;

        for (let i = 0; i< neighbors.length; i++) {

            neighbor = neighbors[i];

            if(closedSet.includes(neighbor)) {
                // not a valid node to process, skip to next neighbor
                continue;
            }

            // g score is the shortest distance from start to current node, we need to check if
            //   the path we have arrived at this neighbor is the shortest one we have seen yet
            var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
            var gScoreIsBest = false;

            if(!openSet.includes(neighbor)) {
                // This the the first time we have arrived at this node, it must be the best
                // Also, we need to take the h (heuristic) score since we haven't done so yet
       
                gScoreIsBest = true;
                neighbor.h = heuristic(neighbor, end);
                openSet.push(neighbor);
            }
            else if(gScore < neighbor.g) {
                // We have already seen the node, but last time it had a worse g (distance from start)
                gScoreIsBest = true;
            }
       
            if(gScoreIsBest) {
            // Found an optimal (so far) path to this node.   Store info on how we got here and
            //  just how good it really is...
            neighbor.previous = currentNode;
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
            }
        }

    }
}


function visualiseAlgorithm() {
    closedSet.forEach(function(node, index){
        setTimeout(function(){
            document.getElementById('node-' + node.x + "-" + node.y).classList.add("viewed");
        }, 66 * index);
    });


    setTimeout(function(){
    shortestPath.forEach(function(node, index){
        setTimeout(function(){
            document.getElementById('node-' + node.x + "-" + node.y).classList.remove("viewed");
            document.getElementById('node-' + node.x + "-" + node.y).classList.add("path");
        }, 66 * index);
    });
    }, 66*closedSet.length);


}

window.onload = function() {
    let clickDown = false;
    let currentIcon = "";
    setup();
    initialRender();

    let start_btn = document.querySelector(`.start`);
    let end_btn = document.querySelector(`.end`);


    const cursor = document.getElementById('cursor');

    renderGrid.addEventListener("mousedown", function(e){
        if(e.target.classList.contains('start')) {
            e.target.classList.remove('start');
            currentIcon = "start";
        }

        if(e.target.classList.contains('end')) {
            e.target.classList.remove('end');
            currentIcon = "end";
        }

        clickDown = true;
    }); 
    
    
    renderGrid.addEventListener("mouseup", function(e){
        clickDown = false;
        currentIcon = "";
        cursor.classList.remove("cursor--start", "cursor--end", "cursor--display");

    }); 


    const onMouseMove = (e) =>{
        if(clickDown) 
        {
            if (currentIcon === "start") {
                cursor.classList.add("cursor--start");
            }
            if (currentIcon === "end") {
                cursor.classList.add("cursor--end");
            }
            cursor.classList.add("cursor--display");
            cursor.style.left = e.pageX + 'px';
            cursor.style.top = e.pageY + 'px';
        }
    }
    
    document.addEventListener('mousemove', onMouseMove);
    

};




visualiseBtn.onclick = function(){
    console.log("test");
};




visualiseBtn.onclick = function(){
    var t0 = performance.now()
    a_star();

    var t1 = performance.now()
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    visualiseAlgorithm();
    // if(!timer){
    //     timer = setInterval(function() { 
    //         a_star();
    //     }, 66);
    // }
};


clearBtn.onclick = function(){
    // let gridNodes = document.querySelectorAll("#algo-grid .grid-node");

    // gridNodes.forEach(function(node){
    //     node.classList.remove("viewed");

    // })

    location.reload();
};




