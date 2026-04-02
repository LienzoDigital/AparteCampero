import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewEvent from './pages/NewEvent';
import Teams from './pages/Teams';
import RegisterTime from './pages/RegisterTime';
import CaptureTime from './pages/CaptureTime';
import EditTimes from './pages/EditTimes';
import Results from './pages/Results';
import ExportData from './pages/ExportData';
import Instructions from './pages/Instructions';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-event" element={<NewEvent />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/register-time" element={<RegisterTime />} />
              <Route path="/capture-time" element={<CaptureTime />} />
              <Route path="/edit-times" element={<EditTimes />} />
              <Route path="/results" element={<Results />} />
              <Route path="/export-data" element={<ExportData />} />
              <Route path="/instructions" element={<Instructions />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
