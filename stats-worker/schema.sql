CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY CHECK (name IN ('visits', 'downloads')),
  value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0)
);
INSERT OR IGNORE INTO counters (name, value) VALUES ('visits', 0), ('downloads', 0);
