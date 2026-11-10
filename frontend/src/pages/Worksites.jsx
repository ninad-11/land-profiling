
import { useEffect, useMemo, useState } from 'react'
import { Search, MapPin, RefreshCw, Eye } from 'lucide-react'
import api from '../services/api'

function Worksites() {
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [workType, setWorkType] = useState('ALL')
  const [selectedWorksite, setSelectedWorksite] = useState(null)

  const fetchWorksites = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/worksites')
      setWorksites(response.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load worksites. Please check the backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorksites()
  }, [])

  const workTypes = useMemo(
    () => [...new Set(worksites.map((w) => w.workType).filter(Boolean))],
    [worksites]
  )

  const filteredWorksites = worksites.filter((worksite) => {
    const query = search.toLowerCase()

    const matchesSearch =
      worksite.workId?.toLowerCase().includes(query) ||
      worksite.workName?.toLowerCase().includes(query) ||
      worksite.village?.toLowerCase().includes(query) ||
      worksite.districtName?.toLowerCase().includes(query)

    const matchesType =
      workType === 'ALL' || worksite.workType === workType

    return matchesSearch && matchesType
  })

  const viewWorksite = async (workId) => {
    try {
      const response = await api.get(`/worksites/${workId}`)
      setSelectedWorksite(response.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load worksite details.')
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Worksites</h1>
          <p>Manage and monitor registered earthwork locations.</p>
        </div>

        <span className="demo-badge">DEMO DATA</span>
      </div>

      <div className="worksite-toolbar">
        <div className="worksite-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search ID, name, village or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        >
          <option value="ALL">All Work Types</option>

          {workTypes.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll('_', ' ')}
            </option>
          ))}
        </select>

        <button className="refresh-button" onClick={fetchWorksites}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>Registered Worksites</h2>
          <p>Worksite information retrieved from the backend.</p>
        </div>

        <span>{filteredWorksites.length} Worksites</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="worksite-table-container">
        <table className="worksite-table">
          <thead>
            <tr>
              <th>Worksite ID</th>
              <th>Worksite Name</th>
              <th>Work Type</th>
              <th>Village</th>
              <th>District</th>
              <th>Area (m²)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Loading worksites...
                </td>
              </tr>
            ) : filteredWorksites.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No matching worksites found.
                </td>
              </tr>
            ) : (
              filteredWorksites.map((worksite) => (
                <tr key={worksite.workId}>
                  <td className="work-id">{worksite.workId}</td>
                  <td>{worksite.workName}</td>
                  <td>{worksite.workType?.replaceAll('_', ' ')}</td>
                  <td>{worksite.village}</td>
                  <td>{worksite.districtName}</td>
                  <td>
                    {worksite.siteAreaM2 != null
                      ? Number(worksite.siteAreaM2).toFixed(2)
                      : '--'}
                  </td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => viewWorksite(worksite.workId)}
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedWorksite && (
        <div className="modal-overlay" onClick={() => setSelectedWorksite(null)}>
          <div
            className="worksite-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Worksite Details</h2>
                <p>{selectedWorksite.workId}</p>
              </div>

              <button onClick={() => setSelectedWorksite(null)}>
                ×
              </button>
            </div>

            <h3>{selectedWorksite.workName}</h3>

            <div className="details-grid">
              <div>
                <span>Work Type</span>
                <strong>{selectedWorksite.workType}</strong>
              </div>

              <div>
                <span>Village</span>
                <strong>{selectedWorksite.village}</strong>
              </div>

              <div>
                <span>Gram Panchayat</span>
                <strong>{selectedWorksite.gramPanchayat}</strong>
              </div>

              <div>
                <span>Block</span>
                <strong>{selectedWorksite.blockName}</strong>
              </div>

              <div>
                <span>District</span>
                <strong>{selectedWorksite.districtName}</strong>
              </div>

              <div>
                <span>State</span>
                <strong>{selectedWorksite.stateName}</strong>
              </div>

              <div>
                <span>Site Area</span>
                <strong>
                  {selectedWorksite.siteAreaM2 ?? '--'} m²
                </strong>
              </div>

              <div>
                <span>Reference Elevation</span>
                <strong>
                  {selectedWorksite.referenceElevationM ?? '--'} m
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Worksites
