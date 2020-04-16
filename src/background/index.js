import _ from 'lodash'
import { injectContentScriptFile, injectExtensionId } from './inject'
import { InMemoryStorage } from './InMemoryStorage'
import { _setBadgeText } from './utils'

const data = new InMemoryStorage()
const setBadgeText = _.debounce(_setBadgeText, 300)
const injectScrapper = _.debounce(tabId => {
  chrome.tabs.get(tabId, () => {
    if (!chrome.runtime.lastError) {
      console.log('inject script')
      injectExtensionId(tabId)
      injectContentScriptFile(tabId, 'scrapper')
    }
  })
}, 1000)

function init() {
  console.log('init')
  chrome.tabs.onUpdated.addListener(onUpdatedListener)
  chrome.runtime.onMessageExternal.addListener(onMessageExternalListener)
  chrome.runtime.onMessage.addListener(onMessageListener)
}

function onUpdatedListener(tabId, changeInfo, tab) {
  if (tab.url.startsWith('https://angel.co/jobs')) {
    if (changeInfo.status === 'complete') {
      injectScrapper(tabId)
    }
  }
}

function onMessageExternalListener(request) {
  if (request.action === 'companies') {
    data.addCompanies(request.data)
    setBadgeText(data.getUnreadCount())
    sendCompanies()
  }
}

function onMessageListener(request, sender, sendResponse) {
  switch (request.action) {
    case 'REQ_COMPANIES':
      sendCompanies()
      break

    case 'REQ_UNREAD_ONLY':
      sendResponse(data.unread)
      break

    case 'REQ_TOGGLE_UNREAD':
      data.toggleUnread()
      sendCompanies()
      break

    case 'REQ_READ_JOB':
      data.readJob(request.companyId, request.jobId)
      setBadgeText(data.getUnreadCount())
      sendCompanies()
      break

    case 'REQ_READ_COMPANY':
      data.markCompanyJobsRead(request.companyId)
      setBadgeText(data.getUnreadCount())
      sendCompanies()
      break

    case 'REQ_READ_ALL':
      data.markAllRead()
      setBadgeText(data.getUnreadCount())
      sendCompanies()
      break

    case 'REQ_DELETE_ALL':
      data.removeReadJobs()
      sendCompanies()
      break
  }
}

function sendCompanies() {
  chrome.runtime.sendMessage({
    action: 'COMPANIES',
    companies: data.filterCompanies()
  })
}

init()
