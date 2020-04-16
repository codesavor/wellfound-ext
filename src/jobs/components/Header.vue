<template>
  <div class="header">
    <div class="columns is-vcentered mb-1">
      <div class="column">
        <b-button class="mr-1" type="is-info" icon-left="eye" @click="readAllJobs">Read All</b-button>
        <b-button icon-left="delete" type="is-danger" @click="deleteAllJobs">Delete</b-button>
      </div>
      <div class="column is-narrow columns is-vcentered">
        <span class="mr-1">Is unread?</span>
        <b-switch :value="unreadOnly" @input="toggleUnread" type="is-info"></b-switch>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState(['unreadOnly']),
  methods: mapActions(['toggleUnread', 'readAllJobs', 'deleteAllJobs'])
}
</script>

<style scoped>
.columns {
  padding: 2rem;
}
</style>
