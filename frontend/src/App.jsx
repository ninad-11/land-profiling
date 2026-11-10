
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import Dashboard from './pages/Dashboard'
import Worksites from './pages/Worksites'
import Surveys from './pages/Surveys'
import Gcps from './pages/Gcps'
import Estimates from './pages/Estimates'
import Measurements from './pages/Measurements'
import TerrainAnalysis from './pages/TerrainAnalysis'
import EarthworkResults from './pages/EarthworkResults'
import Warnings from './pages/Warnings'
import Validations from './pages/Validations'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Topbar />

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/worksites" element={<Worksites />} />
              <Route path="/surveys" element={<Surveys />} />
              <Route path="/gcps" element={<Gcps />} />
              <Route path="/estimates" element={<Estimates />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/terrain" element={<TerrainAnalysis />} />
              <Route path="/results" element={<EarthworkResults />} />
              <Route path="/warnings" element={<Warnings />} />
              <Route path="/validations" element={<Validations />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
