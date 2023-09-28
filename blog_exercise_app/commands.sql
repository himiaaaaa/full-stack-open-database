CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values (
    'mila',
    'http://mila.com',
    'mila is great'
);

insert into blogs (author, url, title) values (
    'kissa',
    'http://kissa.com',
    'kissa is best'
);
