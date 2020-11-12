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
    
 
    
    
    return{
        grid,
    }
    
    }
    
    }
    
    export default astar