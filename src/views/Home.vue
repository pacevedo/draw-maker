<template>
  <div class="home">
    <CompetitionForm />
  </div>
</template>

<script>
// @ is an alias to /src
import CompetitionForm from '@/views/CompetitionForm.vue'

export default {
  name: 'Home',
  components: {
    CompetitionForm
  }
}
</script>
