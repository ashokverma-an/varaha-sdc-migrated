-- Update users table with plain text passwords for testing
UPDATE users SET password = 'admin123' WHERE username = 'admin';
UPDATE users SET password = 'admin123' WHERE username = 'superadmin';
UPDATE users SET password = 'admin123' WHERE username = 'doctor';
UPDATE users SET password = 'admin123' WHERE username = 'nurse';
UPDATE users SET password = 'admin123' WHERE username = 'console';

-- Add reception user if not exists
INSERT IGNORE INTO users (username, password, admin_type, hospital_id) VALUES
('reception', 'admin123', 'admin', 1);