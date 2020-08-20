<template>
  <div>
    <v-form
      ref="competitionForm"
      v-model="valid" v-if="!submitted">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              v-model="formData.numTeams"
              :rules="rules.numTeams"
              label="Number of teams/players"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select
            v-model="formData.format"
            :items="formats"
            filled
            label="Format"
            required
          ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="formData.format==='groups'">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="formData.numGroups"
              :rules="rules.numGroups"
              label="Number of groups"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="formData.numPots"
              :rules="rules.numPots"
              label="Number of pots"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6" v-if="!sameTeamsByGroup()">
            <label class="label">Number of teams by group</label>
            <v-text-field
              v-for="n in +formData.numGroups"
              :key="n"
              v-model="formData.numTeamsByGroup[n]"
              :rules="rules.numTeamsByGroup"
              :label="'Group '+n"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="formData.format==='bracket'">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="formData.numSeeds"
              :rules="rules.numSeeds"
              label="Number of seeds"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-switch
              v-model="formData.ranked"
              class="ma-2"
              label="Ranked?"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="3" md="2">
            <v-btn
              :disabled="formData.format===''"
              color="success"
              class="mr-4"
              @click="submitCompetition"
            >
              Next
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <TeamForm :competitionData="formData" v-if="submitted"/>
  </div>
</template>
<script>
import TeamForm from '@/views/TeamForm.vue'

export default {
  name: 'CompetitionForm',
  components: {
    TeamForm
  },
  data () {
    return {
      submitted: false,
      valid: false,
      formData: {
        numTeams: null,
        format: '',
        numGroups: null,
        numTeamsByGroup: [],
        numPots: null,
        numSeeds: null,
        ranked: false
      },
      rules: {
        numTeams: [
          v => !!v || 'Required',
          v => !isNaN(v) || 'Must be a number',
          v => (v > 3) || 'Must be greater than 3'
        ],
        numGroups: [
          v => !isNaN(v) || 'Must be a number',
          v => (v > 1) || 'Must be greater than 1',
          v => (v < +this.formData.numTeams) || 'Must be less than the number of teams'
        ],
        numTeamsByGroup: [
          v => !isNaN(v) || 'Must be a number',
          v => (v > 1) || 'Must be greater than 1',
          v => (v < +this.formData.numTeams) || 'Must be less than the number of teams'
        ],
        numPots: [
          v => !isNaN(v) || 'Must be a number',
          v => (v < +this.formData.numTeams) || 'Must be less than the number of teams'
        ],
        numSeeds: [
          v => !isNaN(v) || 'Must be a number',
          v => (v < +this.formData.numTeams) || 'Must be less than the number of teams'
        ]
      },
      formats: [
        { text: 'Bracket', value: 'bracket' },
        { text: 'League Groups', value: 'groups' }
      ]
    }
  },
  methods: {
    sameTeamsByGroup () {
      const { numTeams, numGroups } = this.formData
      if (numTeams === 0 || numTeams === null || numGroups === 0 || numGroups === null) {
        return true
      }
      return numTeams % numGroups === 0
    },
    validate () {
      this.$refs.competitionForm.validate()
    },
    submitCompetition () {
      this.validate()
      if (this.valid) {
        this.submitted = true
      }
    },
    showCompetitionForm () {
      this.submitted = false
    }
  }
}
</script>
