/**
 * Sanitizes error objects and request bodies to remove sensitive data like passwords
 */
export const sanitizeError = (error) => {
  if (!error) return error;
  
  // Create a copy to avoid mutating the original
  const sanitized = { ...error };
  
  // Remove password-related fields from error object if it contains request data
  if (sanitized.config && sanitized.config.data) {
    try {
      const data = typeof sanitized.config.data === 'string' 
        ? JSON.parse(sanitized.config.data) 
        : sanitized.config.data;
      
      if (data.password) {
        data.password = '[REDACTED]';
      }
      if (data.oldPassword) {
        data.oldPassword = '[REDACTED]';
      }
      if (data.newPassword) {
        data.newPassword = '[REDACTED]';
      }
      if (data.confirmNewPassword) {
        data.confirmNewPassword = '[REDACTED]';
      }
      
      sanitized.config.data = JSON.stringify(data);
    } catch (e) {
      // If parsing fails, just replace password strings
      if (typeof sanitized.config.data === 'string') {
        sanitized.config.data = sanitized.config.data.replace(/"password":\s*"[^"]*"/gi, '"password": "[REDACTED]"');
        sanitized.config.data = sanitized.config.data.replace(/"oldPassword":\s*"[^"]*"/gi, '"oldPassword": "[REDACTED]"');
        sanitized.config.data = sanitized.config.data.replace(/"newPassword":\s*"[^"]*"/gi, '"newPassword": "[REDACTED]"');
      }
    }
  }
  
  // Sanitize message if it contains password
  if (sanitized.message) {
    sanitized.message = sanitized.message.replace(/password[:\s]*['"][^'"]*['"]/gi, 'password: [REDACTED]');
  }
  
  return sanitized;
};

/**
 * Sanitizes request body to remove sensitive fields before logging
 */
export const sanitizeRequestBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'oldPassword', 'newPassword', 'confirmNewPassword'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

