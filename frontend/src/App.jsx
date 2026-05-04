import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = 'http://localhost:3000/api'

function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ body: '', tags: '', backgroundColor: '#FFE082' })

  const BACKGROUND_COLORS = [
    { name: 'Yellow', value: '#FFE082' },
    { name: 'Green', value: '#C5E1A5' },
    { name: 'Blue', value: '#B3E5FC' },
    { name: 'Pink', value: '#F8BBD0' },
    { name: 'Peach', value: '#FFCCBC' },
    { name: 'Gray', value: '#ECEFF1' }
  ]

  // Fetch entries on component mount and when filters change
  useEffect(() => {
    fetchEntries()
  }, [searchQuery, tagFilter])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (tagFilter) params.append('tag', tagFilter)

      const response = await fetch(`${API_BASE}/entries?${params}`)
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}))
        throw new Error(errorPayload.error || 'Failed to fetch entries')
      }
      const data = await response.json()
      setEntries(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.body.trim()) return

    try {
      const response = await fetch(`${API_BASE}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create entry')

      const newEntry = await response.json()
      setEntries([newEntry, ...entries])
      setFormData({ body: '', tags: '', backgroundColor: '#FFE082' })
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTagsArray = (tagsString) => {
    return tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : []
  }

  return (
    <div className="app">
      <header className="header">
        <h1>KK-Notes</h1>
      </header>

      <main className="main">
        <div className="controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Filter by tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="tag-input"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="new-note-btn"
          >
            {showForm ? 'Cancel' : '+ New Note'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="note-form">
            <textarea
              placeholder="Write your note here... (required)"
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              required
              className="form-textarea"
              rows="4"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated, optional)"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="form-input"
            />
            <div className="color-picker">
              <label>Note Color:</label>
              <div className="color-options">
                {BACKGROUND_COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    className={`color-option ${formData.backgroundColor === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormData({...formData, backgroundColor: color.value})}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="submit-btn">Save Note</button>
          </form>
        )}

        {error && (
          <div className="error-message">
            Error: {error}
            <button onClick={fetchEntries} className="retry-btn">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : (
          <div className="entries">
            {entries.length === 0 ? (
              <div className="empty-state">
                <h3>No notes found</h3>
                <p>{searchQuery || tagFilter ? 'Try adjusting your search or filter.' : 'Create your first note to get started!'}</p>
              </div>
            ) : (
              entries.map((entry) => (
                <article key={entry.id} className="entry" style={{ backgroundColor: entry.backgroundColor }}>
                  <header className="entry-header">
                    <time className="entry-date">{formatDate(entry.createdAt)}</time>
                  </header>
                  <div className="entry-body">{entry.body}</div>
                  {entry.tags && (
                    <div className="entry-tags">
                      {getTagsArray(entry.tags).map((tag, index) => (
                        <span
                          key={index}
                          className="tag"
                          onClick={() => setTagFilter(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
