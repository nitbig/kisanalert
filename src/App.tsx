import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Advisory from './pages/Advisory';
import Weather from './pages/Weather';
import Market from './pages/Market';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import ExpertConsole from './pages/ExpertConsole';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="advisory" element={<Advisory />} />
          <Route path="weather" element={<Weather />} />
          <Route path="market" element={<Market />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="expert" element={<ExpertConsole />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
