
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  RefreshCw,
  Eye,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  CalendarDays,
  MapPin,
} from 'lucide-react'

import api from '../services/api'

function Surveys() {
  const [surveys, setSurveys] = useState([])
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [workFilter, setWorkFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [images, setImages] = useState([])
  const [imagesLoading, setImagesLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [imageMessage, setImageMessage] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const [surveyResponse, worksiteResponse] = await Promise.all([
        api.get('/surveys'),
        api.get('/worksites'),
      ])

      setSurveys(surveyResponse.data)
      setWorksites(worksiteResponse.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load surveys. Check whether the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const preCount = surveys.filter(
    (survey) => survey.surveyType === 'PRE'
  ).length

  const postCount = surveys.filter(
    (survey) => survey.surveyType === 'POST'
  ).length

  const filteredSurveys = useMemo(() => {
    const query = search.toLowerCase()

    return surveys.filter((survey) => {
      const matchesSearch =
        survey.surveyId?.toLowerCase().includes(query) ||
        survey.workId?.toLowerCase().includes(query) ||
        survey.notes?.toLowerCase().includes(query)

      const matchesWork =
        workFilter === 'ALL' || survey.workId === workFilter

      const matchesType =
        typeFilter === 'ALL' || survey.surveyType === typeFilter

      return matchesSearch && matchesWork && matchesType
    })
  }, [surveys, search, workFilter, typeFilter])

  const openSurvey = async (survey) => {
    setSelectedSurvey(survey)
    setImages([])
    setSelectedFiles([])
    setImageError('')
    setImageMessage('')
    setImagesLoading(true)

    try {
      const response = await api.get(
        `/surveys/${survey.surveyId}/images`
      )
      setImages(response.data)
    } catch (err) {
      console.error(err)
      setImageError('Unable to load uploaded images.')
    } finally {
      setImagesLoading(false)
    }
  }

  const uploadImages = async () => {
    if (!selectedSurvey || selectedFiles.length === 0) {
      setImageError('Please select at least one image.')
      return
    }

    const formData = new FormData()

    selectedFiles.forEach((file) => {
      formData.append('files', file)
    })

    setUploading(true)
    setImageError('')
    setImageMessage('')

    try {
      await api.post(
        `/surveys/${selectedSurvey.surveyId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setImageMessage('Images uploaded successfully.')
      setSelectedFiles([])

      const response = await api.get(
        `/surveys/${selectedSurvey.surveyId}/images`
      )
      setImages(response.data)
    } catch (err) {
      console.error(err)
      setImageError(
        err.response?.data?.message ||
        err.response?.data ||
        'Image upload failed. Check file type and size.'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Surveys & Images</h1>
          <p>Manage PRE and POST site surveys and photographs.</p>
        </div>

        <span className="demo-badge">DEMO DATA</span>
      </div>

      <div className="survey-stats">
        <div className="survey-stat-card">
          <div className="survey-stat-icon total">
            <Camera size={21} />
          </div>
          <div>
            <span>Total Surveys</span>
            <h2>{loading ? '...' : surveys.length}</h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon pre">
            <ImageIcon size={21} />
          </div>
          <div>
            <span>PRE Surveys</span>
            <h2>{loading ? '...' : preCount}</h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon post">
            <ImageIcon size={21} />
          </div>
          <div>
            <span>POST Surveys</span>
            <h2>{loading ? '...' : postCount}</h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon works">
            <MapPin size={21} />
          </div>
          <div>
            <span>Registered Worksites</span>
            <h2>{loading ? '...' : worksites.length}</h2>
          </div>
        </div>
      </div>

      <div className="worksite-toolbar">
        <div className="worksite-search">
          <Search size={18} />
          <input
            placeholder="Search survey ID, worksite ID or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={workFilter}
          onChange={(e) => setWorkFilter(e.target.value)}
        >
          <option value="ALL">All Worksites</option>
          {worksites.map((worksite) => (
            <option key={worksite.workId} value={worksite.workId}>
              {worksite.workId}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Survey Types</option>
          <option value="PRE">PRE Survey</option>
          <option value="POST">POST Survey</option>
        </select>

        <button className="refresh-button" onClick={fetchData}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>Survey Records</h2>
          <p>Survey records retrieved from the backend.</p>
        </div>

        <span>{filteredSurveys.length} Surveys</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="worksite-table-container">
        <table className="worksite-table">
          <thead>
            <tr>
              <th>Survey ID</th>
              <th>Worksite ID</th>
              <th>Survey Type</th>
              <th>Survey Date</th>
              <th>Terrain File</th>
              <th>Data Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Loading survey records...
                </td>
              </tr>
            ) : filteredSurveys.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No matching survey records found.
                </td>
              </tr>
            ) : (
              filteredSurveys.map((survey) => (
                <tr key={survey.surveyId}>
                  <td className="work-id">{survey.surveyId}</td>
                  <td>{survey.workId}</td>
                  <td>
                    <span className={`survey-type ${survey.surveyType.toLowerCase()}`}>
                      {survey.surveyType}
                    </span>
                  </td>
                  <td>{survey.surveyDate}</td>
                  <td className="terrain-file" title={survey.terrainFile}>
                    {survey.terrainFile || '--'}
                  </td>
                  <td>
                    <span className="table-status">
                      {survey.dataStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => openSurvey(survey)}
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

      {selectedSurvey && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedSurvey(null)}
        >
          <div
            className="worksite-modal survey-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Survey Details</h2>
                <p>{selectedSurvey.surveyId}</p>
              </div>

              <button onClick={() => setSelectedSurvey(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="survey-detail-banner">
              <span className={`survey-type ${selectedSurvey.surveyType.toLowerCase()}`}>
                {selectedSurvey.surveyType} SURVEY
              </span>
              <span className="table-status">
                {selectedSurvey.dataStatus}
              </span>
            </div>

            <div className="details-grid">
              <div>
                <span>Worksite ID</span>
                <strong>{selectedSurvey.workId}</strong>
              </div>

              <div>
                <span>Survey Date</span>
                <strong>{selectedSurvey.surveyDate}</strong>
              </div>

              <div>
                <span>Terrain File</span>
                <strong>{selectedSurvey.terrainFile || '--'}</strong>
              </div>

              <div>
                <span>Image Folder</span>
                <strong>{selectedSurvey.imageFolder || '--'}</strong>
              </div>

              <div className="detail-full">
                <span>Notes</span>
                <strong>{selectedSurvey.notes || '--'}</strong>
              </div>
            </div>

            <div className="image-section">
              <div className="image-section-heading">
                <div>
                  <h3>Survey Photographs</h3>
                  <p>Upload and view site photographs.</p>
                </div>
                <span>{images.length} Images</span>
              </div>

              <div className="upload-area">
                <Upload size={22} />
                <strong>Select site photographs</strong>
                <p>JPG and PNG files, up to 20 MB each.</p>

                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={(e) =>
                    setSelectedFiles(Array.from(e.target.files || []))
                  }
                />

                {selectedFiles.length > 0 && (
                  <p className="selected-file-text">
                    {selectedFiles.length} file(s) selected
                  </p>
                )}

                <button
                  className="refresh-button"
                  onClick={uploadImages}
                  disabled={uploading || selectedFiles.length === 0}
                >
                  <Upload size={15} />
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
              </div>

              {imageMessage && (
                <div className="success-message">{imageMessage}</div>
              )}

              {imageError && (
                <div className="error-message">{imageError}</div>
              )}

              <div className="image-gallery">
                {imagesLoading ? (
                  <p>Loading images...</p>
                ) : images.length === 0 ? (
                  <p>No photographs uploaded for this survey yet.</p>
                ) : (
                  images.map((image) => (
                    <div className="uploaded-image" key={image.imageId}>
                      <img
                        src={`/api/surveys/images/${image.imageId}/file`}
                        alt={image.originalFilename}
                      />
                      <span>{image.originalFilename}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Surveys
