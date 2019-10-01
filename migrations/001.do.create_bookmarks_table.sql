CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    url text NOT NULL,
    rating INTEGER,
    description text
);