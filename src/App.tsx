import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import JoinPage from "./pages/JoinPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ConnectionsPage from "./pages/ConnectionsPage";
import { AppLayout } from "./components/layout/AppLayout";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import PodcastsPage from "./pages/PodcastsPage";
import NotificationsPage from "./pages/NotificationsPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

const App = () => (
  <BrowserRouter>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/join" element={<JoinPage />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/podcasts" element={<PodcastsPage />} />
        <Route path="/communications" element={<CommunicationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
