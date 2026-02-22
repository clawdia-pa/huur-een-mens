-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  type TEXT DEFAULT 'human',
  headline TEXT,
  bio TEXT,
  location_city TEXT,
  location_country TEXT,
  hourly_rate REAL,
  currency TEXT DEFAULT 'EUR',
  avatar_url TEXT,
  is_verified INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT
);

-- User skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  user_id TEXT NOT NULL,
  skill_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  human_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  task_description TEXT,
  task_location TEXT,
  task_date TEXT,
  task_time TEXT,
  duration_hours REAL DEFAULT 1,
  total_price REAL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (human_id) REFERENCES users(id),
  FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Seed some default skills
INSERT OR IGNORE INTO skills (name, slug, category) VALUES
  ('Boodschappen', 'boodschappen', 'Dagelijks'),
  ('Koerier', 'koerier', 'Transport'),
  ('Schoonmaak', 'schoonmaak', 'Huishouden'),
  ('Tuinieren', 'tuinieren', 'Huishouden'),
  ('Fotografie', 'fotografie', 'Creatief'),
  ('Video', 'video', 'Creatief'),
  ('Rijden', 'rijden', 'Transport'),
  ('Klussen', 'klussen', 'Technisch'),
  ('Verhuizen', 'verhuizen', 'Transport'),
  ('Oppassen', 'oppassen', 'Zorg'),
  ('Huisdieren', 'huisdieren', 'Zorg'),
  ('Administratie', 'administratie', 'Kantoor');
