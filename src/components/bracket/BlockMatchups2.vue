<template>
  <div class="winners">
    <div class="matchups">
      <Matchup :items="[this.items[0], this.items[1]]" :round=this.round />
      <Matchup :items="[this.items[2], this.items[3]]" :round=this.round />
    </div>
    <div class="connector">
      <div class="merger"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import Matchup from '@/components/bracket/Matchup.vue'

export default {
  name: 'BlockMatchups',
  props: {
    items: Array,
    round: Number
  },
  components: {
    Matchup
  }
}
</script>
