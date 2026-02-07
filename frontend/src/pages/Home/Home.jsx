import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthModal from '../../components/AuthModal/AuthModal.jsx';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const { token } = useAuth(); 
  const navigate = useNavigate();

  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      author: 'bot',
      text: "Hi there! I'm the Short.ly assistant. Ask me anything about shortening links.",
    },
  ]);

  const validateUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl(null);

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(originalUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'https://short-ly-2njz.onrender.com/api/url/shorten',
        { originalUrl },
        { withCredentials: true }
      );
      
      const shortUrl = res.data.shortUrl;
      setShortenedUrl(shortUrl);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401 || status === 403) {
        setShowAuthModal(true);
      } else {
        setError(err.response?.data?.error || 'Failed to shorten URL. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleChatToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const trimmed = chatMessage.trim();

    if (!trimmed) {
      return;
    }

    const timestamp = Date.now();

    const userMessage = {
      id: timestamp,
      author: 'user',
      text: trimmed,
    };

    // Add user message immediately
    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const chatBaseUrl = import.meta.env.CHAT_API_URL || '';
      const response = await axios.post(
        `${chatBaseUrl}/chat`,
        { question: trimmed },
        { withCredentials: true }
      );

      // Extract the bot response from the API
    
      const botResponse = response.data?.answer || response.data?.response || response.data?.message || "I'm sorry, I couldn't process that request.";

      const botMessage = {
        id: timestamp + 1,
        author: 'bot',
        text: botResponse,
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Sorry, I encountered an error. Please try again.";
      
      const botMessage = {
        id: timestamp + 1,
        author: 'bot',
        text: errorMessage,
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Shorten Your Links<br />Share with Confidence</h1>
              <p>
                Transform long, unwieldy URLs into clean, professional short links. 
                Track clicks, analyze performance, and manage all your links in one place.
              </p>
            </div>

            <div className="url-shortener-form">
              <form onSubmit={handleSubmit} className="shortener-form">
                {error && (
                  <div className="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="input-group">
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="Enter your long URL here..."
                    className="url-input"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary shorten-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading"></span>
                        Shortening...
                      </>
                    ) : (
                      'Shorten URL'
                    )}
                  </button>
                </div>
              </form>

              {shortenedUrl && (
                <div className="result-card">
                  <div className="result-header">
                    <h3>Your shortened URL is ready!</h3>
                  </div>
                  <div className="result-content">
                    <div className="shortened-url">
                      <span className="url-text">{shortenedUrl}</span>
                      <button
                        className={`copy-button ${copied ? 'copied' : ''}`}
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="original-url">
                      <span>Original: {originalUrl}</span>
                    </div>
                  </div>

                  <div className="result-actions">
                    <button className="btn btn-secondary" onClick={handleDashboard}>
                      View Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Easy URL Shortening</h3>
              <p>Transform long URLs into short, manageable links in seconds. Perfect for social media, emails, and marketing campaigns.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Click Analytics</h3>
              <p>Track every click with detailed analytics. See where your audience is coming from and when they're most active.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Link Management</h3>
              <p>Organize and manage all your shortened links in one dashboard. Edit, delete, and analyze your links with ease.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`chatbot-widget ${isChatOpen ? 'open' : ''}`}>
        <button
          className="chatbot-toggle"
          onClick={handleChatToggle}
          aria-expanded={isChatOpen}
          aria-controls="chatbot-modal"
          aria-label={isChatOpen ? 'Close chatbot' : 'Open chatbot'}
        >
          <span className={`chatbot-toggle-icon ${isChatOpen ? 'open' : ''}`} aria-hidden="true">
            {isChatOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 12a8.5 8.5 0 0 1-1.22 4.45.91.91 0 0 0-.11.44v3l-2.83-1.7a1 1 0 0 0-.51-.14 8.5 8.5 0 1 1 4.67-7.05Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>

        {isChatOpen && (
          <div className="chatbot-modal" id="chatbot-modal">
            <div className="chatbot-header">
              <div>
                <p className="chatbot-title">Short.ly Assistant</p>
                <span className="chatbot-status">Online</span>
              </div>
              <button
                className="chatbot-close"
                onClick={handleChatToggle}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>

            <div className="chatbot-body">
              <ul className="chatbot-messages">
                {chatHistory.map((msg) => (
                  <li key={msg.id} className={`message ${msg.author}`}>
                    {msg.text}
                  </li>
                ))}
                {chatLoading && (
                  <li key="loading" className="message bot">
                    <span className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <form className="chatbot-input" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={chatLoading}
              />
              <button type="submit" disabled={chatLoading || !chatMessage.trim()}>
                {chatLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          mode="login"
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => {}}
        />
      )}
    </div>
  );
};

export default Home;
