<template>
  <div class="matchup">
    <div class="participants">
      <div :class="getClass(0)"><span>{{items[0]}}</span></div>
      <div :class="getClass(1)"><span>{{items[1]}}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    round: Number
  },
  methods: {
    getClass (index) {
      let returnClass = 'participant'
      if (this.round === 0 && ((this.items[1] === '' && index === 0) || (this.items[0] === '' && index === 1))) {
        returnClass += ' winner'
      }
      return returnClass
    }
  }
}
</script>
