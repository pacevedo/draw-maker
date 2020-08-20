<template>
  <div>
    <v-form
        ref="teamForm"
        v-model="valid"
        v-if="!submitted">
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <h2>{{getFormatText(competitionData.format)}}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="3" md="2" v-for="n in +competitionData.numTeams" :key="n">
            <v-text-field
              v-model="formData.teams[n-1]"
              :rules="rules.teams"
              :label="'Team/Player '+n"
              ></v-text-field>
            <div v-if="showRankedSeeds(n)">* Seed {{n}}</div>
            <div v-if="showSeeds(n)">* Seed</div>
            <div v-if="showPots(n)">Pot {{getPot(n)}}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="3" md="2">
            <v-btn
              color="success"
              class="mr-4"
              @click="submitForm"
            >
              Generate
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
    </v-form>
    <Bracket v-if="teamsDrawed.length > 0 && mode == 'bracket'" :participants="teamsDrawed" />
    <Groups v-if="teamsDrawed.length > 0 && mode == 'groups'" :groups="teamsDrawed" />
  </div>
</template>
<script>
import BracketService from '@/components/bracket/BracketService.js'
import GroupsService from '@/components/groups/GroupsService.js'
import Bracket from '@/views/Bracket.vue'
import Groups from '@/views/Groups.vue'

export default {
  name: 'TeamForm',
  components: {
    Bracket,
    Groups
  },
  props: {
    competitionData: Object
  },
  data () {
    return {
      valid: false,
      submitted: false,
      teamsDrawed: [],
      mode: '',
      formData: {
        teams: []
      },
      rules: {
        teams: [
          v => !!v || 'Required'
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.validate()
      if (this.valid) {
        this.generateDraw()
      }
    },
    generateDraw () {
      const { format, numGroups, numTeamsByGroup, numSeeds, numPots, ranked } = this.competitionData
      if (format === 'bracket') {
        this.generateBracket(numSeeds, ranked)
      } else if (format === 'groups') {
        this.generateGroups(numGroups, numTeamsByGroup, numPots)
      }
    },
    validate () {
      // TODO - Validate the number of groups >= number of teams per pot
      this.$refs.teamForm.validate()
    },
    generateBracket (numSeeds, ranked) {
      const teams = this.formData.teams
      if (numSeeds > 0) {
        if (ranked) {
          this.teamsDrawed = BracketService.seededRankedDraw(teams, numSeeds)
        } else {
          this.teamsDrawed = BracketService.seededDraw(teams, numSeeds)
        }
      } else {
        this.teamsDrawed = BracketService.pureDraw(teams)
      }
      this.submitted = true
      this.mode = 'bracket'
    },
    generateGroups (numGroups, numTeamsByGroup, numPots) {
      const teams = this.formData.teams
      if (numPots > 0) {
        this.teamsDrawed = GroupsService.pottedDraw(teams, numTeamsByGroup, numGroups, numPots)
      } else {
        this.teamsDrawed = GroupsService.pureDraw(teams, numTeamsByGroup, numGroups)
      }
      this.submitted = true
      this.mode = 'groups'
    },
    goBack () {
      this.$parent.showCompetitionForm()
    },
    getFormatText (format) {
      return format === 'bracket' ? 'Bracket' : 'League Groups'
    },
    showRankedSeeds (n) {
      const { format, ranked, numSeeds } = this.competitionData
      return format === 'bracket' && ranked && numSeeds > 0 && n <= numSeeds
    },
    showSeeds (n) {
      const { format, ranked, numSeeds } = this.competitionData
      return format === 'bracket' && !ranked && numSeeds > 0 && n <= numSeeds
    },
    showPots (n) {
      const { format, numPots, numGroups } = this.competitionData
      return format === 'groups' && numPots > 0 && n <= (numPots * numGroups)
    },
    getPot (n) {
      const numGroups = this.competitionData.numGroups
      return Math.trunc((n - 1) / numGroups) + 1
    },
    showTeamForm () {
      this.submitted = false
      this.teamsDrawed = []
      this.mode = ''
    },
    /**
     * Returns an array from 1 to number of elements
     * with the first item empty
     */
    getSelectElements (numElements) {
      const array = [...Array(+numElements + 1).keys()]
      array[0] = ''
      return array
    }
  }
}
</script>
