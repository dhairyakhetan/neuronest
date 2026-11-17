import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './lib/toast';
import { useTheme } from './lib/theme';
import { Celebration } from './components/Celebration';
import { PublicLayout, ScrollToTop } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { HowItWorks } from './pages/HowItWorks';
import { CompanionPage } from './pages/CompanionPage';
import { Pricing } from './pages/Pricing';
import { FAQs } from './pages/FAQs';
import { Resources } from './pages/Resources';
import { Contact } from './pages/Contact';
import { Onboarding, SignIn, SignUp } from './pages/Auth';
import { AdminPanel } from './pages/dashboard/Admin';
import { Legal, NotFound } from './pages/Legal';
import { CommunityPage, DevelopmentCheckPage, TherapistsPage } from './pages/NewFeaturePages';
import { Overview, Rewards, TodayPlan } from './pages/dashboard/Home';
import { Learning, Milestones, Progress, Speech } from './pages/dashboard/Track';
import { CareNetwork, DashCheck, DashCommunity, DashResources, DashTherapists, Privacy, Profile, Settings } from './pages/dashboard/Account';

function ThemeSync() {
  useTheme();
  return null;
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ToastProvider>
          <ThemeSync />
          <ScrollToTop />
          <Celebration />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="features" element={<Features />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="companion" element={<CompanionPage />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="resources" element={<Resources />} />
              <Route path="contact" element={<Contact />} />
              <Route path="development-check" element={<DevelopmentCheckPage />} />
              <Route path="therapists" element={<TherapistsPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="privacy" element={<Legal doc="privacy" />} />
              <Route path="terms" element={<Legal doc="terms" />} />
              <Route path="responsible-ai" element={<Legal doc="responsible-ai" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="today" element={<TodayPlan />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="check" element={<DashCheck />} />
              <Route path="milestones" element={<Milestones />} />
              <Route path="learning" element={<Learning />} />
              <Route path="speech" element={<Speech />} />
              <Route path="progress" element={<Progress />} />
              <Route path="therapists" element={<DashTherapists />} />
              <Route path="community" element={<DashCommunity />} />
              <Route path="care-network" element={<CareNetwork />} />
              <Route path="resources" element={<DashResources />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
