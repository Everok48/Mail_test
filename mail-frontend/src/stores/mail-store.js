import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useMailStore = defineStore('mail', {
  state: () => ({
    inboxMails: [],
    sentMails: [],
    drafts: [],
    currentMail: null,
    isLoading: false,
    error: null,
    filters: {
      searchQuery: '',
    },
  }),

  getters: {
    filteredMailsByType: state => type => {
      let mails = []
      switch (type) {
        case 'inbox':
          mails = state.inboxMails
          break
        case 'sent':
          mails = state.sentMails
          break
        case 'drafts':
          mails = state.drafts
          break
        default:
          return []
      }
      let filtered = [...mails]
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase()
        filtered = filtered.filter(
          mail =>
            mail.subject?.toLowerCase().includes(query) ||
            mail.body?.toLowerCase().includes(query) ||
            mail.from?.toLowerCase().includes(query)
        )
      }
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
      return filtered
    },
    inboxCount: state => state.inboxMails.length,
    sentCount: state => state.sentMails.length,
    draftsCount: state => state.drafts.length,
    getMailById:
      state =>
      (id, type = 'inbox') => {
        let list = []
        if (type === 'inbox') list = state.inboxMails
        if (type === 'sent') list = state.sentMails
        if (type === 'drafts') list = state.drafts
        return list.find(mail => mail.id === id)
      },
  },

  actions: {
    async fetchMails(type = 'inbox') {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await api.get(`/mails/${type}`)
        if (type === 'inbox') this.inboxMails = data
        if (type === 'sent') this.sentMails = data
        if (type === 'drafts') this.drafts = data
      } catch (error) {
        this.error = `Ошибка загрузки писем (${type}): ${error.message}`
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteMail(mailId, type = 'inbox') {
      this.isLoading = true
      this.error = null
      try {
        await api.delete(`/mails/${mailId}`)
        if (type === 'inbox') this.inboxMails = this.inboxMails.filter(mail => mail.id !== mailId)
        if (type === 'sent') this.sentMails = this.sentMails.filter(mail => mail.id !== mailId)
        if (type === 'drafts') this.drafts = this.drafts.filter(mail => mail.id !== mailId)
      } catch (error) {
        this.error = `Ошибка удаления письма (${type}): ${error.message}`
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async saveDraft(draft) {
      this.isLoading = true
      this.error = null
      try {
        let response
        if (draft.id) {
          response = await api.put(`/mails/${draft.id}`, draft)
        } else {
          response = await api.post('/mails', { ...draft, type: 'draft' })
        }
        const savedDraft = response.data
        const idx = this.drafts.findIndex(d => d.id === savedDraft.id)
        if (idx !== -1) this.drafts[idx] = savedDraft
        else this.drafts.unshift(savedDraft)
        return savedDraft
      } catch (error) {
        this.error = `Ошибка сохранения черновика: ${error.message}`
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async sendMail(mail) {
      this.isLoading = true
      this.error = null
      try {
        const { data: sentMail } = await api.post('/mails', { ...mail, type: 'sent' })
        this.sentMails.unshift(sentMail)
        if (mail.id) {
          this.drafts = this.drafts.filter(d => d.id !== mail.id)
          await api.delete(`/mails/${mail.id}`)
        }
        return sentMail
      } catch (error) {
        this.error = `Ошибка отправки письма: ${error.message}`
        throw error
      } finally {
        this.isLoading = false
      }
    },

    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    resetStore() {
      this.inboxMails = []
      this.sentMails = []
      this.drafts = []
      this.currentMail = null
      this.isLoading = false
      this.error = null
      this.filters = {
        searchQuery: '',
      }
    },
  },
})
