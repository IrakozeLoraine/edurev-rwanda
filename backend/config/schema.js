const { query } = require("./db");

const initSchema = async () => {
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS subjects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      level VARCHAR(20) NOT NULL CHECK (level IN ('O-Level', 'A-Level'))
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS topics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      chapter INTEGER NOT NULL DEFAULT 1,
      chapter_title VARCHAR(255) DEFAULT '',
      "order" INTEGER NOT NULL DEFAULT 1,
      difficulty VARCHAR(20) DEFAULT 'beginner'
        CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
      notes TEXT,
      summary JSONB DEFAULT '[]',
      content JSONB DEFAULT '[]',
      "references" JSONB DEFAULT '[]'
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      options JSONB NOT NULL DEFAULT '[]',
      correct_answer INTEGER NOT NULL
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS forum_posts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  console.log("Database schema initialized");
};

module.exports = initSchema;
