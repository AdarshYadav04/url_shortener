import { useState, useEffect } from 'react';
import axios from 'axios';
import UrlCard from '../../components/UrlCard/UrlCard.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalUrls: 0, totalClicks: 0, topCountries: [], urls: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [urlsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosConfig = {
          withCredentials: true,
        };

        const userRes = await axios.get('https://short-ly-2njz.onrender.com/api/user/profile', axiosConfig);
        setUser(userRes.data);

        const dashboardRes = await axios.get('https://short-ly-2njz.onrender.com/api/url/dashboard', axiosConfig);
        setStats({
          totalUrls: dashboardRes.data.totalLinks,
          totalClicks: dashboardRes.data.totalClicks,
          topCountries: getTopCountries(dashboardRes.data.links),
          urls: dashboardRes.data.links,
        });
      } catch (err) {
        console.error('Failed to load data:');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setStats]);

  const handleDeleteUrl = (shortIdToRemove) => {
  setStats((prevStats) => {
    const updatedUrls = prevStats.urls.filter((url) => url.shortId !== shortIdToRemove);
    return {
      ...prevStats,
      urls: updatedUrls,
      totalUrls: updatedUrls.length,
      totalClicks: updatedUrls.reduce((sum, url) => sum + url.clickCount, 0),
      topCountries: getTopCountries(updatedUrls),
    };
  });
};

  

  const getTopCountries = (links) => {
    const countryMap = {};
    links.forEach((link) => {
      if (link.locations) {
        link.locations.forEach((location) => {
          countryMap[location] = (countryMap[location] || 0) + 1;
        });
      }
    });

    return Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = stats.urls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalPages = Math.ceil(stats.urls.length / urlsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading" style={{ width: '2rem', height: '2rem' }}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Here's an overview of your shortened links and their performance.</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard label="Total Links" value={stats.totalUrls} iconType="chain" />
          <StatCard label="Total Clicks" value={stats.totalClicks} iconType="click" />
          <StatCard
            label="Avg. Clicks per Link"
            value={stats.totalUrls > 0 ? Math.round(stats.totalClicks / stats.totalUrls) : 0}
            iconType="clock"
          />
          <TopCountriesCard countries={stats.topCountries} />
        </div>

        <div className="urls-section">
          <div className="section-header">
            <h2>Your Links</h2>
            {stats.urls.length > 0 && (
              <p className="section-subtitle">
                Showing {indexOfFirstUrl + 1}-{Math.min(indexOfLastUrl, stats.urls.length)} of {stats.urls.length} links
              </p>
            )}
          </div>

          {stats.urls.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="urls-list">
                {currentUrls.map((url) => (
                  <UrlCard key={url.shortId} url={url} onDelete={handleDeleteUrl} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Previous
                  </button>

                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable components for brevity (optional)
const StatCard = ({ label, value, iconType }) => (
  <div className="stat-card">
    <div className="stat-icon">
      {/* Use iconType if you want to switch icons */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const TopCountriesCard = ({ countries }) => (
  <div className="stat-card countries-card">
  <div className="stat-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" />
    </svg>
  </div>
  <div className="stat-content">
    <div className="stat-label">Top Country</div>
    <div className="countries-list">
      {countries.length > 0 ? (
        <div className="country-item">
          <span className="country-name">
            {
              countries.reduce((top, country) =>
                country.count > top.count ? country : top
              ).country
            }
          </span>
          <span className="country-count">
            {
              countries.reduce((top, country) =>
                country.count > top.count ? country : top
              ).count
            }
          </span>
        </div>
      ) : (
        <span className="no-data">No data yet</span>
      )}
    </div>
  </div>
</div>

);

const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
    <h3>No links yet</h3>
    <p>Start shortening URLs to see them appear here.</p>
    <a href="/" className="btn btn-primary">Create Your First Link</a>
  </div>
);

export default Dashboard;
