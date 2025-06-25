import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useMailStore = defineStore('mail', {
  state: () => ({
    mails: {
      inbox: [],
      sent: [],
      drafts: [],
    },
    isLoading: false,
    error: null,
    filters: {
      searchQuery: '',
    },
  }),

  getters: {
    filteredMailsByType: state => type => {
      const mails = state.mails[type] || []
      let filtered = [...mails]
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase()
        filtered = filtered.filter(
          mail =>
            mail.subject?.toLowerCase().includes(query) ||
            mail.body?.toLowerCase().includes(query) ||
            mail.fromEmail?.toLowerCase().includes(query)
        )
      }
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
      return filtered
    },
    inboxCount: state => state.mails.inbox.length,
    sentCount: state => state.mails.sent.length,
    draftsCount: state => state.mails.drafts.length,
  },

  actions: {
    async fetchMails(type = 'inbox') {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await api.get(`/mails/${type}`)
        this.mails[type] = data
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
        if (this.mails[type]) {
          this.mails[type] = this.mails[type].filter(mail => mail.id !== mailId)
        }
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
        const cleanDraft = {
          fromEmail: draft.fromEmail?.trim() || undefined,
          toEmail: draft.toEmail?.trim() || undefined,
          subject: draft.subject?.trim() || undefined,
          body: draft.body?.trim() || undefined,
          type: 'draft',
          date: draft.date || new Date().toISOString(),
        }
        let response
        if (draft.id) {
          response = await api.put(`/mails/${draft.id}`, cleanDraft)
        } else {
          response = await api.post('/mails', cleanDraft)
        }
        const savedDraft = response.data
        const idx = this.mails.drafts.findIndex(d => d.id === savedDraft.id)
        if (idx !== -1) {
          this.mails.drafts[idx] = savedDraft
        } else {
          this.mails.drafts.unshift(savedDraft)
        }
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
        const mailToSend = { ...mail, type: 'sent' }
        delete mailToSend.id
        const { data: sentMail } = await api.post('/mails', mailToSend)
        this.mails.sent.unshift(sentMail)
        if (mail.id) {
          this.mails.drafts = this.mails.drafts.filter(d => d.id !== mail.id)
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
  },
})
