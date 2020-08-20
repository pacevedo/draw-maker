<template>
  <tr>
    <td v-if="isVisible(0)">
      <div class="first-round">
        <table class="draw-matchup">
          <tbody>
            <tr>
              <td :class="getClass(0,0)"><span>{{getElement(0,0)}}</span></td>
            </tr>
            <tr>
              <td :class="getClass(0,1)"><span>{{getElement(0,1)}}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </td>
    <td v-if="isVisible(1)" class="quarterfinals" rowspan="1">
      <div class="separator"></div>
      <div class="other-round"><span :class="getClass(1,0)">{{getElement(1,0)}}</span></div>
    </td>
    <td v-if="isVisible(2)" class="semifinals" rowspan="2">
      <div class="separator"></div>
      <div class="other-round"><span :class="getClass(2,0)">{{getElement(2,0)}}</span></div>
    </td>
    <td v-if="isVisible(3)" class="final" rowspan="4">
      <div class="separator"></div>
      <div class="other-round"><span>{{getElement(3,0)}}</span></div>
    </td>
  </tr>
</template>
<script>
export default {
  props: {
    participants: Object,
    total: Number,
    position: Number
  },
  methods: {
    getClass (round, index) {
      const isWinner = this.isWinner(index)
      switch (round) {
        case 0:
          return (this.total > 8 && isWinner) ? 'winner' : ''
        case 1:
          return (this.total <= 8 && this.total > 4 && isWinner) ? 'winner' : ''
        case 2:
          return (this.total <= 4 && isWinner) ? 'winner' : ''
        default:
          return ''
      }
    },
    isWinner (index) {
      const winners = this.participants.winners
      return winners[index]
    },
    isVisible (round) {
      switch (round) {
        case 0:
          return this.total > 8
        case 1:
          return this.total > 4
        case 2:
          return this.position % 2 === 0
        case 3:
          return this.position % 4 === 0
        default:
          return false
      }
    },
    getElement (round, index) {
      const items = this.participants.items
      switch (round) {
        case 0:
          return (this.total > 8) ? items[index] : ''
        case 1:
          if (this.total > 8) {
            if (this.isWinner(index)) return items[index]
          } else if (this.total > 4) {
            return items[index]
          }
          return ''
        case 2:
          if (this.total > 8) {
            return ''
          } else if (this.total > 4) {
            if (this.isWinner(index)) {
              return items[index]
            }
          } else {
            return items[index]
          }
          return ''
        case 3:
          if (this.total <= 4) {
            if (this.isWinner(index)) {
              return items[index]
            }
          }
          return ''
        default:
          return ''
      }
    }
  }
}
</script>
