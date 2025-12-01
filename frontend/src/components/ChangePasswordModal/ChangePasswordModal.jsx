import { useState } from 'react';
import axios from 'axios';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New password and confirm password do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const axiosConfig = {
        withCredentials: true,
      };

      const response = await axios.put(
        'https://short-ly-2njz.onrender.com/api/user/password',
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        axiosConfig
      );

      if (response.data.success || response.status === 200) {
        setSuccess('Password changed successfully!');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Failed to change password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>Change Password</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="auth-modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                placeholder="Enter your new password"
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your new password"
                minLength="8"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;


