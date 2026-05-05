import { useState, useEffect, useCallback } from 'react'
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
  const [editEntryId, setEditEntryId] = useState(null)
  const [editData, setEditData] = useState({ body: '', tags: '', backgroundColor: '#FFE082' })

  const BACKGROUND_COLORS = [
    { name: 'Yellow', value: '#FFE082' },
    { name: 'Green', value: '#C5E1A5' },
    { name: 'Blue', value: '#B3E5FC' },
    { name: 'Pink', value: '#F8BBD0' },
    { name: 'Peach', value: '#FFCCBC' },
    { name: 'Gray', value: '#ECEFF1' }
  ]

  // Memoized fetch function with optional signal parameter
  const fetchEntries = useCallback(async (signal) => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (tagFilter) params.append('tag', tagFilter)

      const url = `${API_BASE}/entries?${params.toString()}`
      const response = await fetch(url, { signal })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}))
        throw new Error(errorPayload.error || 'Failed to fetch entries')
      }

      const data = await response.json()
      setEntries(data)
      setError(null)
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, tagFilter])

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      await fetchEntries(controller.signal);
    })()

    return () => {
      controller.abort();
    }
  }, [fetchEntries]);

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

  const handleClearFilters = () => {
    setSearchQuery('')
    setTagFilter('')
  }

  const startEditing = (entry) => {
    setEditEntryId(entry.id)
    setEditData({
      body: entry.body,
      tags: entry.tags || '',
      backgroundColor: entry.backgroundColor || '#FFE082'
    })
  }

  const cancelEdit = () => {
    setEditEntryId(null)
    setEditData({ body: '', tags: '', backgroundColor: '#FFE082' })
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    if (!editData.body.trim()) return

    try {
      const response = await fetch(`${API_BASE}/entries/${editEntryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to update note')
      }

      const updatedEntry = await response.json()
      setEntries(entries.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry))
      setEditEntryId(null)
      setEditData({ body: '', tags: '', backgroundColor: '#FFE082' })
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return

    try {
      const response = await fetch(`${API_BASE}/entries/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const payload = await response.text().catch(() => null)
        throw new Error(payload || 'Failed to delete note')
      }

      setEntries(entries.filter(entry => entry.id !== id))
      if (editEntryId === id) cancelEdit()
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
          <div className="controls-actions">
            {(searchQuery || tagFilter) && (
              <button type="button" onClick={handleClearFilters} className="clear-btn">
                Clear filters
              </button>
            )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="new-note-btn"
            >
              {showForm ? 'Cancel' : '+ New Note'}
            </button>
          </div>
        </div>

        <div className="entries-header">
          <span className="note-count">{entries.length} note{entries.length !== 1 ? 's' : ''}</span>
          {(searchQuery || tagFilter) && (
            <span className="active-filters">
              {searchQuery && <>Search: "{searchQuery}"</>}
              {searchQuery && tagFilter && ' · '}
              {tagFilter && <>Tag: "{tagFilter}"</>}
            </span>
          )}
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
            <button
              onClick={() => {
                fetchEntries()
              }}
              className="retry-btn"
            >
              Retry
            </button>
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
              entries.map((entry) => {
                const isEditing = editEntryId === entry.id
                const updatedAtDifferent = entry.updatedAt && entry.updatedAt !== entry.createdAt
                return (
                  <article key={entry.id} className="entry" style={{ backgroundColor: entry.backgroundColor }}>
                    <header className="entry-header">
                      <div className="entry-meta">
                        <time className="entry-date">Created {formatDate(entry.createdAt)}</time>
                        {updatedAtDifferent && (
                          <span className="entry-updated">Updated {formatDate(entry.updatedAt)}</span>
                        )}
                      </div>
                      <div className="entry-actions">
                        <button type="button" className="small-btn" onClick={() => startEditing(entry)}>
                          Edit
                        </button>
                        <button type="button" className="small-btn delete-btn" onClick={() => handleDelete(entry.id)}>
                          Delete
                        </button>
                      </div>
                    </header>

                    {isEditing ? (
                      <form className="entry-edit-form" onSubmit={handleEditSave}>
                        <textarea
                          value={editData.body}
                          onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                          className="form-textarea"
                          rows="4"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Tags (comma-separated, optional)"
                          value={editData.tags}
                          onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                          className="form-input"
                        />
                        <div className="color-picker">
                          <label>Note Color:</label>
                          <div className="color-options">
                            {BACKGROUND_COLORS.map(color => (
                              <button
                                key={color.value}
                                type="button"
                                className={`color-option ${editData.backgroundColor === color.value ? 'active' : ''}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setEditData({ ...editData, backgroundColor: color.value })}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="edit-actions">
                          <button type="submit" className="save-btn">Save</button>
                          <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
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
                      </>
                    )}
                  </article>
                )
              })
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
