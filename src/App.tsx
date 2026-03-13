import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { DigitalSolutions } from './pages/DigitalSolutions';
import { Portfolio } from './pages/Portfolio';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { FAQs } from './pages/FAQs';
import { Blog } from './pages/Blog';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { WebDesign } from './pages/WebDesign';
import { Logos } from './pages/Logos';
import { Websites } from './pages/Websites';
import { AdminMedia } from './pages/AdminMedia';
import { AdminTestimonials } from './pages/AdminTestimonials';
import { LandingPage } from './pages/LandingPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/digital-solutions" element={<DigitalSolutions />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/:slug" element={<LandingPage />} />
            <Route path="/services/web-design" element={<WebDesign />} />
            <Route path="/services/logos" element={<Logos />} />
            <Route path="/services/websites" element={<Websites />} />
            <Route path="/admin/media" element={<AdminMedia />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;
