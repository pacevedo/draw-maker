<template>
  <div>
    <div class="bracket">
      <section class="round round16" v-if="participants.length > 8">
        <BlockMatchups2 :items="getParticipants(0,0)" :round=0 />
        <BlockMatchups2 :items="getParticipants(0,1)" :round=0 />
        <BlockMatchups2 :items="getParticipants(0,2)" :round=0 />
        <BlockMatchups2 :items="getParticipants(0,3)" :round=0 />
      </section>
      <section class="round quarterfinals" v-if="participants.length > 4">
        <BlockMatchups2 :items="getParticipants(1,0)" :round=1 />
        <BlockMatchups2 :items="getParticipants(1,1)" :round=1 />
      </section>
      <section class="round semifinals">
        <BlockMatchups2 :items="getParticipants(2,0)" :round=2 />
      </section>
      <section class="round finals">
        <div class="winners">
          <div class="matchups">
            <Matchup2 :items="getEmptyParticipants(2)" :round=3 />
          </div>
        </div>
      </section>
    </div>
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
        <v-col cols="12" sm="2" md="2" v-for="n in +getNumParts()" :key="n">
          <a @click="setPart(n)">Part {{n}}</a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Matchup2 from '@/components/bracket/Matchup2.vue'
import BlockMatchups2 from '@/components/bracket/BlockMatchups2.vue'

export default {
  name: 'Bracket2',
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
    getParticipants (round, numBlock) {
      switch (round) {
        case 0:
          if (this.participants.length > 8) {
            return this.getParticipantsByBlock(numBlock)
          } else {
            return this.getEmptyParticipants(4)
          }
        case 1:
          if (this.participants.length > 4 && this.participants.length <= 8) {
            return this.getParticipantsByBlock(numBlock)
          } else if (this.participants.length > 8) {
            return this.getWinnersByBlock(numBlock)
          } else {
            return this.getEmptyParticipants(4)
          }
        case 2:
          if (this.participants.length <= 4) {
            return this.getParticipantsByBlock(numBlock)
          } else if (this.participants.length > 4 && this.participants.length <= 8) {
            return this.getWinnersByBlock(numBlock)
          } else {
            return this.getEmptyParticipants(4)
          }
        default:
          return this.getEmptyParticipants(4)
      }
    },
    getParticipantsByBlock (numBlock) {
      switch (numBlock) {
        case 0:
          return this.getParticipantsByIds([0, 1, 2, 3])
        case 1:
          return this.getParticipantsByIds([4, 5, 6, 7])
        case 2:
          return this.getParticipantsByIds([8, 9, 10, 11])
        case 3:
          return this.getParticipantsByIds([12, 13, 14, 15])
        default:
          return this.getEmptyParticipants(4)
      }
    },
    getWinnersByBlock (numBlock) {
      const previousBlocks = this.getPreviousBlocks(numBlock)
      let previousParticipants = []
      for (const numPreviousBlock of previousBlocks) {
        previousParticipants = [...previousParticipants, ...this.getParticipantsByBlock(numPreviousBlock)]
      }
      let i = 0
      const winners = this.getEmptyParticipants(previousParticipants.length / 2)
      while (i < previousParticipants.length) {
        if (previousParticipants[i] === '' && previousParticipants[i + 1] !== '') {
          winners[i / 2] = previousParticipants[i + 1]
        }
        if (previousParticipants[i] !== '' && previousParticipants[i + 1] === '') {
          winners[i / 2] = previousParticipants[i]
        }
        i += 2
      }
      return winners
    },
    getPreviousBlocks (numBlock) {
      switch (numBlock) {
        case 0:
          return [0, 1]
        case 1:
          return [2, 3]
        default:
          return [0, 1]
      }
    },
    getParticipantsByIds (ids) {
      const init = (this.part - 1) * this.sizePart
      const end = init + this.sizePart
      const currentParticipants = this.participants.slice(init, end)
      return currentParticipants.filter((item, index) => ids.includes(index))
    },
    getNumParts () {
      return Math.trunc((this.participants.length - 1) / this.sizePart) + 1
    },
    setPart (part) {
      this.part = part
    },
    getEmptyParticipants (number) {
      return new Array(number).fill('')
    },
    generateDraw () {
      this.$parent.generateDraw()
    },
    goBack () {
      this.$parent.showTeamForm()
    }
  },
  components: {
    Matchup2,
    BlockMatchups2
  }
}
</script>
