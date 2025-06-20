import { useState } from 'react';
import axios from 'axios';
import './UrlCard.css';

const UrlCard = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`http://localhost:8080/api/url/${url.shortId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleVisit = () => {
    window.open(`http://localhost:8080/api/url/${url.shortId}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateUrl = (url, maxLength = 40) => {
    if (!url || typeof url !== 'string') return '';
    return url.length <= maxLength ? url : url.substring(0, maxLength) + '...';
  };

  return (
    <div className="url-card">
      <div className="url-card-header">
        <div className="url-info">
          <div className="short-url">
            <button className="short-url-link" onClick={handleVisit}>
              {`http://localhost:8080/api/url/${url.shortId}`}
            </button>
            <button 
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              )}
            </button>
          </div>
          <div className="long-url" title={url.originalUrl}>
            {truncateUrl(url.originalUrl)}
          </div>
        </div>
        <div className="url-stats">
          <div className="stat">
            <span className="stat-value">{url.clickCount}</span>
            <span className="stat-label">Clicks</span>
          </div>
        </div>
      </div>
      
      <div className="url-card-footer">
        <div className="url-meta">
          <span className="creation-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Created {formatDate(url.createdAt)}
          </span>
        </div>

        {url.locations && url.locations.length > 0 && (
          <div className="top-countries">
            <span className="countries-label">Top locations:</span>
            <div className="countries-list">
              {[...new Set(url.locations.slice(-5))].map((country) => (
                <span key={country} className="country-tag">{country}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlCard;