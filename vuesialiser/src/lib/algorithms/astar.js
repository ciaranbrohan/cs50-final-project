let astar = {
calculate(cols, rows, startx, starty, endx, endy){ 

    function heuristic (a,b){   
        let xChange = Math.abs(a.x - b.x);
        let yChange = Math.abs(a.y - b.y);
    
        return xChange + yChange;
    }
    function removeFromArray(arr, elm) {
        for( var i = arr.length-1; i>=0; i--) 
        {      
            if(arr[i] == elm) {
                arr.splice(i, 1);
            }
        }
    }

    let grid = new Array(cols); //moved

    let openSet = [];
    let closedSet = [];
    let visitedSet = [];
    let shortestPath = [];
    let start, end;
    let finishedAlgorithm = false;

    function Node (i,j){
        this.x = i;
        this.y = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.previous = undefined;
        this.neighbors = [];

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

    for(let i = 0; i<cols; i++)
    {
        grid[i] = new Array(rows);
    }


    //loops set array and creates nodes for each
    for(let i = 0; i<cols; i++) {
        for(let j = 0; j<rows; j++)
        {
            grid[i][j] = new Node(i,j);
        }
    }

    for(let i = 0; i<cols; i++) {
        for(let j = 0; j<rows; j++)
        {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[startx-1][starty-1];
    end = grid[endx-1][endy-1];

    openSet.push(start);

    while(openSet.length > 0 && !finishedAlgorithm) {

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
            visitedSet = closedSet;
            finishedAlgorithm = true;
            console.log("Done!");
        }

        removeFromArray(openSet, currentNode);
        // openSet.remove(current);
        closedSet.push(currentNode);
 
        let neighbors = currentNode.neighbors;

        for (let i = 0; i< neighbors.length; i++) {

            let neighbor = neighbors[i];

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


return{
    visitedSet,
    shortestPath
}

}

}

export default astar