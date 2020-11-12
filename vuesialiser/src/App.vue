<template>
  <div id="app">
    <div id="algo-grid" ref="algoGrid" style="width:400px; height:400px;" v-on:mousedown="mouseDown" v-on:mouseup="mouseup">      
      <div v-for="row in rows" class="rows" :key="row">
        <div v-for="col in cols" class="col" :key="col">
          <Node class="start" v-if="col === startNodeX && row === startNodeY" :msg="col" :x="col" :y="row" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col+'-'+row"/>
          <Node class="end" v-else-if="col === endNodeX && row === endNodeY" :msg="col" :x="col" :y="row" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col+'-'+row"/>
          <Node v-else :msg="col" :x="col" :y="row" :height="nodeHeight" :width="nodeWidth" :id="'node-'+col+'-'+row"/>
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
import astar from './lib/algorithms/astar'


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
      startNodeX: 1,
      startNodeY: 1,
      endNodeX: 20,
      endNodeY: 20,
      mousedownID: -1,
      changingNode: "",
      hasVisualisation: false
    
    }
  },
  methods: {
    mouseDown(event){
      if(!this.hasVisualisation) {
       if(this.mousedownID==-1) {
          if(event.target.classList.contains("start")){
            this.changingNode = "start"
          }
          if(event.target.classList.contains("end")){
            this.changingNode = "end"
          }
          this.mousedownID = setInterval(this.whilemousedown(), 100 /*execute every 100ms*/);
       }
      }
    },
    whilemousedown() {
      console.log()
      //todo add functionality around the drag
    },
    mouseup(event) {
    if(!this.hasVisualisation) {
      if(this.mousedownID!=-1) {  //Only stop if exists
        clearInterval(this.mousedownID);
        this.mousedownID=-1;
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
    }
    },
    runAlgo(){
      let gridRender = grid.init(this.cols, this.rows);      
      let algo = astar.calculate(gridRender.render, this.startNodeX, this.startNodeY, this.endNodeX, this.endNodeY)
      this.visualiseAlgo(algo.shortestPath, algo.visitedSet)
      this.hasVisualisation = true;
   },
    visualiseAlgo(shortestPath, visitedNodes){
      visitedNodes.forEach(function(node, index){
        setTimeout(function(){
            document.getElementById(`node-${node.x+1}-${node.y+1}`).classList.add("viewed");
        }, 66 * index);


        setTimeout(function(){
          shortestPath.forEach(function(node, index){
              setTimeout(function(){
                  document.getElementById(`node-${node.x+1}-${node.y+1}`).classList.remove("viewed");
                  document.getElementById(`node-${node.x+1}-${node.y+1}`).classList.add("path");
              }, 66 * index);
          });
        }, 66*visitedNodes.length);
    });
    },
    resetGrid(){
      this.startNodeX = 1;
      this.startNodeY = 1;
      this.endNodeX = 20;
      this.endNodeY = 20;

      let gridNode = document.querySelectorAll('.grid-node');
      
      gridNode.forEach(function(node){
        node.classList.remove('viewed', 'path')
      })
    }
  },
  mounted: function() {
    this.nodeHeight = this.$refs.algoGrid.clientHeight/this.rows-2;
    this.nodeWidth = this.$refs.algoGrid.clientWidth/this.cols-2;
  }

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


.viewed {
    background-color: rgba(0, 190, 218, 0.75);
    animation: visitedAnimation 200ms ease-out;
}

.path {
    animation: shortestPath 200ms ease-out;
    background-color: rgb(255, 254, 106);
}
</style>
