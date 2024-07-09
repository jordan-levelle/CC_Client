import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from './components';
import { ExampleProposal, ProposalVote, EditProposal, ForgotPassword, ProtectedRoute } from './components';
import { Home, Profile, Create, Basics, Teams, Settings, AuthPage, Verification, VerifyLoadingPage } from './pages';
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
            {/* Authenticated Route for Profile */}
            <Route
              path='/profile'
              element={
                <ProtectedRoute redirectTo='/auth'>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Auth Route should not be accessible if user is authenticated */}
            <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/profile' />} />
            {/* Route for Verification */}
            <Route path='/verify/:token' element={<Verification />} />
            {/* Route for Verification Loading Page */}
            <Route path='/verify-loading/:token' element={<VerifyLoadingPage />} />
            {/* Authenticated Route for Edit Proposal */}
            <Route
              path='/edit/:uniqueUrl'
              element={
                <ProtectedRoute redirectTo='/auth'>
                  <EditProposal />
                </ProtectedRoute>
              }
            />
            {/* Non Auth User Route for Edit Proposal */}
            <Route path='/edit/:uniqueToken/:uniqueUrl' element={<EditProposal />} />
            {/* Authenticated Route for Profile Settings */}
            <Route
              path='/settings'
              element={
                <ProtectedRoute redirectTo='/auth'>
                  <Settings />
                </ProtectedRoute>
              }
            />
            {/*  */}
            <Route path='/reset/:token' element={<ForgotPassword />} />
            {/* Public Routes */}
            <Route path='/create' element={<Create />} />
            <Route path='/basics' element={<Basics />} />
            <Route path='/teams' element={<Teams />} />
            <Route path='/:uniqueUrl' element={<ProposalVote />} />
            <Route path='/example' element={<ExampleProposal />} />
            {/* Redirect any unknown paths to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}