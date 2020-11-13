<template>
  <div :class="{'grid-node':true, 'is-wall': wall, 'start': start, 'end': end}" :data-x="x" :data-y="y" :style="{width: width + 'px', height : height + 'px'}" >
  </div>
</template>

<script>
export default {
  name: 'Node',
  props: {
    col: Number,
    x: Number,
    y: Number,
    startNodeX: Number,
    startNodeY: Number,
    endNodeX: Number,
    endNodeY: Number,
    height: Number,
    width: Number,
    isWall: Boolean,
  },
  computed: {
    start: function() {
      if(this.x === this.startNodeX && this.y === this.startNodeY){
        return true;
      }
      return false;
    },
    end: function() {
      if(this.x === this.endNodeX && this.y === this.endNodeY){
        return true;
      }
      return false;
    },
    wall: function() {
      if(this.start){
        return false;
      }
      if(this.end){
        return false;
      }

      if(this.isWall) {
        return true;
      }
      return false
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid-node {
    border:1px solid #000;
    display: block;
    float: left;
}
</style>
