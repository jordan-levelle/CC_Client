import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from './components';
import { ExampleProposal, ProposalVote, EditProposal } from './components';
import { Home, Profile, Create, Basics, Teams, Settings, AuthPage } from './pages';
import { useAuthContext } from './hooks/useAuthContext';

export default function App() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={user ? <Profile /> : <Navigate to='/auth' />} />
            <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/profile' />} />
            <Route path='/create' element={<Create />} />
            <Route path='/basics' element={<Basics />} />
            <Route path='/teams' element={<Teams />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/:uniqueUrl' element={<ProposalVote />} />
            <Route path='/edit/:uniqueUrl' element={<EditProposal />} />
            <Route path='/example' element={<ExampleProposal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}