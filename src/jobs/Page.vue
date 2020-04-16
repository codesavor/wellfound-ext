<template>
  <div class="page">
    <Header></Header>
    <div class="companies">
      <Company :key="company.id" :data="company" v-for="company in companies"></Company>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import Header from './components/Header.vue'
import Company from './components/Company.vue'

export default {
  components: {
    Header,
    Company
  },
  computed: mapState(['companies']),
  methods: {
    ...mapActions(['requestCompanies', 'getUnreadOnly']),
    ...mapMutations({
      setCompanies: 'SET_COMPANIES'
    })
  },
  created() {
    this.getUnreadOnly()
    this.requestCompanies()
    chrome.runtime.onMessage.addListener(request => {
      if (request.action === 'COMPANIES') {
        this.setCompanies(request.companies)
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card {
  color: white;
  background-color: #333;
}
.companies {
  flex: 1;
  padding: 0 2rem 2rem;
  overflow-y: auto;
}
</style>