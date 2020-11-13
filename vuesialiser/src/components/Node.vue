<template>
  <div :class="{'grid-node':true, 'is-wall': wall}" :data-x="x" :data-y="y" :style="{width: width + 'px', height : height + 'px'}" >
  </div>
</template>

<script>
export default {
  name: 'Node',
  props: {
    col: Number,
    x: Number,
    y: Number,
    height: Number,
    width: Number,
    wall: Boolean
  },


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
