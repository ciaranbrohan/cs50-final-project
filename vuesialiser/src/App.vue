<template>
  <div id="app">
    <div id="algo-grid" ref="algoGrid" style="width:400px; height:400px;" v-on:mousedown="mouseDown" v-on:mouseup="mouseup">      
      <div v-for="(row, index) in gridArray" class="rows" :key="index">
        <div v-for="(col, index) in row" class="col" :key="index">
          <Node class="start" v-if="col.x === startNodeX && col.y === startNodeY"  :x="col.x" :y="col.y" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col.x+'-'+col.y"/>
          <Node class="end" v-else-if="col.x === endNodeX && col.y === endNodeY" :x="col.x" :y="col.y" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col.x+'-'+col.y"/>
          <Node v-else :x="col.x" :y="col.y" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col.x+'-'+col.y" :wall="col.wall"/>
        </div>
      </div>
    </div>
    <button v-on:click="runAlgo">Visualise!</button>
     <button v-on:click="resetGrid">Reset</button>
  </div>
</template>

<script>
import Node from './components/Node.vue'
import grid from './lib/grid/grid'
//import astar from './lib/algorithms/astar'
import dijkstra from './lib/algorithms/dijkstra'


export default {
  name: 'App',
  components: {
    Node
  },
  data(){
    return {
      cols: 20,
      rows: 20,
      nodeHeight: 0,
      nodeWidth: 0,
      startNodeX: 0,
      startNodeY: 0,
      endNodeX: 19,
      endNodeY: 19,
      mousedownID: -1,
      changingNode: "",
      hasVisualisation: false,
      runningVisualisation: false,
      gridArray: "",
    }
  },
  methods: {
    mouseDown(event){
      if(!this.hasVisualisation) {
        if(event.target.classList.contains("start")){
          this.changingNode = "start"
        }
        if(event.target.classList.contains("end")){
          this.changingNode = "end"
        }
        if(!event.target.classList.contains("start") && !event.target.classList.contains("end")) {
          const x = event.target.getAttribute("data-x")
          const y = event.target.getAttribute("data-y")
          const newGrid = this.gridArray.slice();
          const node = newGrid[x][y];

          node.wall = !node.wall;

          newGrid[x][y] = node;

          this.gridArray = newGrid
        }

      }
    },
    whilemousedown() {
      console.log('set wall')

      //todo add functionality around the drag
    },
    mouseup(event) {
    if(!this.hasVisualisation) {
        if(this.changingNode === "start"){
          this.startNodeX=parseInt(event.target.getAttribute("data-x"))
          this.startNodeY=parseInt(event.target.getAttribute("data-y"))
        }
        if(this.changingNode === "end"){
          this.endNodeX=parseInt(event.target.getAttribute("data-x"))
          this.endNodeY=parseInt(event.target.getAttribute("data-y"))
        }
        this.changingNode = ""
      }
    },
    runAlgo(){
      let algo = dijkstra.calculate(this.gridArray, this.startNodeX, this.startNodeY, this.endNodeX, this.endNodeY)
      this.visualiseAlgo(algo.shortestPath, algo.visitedSet)
      this.hasVisualisation = true;
   },
    visualiseAlgo(shortestPath, visitedNodes){
      this.runningVisualisation = true;

      let visulatisationLength = 66 * visitedNodes.length + 66 * shortestPath.length;
      visitedNodes.forEach(function(node, index){
        setTimeout(function(){
            document.getElementById(`node-${node.x}-${node.y}`).classList.add("viewed");
        }, 66 * index);

        setTimeout(function(){
          shortestPath.forEach(function(node, index){
              setTimeout(function(){
                  document.getElementById(`node-${node.x}-${node.y}`).classList.remove("viewed");
                  document.getElementById(`node-${node.x}-${node.y}`).classList.add("path");
              }, 66 * index);
          });
        }, 66*visitedNodes.length)
    }, this);
        setTimeout(function(){
          console.log(this.runningVisualisation)
          this.runningVisualisation = false;
        }.bind(this), visulatisationLength);
    },
    resetGrid(){
      if(!this.runningVisualisation){
        this.startNodeX = 0;
        this.startNodeY = 0;
        this.endNodeX = 19;
        this.endNodeY = 19;

        this.hasVisualisation = false;

        let gridNode = document.querySelectorAll('.grid-node');
        
        gridNode.forEach(function(node){
          node.classList.remove('viewed', 'path')
        })
      }
    }
  },
  mounted: function() {
    this.nodeHeight = this.$refs.algoGrid.clientHeight/this.rows-2;
    this.nodeWidth = this.$refs.algoGrid.clientWidth/this.cols-2;
    this.gridArray = grid.init(this.cols, this.rows).render
  },
}
</script>

<style>

@keyframes visitedAnimation {
    0% {
        transform: scale(0.3);
        background-color: rgba(0, 0, 66, 0.75);
        border-radius: 100%;
    }
    
    50% {
        background-color: rgba(17, 104, 217, 0.75);
    }
    
    75% {
        transform: scale(1.2);
        background-color: rgba(0, 217, 159, 0.75);
    }
    
    100% {
        transform: scale(1);
        background-color: rgba(0, 190, 218, 0.75);
    }
}


@keyframes shortestPath {
    0% {
      transform: scale(0.6);
      background-color: rgb(255, 254, 106);
    }
  
    50% {
      transform: scale(1.2);
      background-color: rgb(255, 254, 106);
    }
  
    100% {
      transform: scale(1);
      background-color: rgb(255, 254, 106);
    }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.start {
    background-image: url('assets/chevron.svg');
    background-size: contain;
}

.end {
    background-image: url('assets/target.svg');
 }

.is-wall {
  background: #000;
}

.viewed {
    background-color: rgba(0, 190, 218, 0.75);
    animation: visitedAnimation 200ms ease-out;
}

.path {
    animation: shortestPath 200ms ease-out;
    background-color: rgb(255, 254, 106);
}
</style>
