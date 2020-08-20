<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" sm="3" md="2">
          <v-btn
            color="success"
            class="mr-4"
            @click="generateDraw"
          >
            Regenerate
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="8">
        </v-col>
        <v-col cols="12" sm="3" md="2">
          <v-btn
            color="warning"
            class="mr-4"
            @click="goBack"
          >
            Back
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="getNumParts() > 1">
      <v-row>
        <v-col cols="8" sm="1" md="1" v-for="n in +getNumParts()" :key="n">
          <a @click="setPart(n)">Part {{n}}</a>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <table class="draw" :style="{width: getWidthTable()}">
            <tbody>
              <Matchup v-for="n in 8" v-bind:key="n" :participants="getParticipants(n-1)" :total="participants.length" :position="n-1" />
            </tbody>
          </table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Matchup from '@/components/bracket/Matchup.vue'

export default {
  name: 'Bracket',
  props: {
    participants: Array
  },
  data () {
    return {
      part: 1,
      sizePart: 16
    }
  },
  methods: {
    getParticipants (position) {
      let currentParticipants = this.participants
      if (this.participants.length > this.sizePart) {
        const init = (this.part - 1) * this.sizePart
        const end = init + this.sizePart
        currentParticipants = this.participants.slice(init, end)
      }
      if (currentParticipants.length > 8) {
        const element1 = (position * 2 > currentParticipants.length) ? '' : currentParticipants[position * 2]
        const element2 = (position * 2 >= currentParticipants.length) ? '' : currentParticipants[position * 2 + 1]
        const winner1 = (element1 !== '' && element2 === '')
        const winner2 = (element2 !== '' && element1 === '')
        return {
          items: [element1, element2],
          winners: [winner1, winner2]
        }
      } else if (currentParticipants.length > 4) {
        const element = (position > currentParticipants.length) ? '' : currentParticipants[position]
        const winner = (element !== '' && this.getRival(position) === '')
        return {
          items: [element],
          winners: [winner]
        }
      } else {
        const element = (position % 2 > 0) ? '' : currentParticipants[position / 2]
        const winner = (element !== '' && this.getRival(position / 2) === '')
        return {
          items: [element],
          winners: [winner]
        }
      }
    },
    getRival (position) {
      const index = (position % 2 === 0) ? position + 1 : position - 1
      return this.participants[index]
    },
    getWidthTable () {
      if (this.participants.length > 8) {
        return '630px'
      } else if (this.participants.length > 4) {
        return '480px'
      } else {
        return '320px'
      }
    },
    getNumParts () {
      return Math.trunc((this.participants.length - 1) / this.sizePart) + 1
    },
    setPart (part) {
      this.part = part
    },
    generateDraw () {
      this.$parent.generateDraw()
    },
    goBack () {
      this.$parent.showTeamForm()
    }
  },
  components: {
    Matchup
  }
}
</script>
