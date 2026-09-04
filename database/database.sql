-- Create database
CREATE DATABASE IF NOT EXISTS ekasi_league;
USE ekasi_league;

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    entry_fee DECIMAL(10,2) NOT NULL,
    prize_pool DECIMAL(10,2) NOT NULL,
    status ENUM('OPEN', 'FULL', 'LIVE', 'FINISHED') DEFAULT 'OPEN',
    total_slots INT NOT NULL,
    slots_taken INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    team1 VARCHAR(100) NOT NULL,
    team2 VARCHAR(100),
    team3 VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    host_whatsapp VARCHAR(20) DEFAULT '0664171598',
    admin_password VARCHAR(255) DEFAULT 'ek@si123'
);

-- Insert default settings
INSERT INTO settings (host_whatsapp, admin_password) VALUES ('0664171598', 'ek@si123')
ON DUPLICATE KEY UPDATE host_whatsapp = VALUES(host_whatsapp);

-- Sample tournament data (optional)
INSERT INTO tournaments (name, date, time, location, entry_fee, prize_pool, status, total_slots, slots_taken) VALUES
('Kasi Champs Cup - Nelspruit', '2026-09-05', '12:00:00', 'Phola, WhiteRiver', 30.00, 500.00, 'OPEN', 32, 12),
('Soweto Derby Showdown', '2026-09-12', '14:00:00', 'Orlando, Soweto', 50.00, 1000.00, 'OPEN', 16, 8),
('Cape Town Clash', '2026-09-19', '10:00:00', 'Cape Town CBD', 25.00, 400.00, 'LIVE', 24, 22),
('Durban Diski Finals', '2026-08-28', '15:00:00', 'Durban North', 40.00, 750.00, 'FINISHED', 16, 16);