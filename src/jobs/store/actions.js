export const getUnreadOnly = ({ commit, state }) => {
  chrome.runtime.sendMessage(
    {
      action: 'REQ_UNREAD_ONLY'
    },
    unread => {
      if (unread !== state.unreadOnly) {
        commit('TOGGLE_UNREAD')
      }
    }
  )
}

export const requestCompanies = () => {
  chrome.runtime.sendMessage({
    action: 'REQ_COMPANIES'
  })
}

export const toggleUnread = ({ commit }) => {
  chrome.runtime.sendMessage({
    action: 'REQ_TOGGLE_UNREAD'
  })
  commit('TOGGLE_UNREAD')
}

export const readJob = (_, data) => {
  chrome.runtime.sendMessage({
    action: 'REQ_READ_JOB',
    ...data
  })
}

export const readCompany = (_, companyId) => {
  chrome.runtime.sendMessage({
    action: 'REQ_READ_COMPANY',
    companyId
  })
}

export const readAllJobs = () => {
  chrome.runtime.sendMessage({
    action: 'REQ_READ_ALL'
  })
}

export const deleteAllJobs = () => {
  chrome.runtime.sendMessage({
    action: 'REQ_DELETE_ALL'
  })
}
