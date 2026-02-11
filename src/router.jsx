// Router Configuration

import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import RecordPage from './pages/RecordPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import LectureDetailPage from './pages/LectureDetailPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'record',
        element: <RecordPage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'lecture/:id',
        element: <LectureDetailPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
