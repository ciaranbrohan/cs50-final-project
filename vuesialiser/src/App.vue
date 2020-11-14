<template>
  <div id="app">


    <header class="navbar navbar--green">
      <div class="container-fluid">
        <div class="navbar__header">
          <a href="#" class="navbar__brand">Pathfinderr</a>
        </div>
        <ul class="nav navbar__nav navbar__dropdown-menu"> 
          <li>
            <a href="#" id="pickAlgorithm" @click="toggleDropdown($event)"  class="nav-link">Pick Algorithm</a>
            <ul :class="{ 'open' : dropDownActive === 'pickAlgorithm' }">
              <li><a href="#" @click="selectAlgo('A*')" >A*</a></li>
              <li><a href="#" @click="selectAlgo('Dijkstra')" >Dijkstra</a></li>
            </ul>
          
          </li>
          <li><a href="#" @click="clearVis" class="nav-link">Clear path</a></li>
          <li><a href="#" @click="resetGrid" class="nav-link">Reset</a></li>
          <li><a href="#" @click="runAlgo" class="nav-link">Visualise!</a></li>
        </ul>
      </div>

    </header>



    <div id="algo-grid" ref="algoGrid" style="width:400px; height:400px;" v-on:mousedown="mouseDown" v-on:mouseup="mouseup">      
      <div v-for="(row, index) in gridArray" class="rows" :key="index">
        <div v-for="(col, index) in row" class="col" :key="index">
          <Node :x="col.x" :y="col.y" :startNodeX="startNodeX" :startNodeY="startNodeY" :endNodeX="endNodeX" :endNodeY="endNodeY" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col.x+'-'+col.y" :isWall="col.wall"/>
        </div>
      </div>
    </div>
    <!-- <select @change="selectAlgo($event)" class="form-control" v-model="selectedAlgo">
      <option disabled value="">Please select one</option>
      <option value="A*">A*</option>
      <option value="Dijkstra">Dijkstra</option>
    </select>   -->
      <input @change="addWalls($event)" type="range" id="cowbell" name="cowbell" v-model="range"
         min="0" max="40" value="0"  step="10"> 
  </div>
</template>

<script>
import Node from './components/Node.vue'
import grid from './lib/grid/grid'
import astar from './lib/algorithms/astar'
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
      selectedAlgo: "",
      algo: 0,
      range:0,
      dropDownActive:""
    }
  },
  methods: {
    toggleDropdown(event){
      
      if (this.dropDownActive != event.target.id)
      {
      this.dropDownActive = event.target.id;
      return
      }

      this.dropDownActive = "";
    },
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
    selectAlgo(selected){
      this.selectedAlgo = selected;
      let algo;
      if(selected === "A*") {
        algo = astar
      }
      if(selected === "Dijkstra") {
        algo = dijkstra
      }
      this.algo = algo;
      console.log(this.algo)
    },
    addWalls(event){
      let chanceOfWall = event.target.value/100;
      const newGrid = this.gridArray.slice();
      
      for(var i = 0; i < this.gridArray.length; i++) {
        var col = this.gridArray[i];
        for(var j = 0; j < col.length; j++) {
        
          let node = newGrid[i][j];
          node.wall = false;
          if(Math.random() < chanceOfWall) {
            node.wall = true
          }
          newGrid[i][j] = node;

          this.gridArray = newGrid
        }
      }
    },
    runAlgo(){
      if(this.selectedAlgo != "") {
        let algo = this.algo.calculate(this.gridArray, this.startNodeX, this.startNodeY, this.endNodeX, this.endNodeY);
        if(algo.shortestPath.length > 0 || algo.visitedSet.length  > 0) {
          this.visualiseAlgo(algo.shortestPath, algo.visitedSet);
          this.hasVisualisation = true;
        }
      }
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
          this.runningVisualisation = false;
        }.bind(this), visulatisationLength);
    },
    clearVis(){
      if(!this.runningVisualisation){
      let gridNode = document.querySelectorAll('.grid-node');
        
        gridNode.forEach(function(node){
          node.classList.remove('viewed', 'path')
        })
        this.hasVisualisation = false;
      }
    },
    resetGrid(){
      if(!this.runningVisualisation){
        this.range = 0;
        this.startNodeX = 0;
        this.startNodeY = 0;
        this.endNodeX = 19;
        this.endNodeY = 19;

        this.hasVisualisation = false;
        this.gridArray = grid.init(this.cols, this.rows).render;

        let gridNode = document.querySelectorAll('.grid-node');
        
        gridNode.forEach(function(node){
          node.classList.remove('viewed', 'path')
        })
      }
    }
  },
  mounted: function() {
    this.nodeHeight = this.$refs.algoGrid.clientHeight/this.rows;
    this.nodeWidth = this.$refs.algoGrid.clientWidth/this.cols;
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
    animation: visitedAnimation 100ms ease-out;
    background-color: rgba(0, 190, 218, 0.75);
}

.path {
    animation: shortestPath 100ms ease-out;
    background-color: rgb(255, 254, 106);
}

/*-- CSS reset --*/
html {
  box-sizing: border-box;
  font-size: 16px;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol, ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

/*-- container, grid, utlities --*/

.container-fluid {
padding-right: 15px;
padding-left: 15px;
margin-right: auto;
margin-left: auto;
}

/*-- container, grid, utlities --*/
.navbar {
    font-size: 16px;
    min-height: 53px;
    margin-bottom: 30px;
}

.navbar__header {
  margin: 0 -15px;
}

.navbar__brand {
  float: left;
  font-size: 20px;
  line-height: 55px;
  height: 55px;
  font-weight: 700;
  padding: 0 21px;
}

.navbar--green {
    background-color: #41B3A3;
}

.navbar--green .navbar__brand {
    color: #fff;
}

.navbar__nav li {
  display: inline-block;
  list-style: none;
  height: 55px; 
  line-height: 55px; /* should be the same as height */
  padding: 0 15px; /* "0" sets top and bottom padding to none */
}


.navbar__dropdown-menu {
  display: relative;
}

.navbar__dropdown-menu ul {
  display: none;
  position: absolute;
  z-index: 1000;
  background-color: #41B3A3;
  min-width: 220px;
  border: none;
  margin-top: 0px;
  padding: 0;
  font-size: 14px;
  border-radius: 4px;
  box-shadow: none;
}

.navbar__dropdown-menu ul.open {
  display: block;
}

.navbar__dropdown-menu ul li{
  display: block;
}


.navbar--green a {
  color: #fff;
}


a {
  text-decoration: none;
}


</style>
