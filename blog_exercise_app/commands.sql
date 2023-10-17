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

insert into users (username, name) values (
    'milaaa@gmail.com',
    'mm'
);

insert into users (username, name) values (
    'Kikiiii@gmail.com',
    'kk'
);


insert into users (username, name) values (
    'zakkasas@gmail.com',
    'zz'
);

insert into blogs (author, url, title, user_id) values (
    'mila',
    'http://mila.com',
    'mila is great',
    1
);

insert into blogs (author, url, title, user_id) values (
    'kissa',
    'http://kissa.com',
    'kissa is best',
    2
);

insert into blogs (author, url, title, user_id) values (
    'koira',
    'http://koira.com',
    'koira is the best',
    2
);

insert into blogs (author, url, title, user_id) values (
    'tree',
    'http://tree.com',
    'tree is the best',
    2
);
 
insert into reading_lists (user_id, blog_id, read_state) values (1, 3, false);
insert into reading_lists (user_id, blog_id, read_state) values (1, 4, false);
insert into reading_lists (user_id, blog_id) values (2, 1);