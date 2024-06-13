'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../styles/global.css';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { ModalProvider } from '../context/modal';
import AuthModal from '../components/AuthModal';
import { ApiCallProvider } from '../context/apiCall';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import LogoutModal from '../components/LogoutModal';
import { TempDataProvider } from '../context/tempData';
import ApplyJobModal from '../components/ApplyJobModal';
import JobPostModal from '../components/JobPostModal';
import CompanyProfileModal from '../components/CompanyProfileModal';
import SendHistoryModal from '../components/SendHistoryModal';
import NewsModal from '../components/NewsModal';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.min.js');
    }
  }, []);

  return (
    <ApiCallProvider>
      <TempDataProvider>
        <ModalProvider>
          <NavBar />
          <Toaster position="top-right" />
          <NewsModal />
          <AuthModal />
          <LogoutModal />
          <ApplyJobModal />
          <JobPostModal />
          <CompanyProfileModal />
          <SendHistoryModal />
          <ForgotPasswordModal />
          <main className="main">
            <Component {...pageProps} />
          </main>
          <Footer />
        </ModalProvider>
      </TempDataProvider>
    </ApiCallProvider>
  );
}
