let grid = {
    init(cols, rows){ 
    
        let grid = new Array(cols); //moved
    
        function Node (i,j){
            this.x = i;
            this.y = j;
            this.f = 0;
            this.g = 0;
            this.h = 0;
            this.previous = undefined;
            this.neighbors = [];
            this.wall = false;
    
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

        let render = grid
    
    return{
        render,
    }
    
    }
    
    }
    
export default grid