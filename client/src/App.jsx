import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Create from './pages/Create';
import Basics from './pages/Basics';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import AuthPage from './pages/Authentication';
import VerificationPage from './pages/Verification';
import Signup from './components/Signup';
import ExampleProposal from './components/ExampleProposal';
import ProposalVote from './components/ProposalVote';
import EditProposal from './components/EditProposal';
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
            <Route path='/verify/:token' element={<VerificationPage />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/create' element={<Create />} />
            <Route path='/basics' element={<Basics />} />
            <Route path='/teams' element={<Teams />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/vote/:uniqueUrl' element={<ProposalVote />} />
            <Route path='/edit/:uniqueUrl' element={<EditProposal />} />
            <Route path='/example' element={<ExampleProposal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}



