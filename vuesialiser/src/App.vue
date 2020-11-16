<template>
  <div id="app" ref="app">
    <header class="navbar navbar--green">
      <div class="container-fluid">
        <div class="navbar__header">
          <a href="#" class="navbar__brand">Pathfinderr</a>
        </div>
        <ul class="nav navbar__nav navbar__dropdown-menu"> 
          <li>
            <a href="#" id="pickAlgorithm" @click="toggleDropdown($event)"  class="nav-link">{{selectedAlgo}}</a>
            <ul :class="{ 'open' : dropDownActive === 'pickAlgorithm' }">
              <li><a href="#" @click="selectAlgo('A*')" >A*</a></li>
              <li><a href="#" @click="selectAlgo('Dijkstra')" >Dijkstra</a></li>
            </ul>
          
          </li>
          <li><a href="#" @click="clearVis" class="nav-link">Clear path</a></li>
          <li><a href="#" @click="resetGrid" class="nav-link">Reset</a></li>
          <li><input @change="addWalls($event)" type="range" id="walls" v-model="range"
         min="0" max="40" value="0"  step="10"></li>
          <li><a href="#" @click="runAlgo" class="nav-link btn btn--dark">Visualise!</a></li>
        </ul>
      </div>

    </header>



    <table id="algo-grid" ref="algoGrid" v-on:mousedown="mouseDown" cellspacing="0">      
      <div v-for="(row, index) in gridArray" class="cols" :key="index">
        <div v-for="(col, index) in row" class="col" :key="index">
          <Node :x="col.x" :y="col.y" :startNodeX="startNodeX" :startNodeY="startNodeY" :endNodeX="endNodeX" :endNodeY="endNodeY" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col.x+'-'+col.y" :isWall="col.wall"/>
        </div>
      </div>
    </table>

    <div class="modal" v-if="modalShow"> 
      <div class="modal__body">
        <div class="modal__content">
          <h2>{{modalHeader}}</h2>
          <p v-html="modalParagraph"></p>
        </div>
        <a v-if="noValidPath" href="#" @click="resetGrid" id="restBtn"  class="btn btn--dark btn--reset">Reset Grid</a>
        <a v-if="noAlgorithm" href="#" @click="dismissModal" id="restBtn"  class="btn btn--dark btn--reset">Dismiss</a>
        <a v-if="initalModal" href="#" @click="skipBtn" id="skipBtn" class="btn btn--dark left">Skip</a>
        <a v-if="initalModal" href="#" @click="nextBtn" id="nextBtn"  class="btn btn--dark right">Next</a>
      </div>
    </div>
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
      rows: 25,
      cols: 25,
      nodeHeight: 25,
      nodeWidth: 25,
      startNodeX: 0,
      startNodeY: 0,
      endNodeX: 0,
      endNodeY: 0,
      mousedownID: -1,
      changingNode: "",
      hasVisualisation: false,
      runningVisualisation: false,
      gridArray: "",
      selectedAlgo: "Pick Algorithm",
      algo: 0,
      range:0,
      modalCount:0,
      dropDownActive:"",
      modalHeader:"Welcome to Pathfinderr",
      modalParagraph: "This short tutorial will walk you through all of the features of this application.",
      modalShow: true,
      noValidPath: false,
      initalModal: true
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
        if(this.changingNode === "start"){
          this.startNodeX=parseInt(event.target.getAttribute("data-x"))
          this.startNodeY=parseInt(event.target.getAttribute("data-y"))
          this.changingNode = ""
          return;
        }
        if(this.changingNode === "end"){
          this.endNodeX=parseInt(event.target.getAttribute("data-x"))
          this.endNodeY=parseInt(event.target.getAttribute("data-y"))
          this.changingNode = ""
          return;
        }
        this.changingNode = ""

        if(event.target.classList.contains("start")){
          this.changingNode = "start"
          return;
        }
        if(event.target.classList.contains("end")){
          this.changingNode = "end"
          return;
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
      this.dropDownActive = "";
    },
    addWalls(event){
      if(!this.runningVisualisation){
        let chanceOfWall = event.target.value/100;
        const newGrid = this.gridArray.slice();
        this.hasVisualisation = false;
        for(var i = 0; i < this.gridArray.length; i++) {
          var col = this.gridArray[i];
          for(var j = 0; j < col.length; j++) {

            document.getElementById(`node-${i}-${j}`).classList.remove('viewed', 'path')

            let node = newGrid[i][j];
            node.wall = false;
            if(Math.random() < chanceOfWall) {
              node.wall = true
            }
            newGrid[i][j] = node;

            this.gridArray = newGrid
          }
        }
      }
    },
    runAlgo(){
      if(this.selectedAlgo != "Pick Algorithm") {
        
        let algo = this.algo.calculate(this.gridArray, this.startNodeX, this.startNodeY, this.endNodeX, this.endNodeY);
        if(algo.shortestPath.length > 0 || algo.visitedSet.length  > 0) {
          this.visualiseAlgo(algo.shortestPath, algo.visitedSet);
          this.hasVisualisation = true;
        }
        else {
          this.modalShow = true
          this.noValidPath = true;
          this.noAlgorithm = false;
          this.initalModal = false;
          this.modalHeader = "No valid path available try again";
          this.modalParagraph = "";
        }
      }
      else {
        this.modalShow = true;
        this.initalModal = false;
        this.noAlgorithm = true;
        this.modalHeader = "No selected algorithm";
        this.modalParagraph = "Please select an algorithm to run the visualisation";
      }
   },
    visualiseAlgo(shortestPath, visitedNodes){

        let gridNode = document.querySelectorAll('.grid-node');
        
        gridNode.forEach(function(node){
          node.classList.remove('viewed', 'path')
        })

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
      this.modalShow = false;
      if(!this.runningVisualisation){
        this.range = 0;
        this.startNodeX = Math.floor((this.rows/2)-1);
        this.startNodeY = Math.floor(this.cols/6);

        this.endNodeX = Math.floor((this.rows/2)-1);
        this.endNodeY = Math.floor((this.cols/6)*5);

        this.hasVisualisation = false;
        this.gridArray = grid.init(this.rows, this.cols).render;

        let gridNode = document.querySelectorAll('.grid-node');
        
        gridNode.forEach(function(node){
          node.classList.remove('viewed', 'path')
        })
      }
    },
    nextBtn() {

      if(this.modalCount == 0)
      {
        this.modalHeader = "How to use";
        this.modalParagraph = "You can toggle walls by clicking individual nodes, using the slider in the menu increases the random walls generated. You can move the start and end nodes by clicking them and clicking the new spot you want them to be in. Select your visualisation and visualise, the program will find what it thinks is the most efficiant path.";
      }

      if(this.modalCount == 1)
      {
        this.modalHeader = "The Algorithms";
        this.modalParagraph = "Dijkstra's Algorithm: the father of pathfinding algorithms; guarantees the shortest path. <br></br> A* Search (weighted): arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstras Algorithm";
      }


      if(this.modalCount == 2)
      {
        this.modalHeader = "Enjoy";
        this.modalParagraph = "Have fun with the visualisations, you can view the source code on my <a href='https://github.com/ciaranbrohan'>github</a>. <br/><br/> I'll be working on bugs and adding more features as i go.";
      }

      if(this.modalCount == 3)
      {
        this.modalShow = false;
       
      }



      this.modalCount++;
      
    },
    skipBtn() {
      this.modalShow = false;
    },
    dismissModal(){
      this.modalShow = false;
    }
    
  
  },
  mounted: function() {


    if(window.innerWidth < 767 ) {
      this.cols = 14;
      this.rows = 14;
    }


    this.startNodeX = Math.floor((this.rows/2)-1);
    this.startNodeY = Math.floor(this.cols/6);

    this.endNodeX = Math.floor((this.rows/2)-1);
    this.endNodeY = Math.floor((this.cols/6)*5);

    this.gridArray = grid.init(this.rows, this.cols).render
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

/*-- navbar --*/
.navbar {
    font-size: 16px;
    min-height: 55px;
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
  box-shadow: 5px 5px 5px rgba(0, 0, 255, .2);;
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

#nextBtn {
  position: absolute;
  right: 2%;
  bottom: 4%;
}

#skipBtn {
  position: absolute;
  left: 2%;
  bottom: 4%;
}

