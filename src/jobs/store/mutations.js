import Vue from 'vue'

export const SET_COMPANIES = (state, companies) => {
  state.companies = companies
}

export const TOGGLE_UNREAD = state => {
  state.unreadOnly = !state.unreadOnly
}

export const READ_JOB = (state, { companyId, jobId }) => {
  const company = state.companies.find(company => company.id === companyId)
  const job = company.jobs.find(job => job.id === jobId)
  Vue.set(job, 'read', true)
}
