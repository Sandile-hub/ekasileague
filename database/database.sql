-- Active: 1780121140153@@127.0.0.1@5432@ekasi_league
-- ekasi_league schema for PostgreSQL

CREATE TABLE IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    entry_fee DECIMAL(10,2) NOT NULL,
    prize_pool DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'FULL', 'LIVE', 'FINISHED')),
    total_slots INT NOT NULL,
    slots_taken INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    team1 VARCHAR(100) NOT NULL,
    team2 VARCHAR(100),
    team3 VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    host_whatsapp VARCHAR(20) DEFAULT '0664171598',
    admin_password VARCHAR(255) DEFAULT 'ekasi123'
);

-- Insert default settings (upsert)
INSERT INTO settings (host_whatsapp, admin_password) VALUES ('0664171598', 'ekasi123')
ON CONFLICT (id) DO UPDATE SET host_whatsapp = EXCLUDED.host_whatsapp, admin_password = EXCLUDED.admin_password;
