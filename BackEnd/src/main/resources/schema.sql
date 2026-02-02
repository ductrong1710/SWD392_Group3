-- This ensures the pgvector extension is enabled in the database.
-- Spring Boot will automatically run this file on startup.
CREATE EXTENSION IF NOT EXISTS vector;