.btn--reset {
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
}

/*-- --*/
.modal {
position:absolute; 
top:0; 
left:0; 
bottom:0; 
right:0; 
background: rgba(0, 0, 0, 0.6);
}

.modal__body {
  position: absolute;
  z-index: 3;
  background-color: rgba(255, 255, 255, 1);
  width: 50%;
  height: 50%;
  border: 2px solid #34495e;
  border-radius: 4px;
  text-align: center;
  float: right;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}

.modal__body .modal__content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: center; 
  width:100%;
}

#walls {
  position: relative;
  top: 6px;
}


a {
  text-decoration: none;
}

#algo-grid {
  width: 625px;
  margin: 20px auto;
}

#algo-grid td{
  border-spacing: 0;
  border-collapse: collapse;
  padding:0;
}


/*-- buttons --*/

.btn--default {
  color: #ffffff;
  background-color: #bdc3c7;
}

.btn--dark {
  color: #ffffff;
  background-color: #05386B;
}

.btn {
  border: none;
  border-top-color: currentcolor;
  border-right-color: currentcolor;
  border-bottom-color: currentcolor;
  border-left-color: currentcolor;
  font-size: 15px;
  font-weight: normal;
  line-height: 15px;
  border-radius: 4px;
  padding: 10px 15px;
  -webkit-font-smoothing: subpixel-antialiased;
  -webkit-transition: border 0.25s linear, color 0.25s linear, background-color 0.25s linear;
  transition: border 0.25s linear, color 0.25s linear, background-color 0.25s linear;
}


@media only screen and (max-width: 767px) {
  .modal__body {
    width: 80%;
  }

  #algo-grid {
    width: 350px;
  }

  .navbar__brand {
    float: none;
  }

  .navbar__nav li {
    display: block;
  }

}
</style>
