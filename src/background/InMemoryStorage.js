export class InMemoryStorage {
  constructor() {
    this.list = []
    this.readJobIds = []
    this.deletedJobIds = []
    this.readLocalStorage()
    this.unread = true
  }

  getUnreadCount() {
    const companies = this.list.filter(c => c.jobs.some(job => !job.read))
    return companies.length > 0 ? '' + companies.length : ''
  }

  addCompanies(companies) {
    const newCompanies = []

    companies.forEach(c => {
      const c0 = this.list.find(c1 => c1.id === c.id)
      c.jobs = c.jobs.filter(job => this.deletedJobIds.indexOf(job.id))
      c.jobs.forEach(job => {
        if (c0) {
          const j = c0.jobs.find(j => j.id === job.id)
          if (j) {
            job.scrappedAt = j.scrappedAt
          }
        }

        if (this.readJobIds.indexOf(job.id) >= 0) {
          job.read = true
        }
      })

      if (!c0) {
        newCompanies.push(c)
      }
    })
    this.list = newCompanies.concat(this.list)
    return newCompanies.length
  }

  readLocalStorage() {
    const savedIds = localStorage.getItem('read_jobs')
    if (savedIds) {
      this.readJobIds = savedIds.split(',')
    }

    const deletedIds = localStorage.getItem('removed_jobs')
    if (deletedIds) {
      this.deletedJobIds = deletedIds.split(',')
    }
  }

  readJob(companyId, jobId) {
    const company = this.list.find(c => c.id === companyId)

    if (company) {
      const job = company.jobs.find(job => job.id === jobId)
      if (job) {
        job.read = true
        this.readJobIds.push(job.id)
        localStorage.setItem('read_jobs', this.readJobIds.join(','))
      }
    }
  }

  markCompanyJobsRead(companyId) {
    const company = this.list.find(c => c.id === companyId)

    if (company) {
      company.jobs
        .filter(job => !job.read)
        .forEach(job => {
          job.read = true
          this.readJobIds.push(job.id)
        })
      localStorage.setItem('read_jobs', this.readJobIds.join(','))
    }
  }

  markAllRead() {
    this.list.forEach(company => {
      company.jobs.forEach(job => {
        job.read = true
        if (this.readJobIds.indexOf(job.id) < 0) {
          this.readJobIds.push(job.id)
        }
      })
    })
  }

  removeJob(companyId, jobId) {
    const company = this.list.find(c => c.id === companyId)
    if (company) {
      const index = company.jobs.findIndex(job => job.id === jobId)
      if (index >= 0) {
        this.deletedJobIds.push(company.jobs[index].id)
        localStorage.setItem('removed_jobs', this.deletedJobIds.join(','))
        company.jobs.splice(index, 1)
      }
    }
  }

  removeReadJobs() {
    this.deletedJobIds = this.readJobIds.slice()
    localStorage.setItem('removed_jobs', this.deletedJobIds.join(','))

    this.list.forEach(company => {
      company.jobs = company.jobs.filter(job => !job.read)
    })
  }

  filterCompanies() {
    return this.list.filter(
      company =>
        company.jobs &&
        company.jobs.length > 0 &&
        company.jobs.some(job => !job.read || !this.unread)
    )
  }

  toggleUnread() {
    this.unread = !this.unread
  }

  setFilter(filter) {
    this.filter = filter
  }
}
