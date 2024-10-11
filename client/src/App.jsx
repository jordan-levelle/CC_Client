import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from './components';
import { ExampleProposal, EditProposal, ForgotPassword, ProtectedRoute } from './components';
import { Home, Profile, Create, Basics, Subscriptions, Subscribe, Settings, Teams, AuthPage, Verification, VerifyLoadingPage, ProposalVote
 } from './pages';
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

            {/* Protected Routes */}
            <Route path='/profile' element={ <ProtectedRoute redirectTo='/auth'><Profile /></ProtectedRoute> } />
            <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/profile' />} />
            <Route path='/verify/:token' element={<Verification />} />
            <Route path='/verify-loading/:token' element={<VerifyLoadingPage />} />
            <Route path='/edit/:uniqueUrl' element={ <ProtectedRoute redirectTo='/auth'><EditProposal /></ProtectedRoute> } />
            <Route path='/edit/:uniqueToken/:uniqueUrl' element={<EditProposal />} />
            <Route path='/settings' element={ <ProtectedRoute redirectTo='/auth'><Settings /></ProtectedRoute> } />
            <Route path='/teams' element={ <ProtectedRoute redirectTo='/auth'><Teams /></ProtectedRoute> } />
            <Route path='/reset/:token' element={<ForgotPassword />} />

            {/* Public Routes */}
            <Route path='/create' element={<Create />} />
            <Route path='/basics' element={<Basics />} />
            <Route path='/subscriptions' element={<Subscriptions />} />
            <Route path='/subscribe' element={<Subscribe />} />
            <Route path='/example' element={<ExampleProposal />} />
            <Route path='/:uniqueUrl' element={<ProposalVote />} />
            
            {/* Redirect any unknown paths to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}