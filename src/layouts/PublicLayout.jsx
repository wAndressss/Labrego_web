import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import CookieBanner from '../components/CookieBanner';
import WhatsAppButton from '../components/WhatsAppButton';
import ScrollProgress from '../components/ScrollProgress';

function PublicLayout() {
    return (
        <div className="public-layout">
            <ScrollProgress />
            <ScrollToTop />
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
            <CookieBanner />
        </div>
    );
}

export default PublicLayout;
