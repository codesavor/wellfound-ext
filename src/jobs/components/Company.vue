<template>
  <div class="company mb-1">
    <div class="columns is-gapless is-vcentered">
      <div class="column mr-1 is-narrow">
        <img class="logo" :src="data.logo" @click="openLink(data.link)" />
      </div>
      <div class="column">
        <div class="name" @click="openLink(data.link)">{{ data.name }}</div>
        <div class="size">{{ data.size }}</div>
      </div>
      <div class="column is-narrow" v-if="!isRead">
        <b-button
          class="circle-btn"
          type="is-white"
          icon-left="eye"
          outlined
          @click="readCompany(data.id)"
        ></b-button>
      </div>
    </div>
    <div class="jobs">
      <template v-for="job in data.jobs">
        <div
          :key="job.id"
          class="job columns is-gapless is-vcentered"
          @click="openJob(job)"
          v-if="!job.read || !unreadOnly"
        >
          <span class="new-badge" v-if="!job.read">new</span>
          <div class="column">
            <span class="is-size-5 has-text-weight-semibold mr-1">{{ job.title }}</span>
            <span class="is-size-6 has-text-grey-light">{{ job.meta }}</span>
          </div>
          <div class="column is-narrow">
            <span class="posted-at mr-half" :class="{ 'thisweek': job.thisWeek }">{{ job.posted }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['unreadOnly']),
    isRead() {
      return this.data.jobs.every(job => job.read)
    }
  },
  methods: {
    ...mapActions(['readJob', 'readCompany']),
    openLink(link) {
      window.open(link, '_blank')
    },
    openJob(job) {
      window.open(job.link, '_blank')
      this.readJob({
        companyId: this.data.id,
        jobId: job.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.company {
  border: 1px solid #666;
  padding: 1rem;
  position: relative;

  &:hover {
    background: #444;
  }
}
.logo {
  width: 60px;
  margin-right: 1rem;
  cursor: pointer;
}
.name {
  line-height: 1.25;
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 4px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.size {
  font-size: 12px;
  color: #ccc;
}
.posted-at {
  line-height: 36px;
}
.jobs {
  border-radius: 5px;
  border: 1px solid #aaa;
}
.job {
  padding: 1rem;
  border-bottom: 1px solid #aaa;
  margin: 0 !important;
  cursor: pointer;
  text-transform: capitalize;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #777;
  }

  .new-badge {
    padding: 2px 4px;
    color: #fff;
    background: green;
    border-radius: 4px;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    left: 0;
    top: 0;
  }
}
.circle-btn {
  border-radius: 50%;
}
</style>
