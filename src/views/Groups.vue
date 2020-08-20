<template>
  <div class="groups">
    <section class="group" v-for="(group, index) in groups" :key="index">
      <h1>Group {{index + 1}}</h1>
      <div class="team" v-for="(team, indexTeam) in group" :key="indexTeam">
        {{team}}
      </div>
    </section>
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
  </div>
</template>

<script>
export default {
  name: 'Groups',
  props: {
    groups: Array
  },
  methods: {
    generateDraw () {
      this.$parent.generateDraw()
    },
    goBack () {
      this.$parent.showTeamForm()
    }
  }
}
</script>
