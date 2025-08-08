DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS test;

-- PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS languages (
    lang_id         INTEGER     PRIMARY KEY,
    lang_name       TEXT        NOT NULL UNIQUE,
    lang_abv        TEXT        NOT NULL UNIQUE,
    curr_level      INTEGER,
    prime_col       TEXT,
    sec_col         TEXT,
    ter_col         TEXT
);

CREATE TABLE IF NOT EXISTS words (
    word_id         INTEGER     PRIMARY KEY,
    lang_id         INTEGER     NOT NULL,
    word_rank       INTEGER     NOT NULL,
    native_word     TEXT        NOT NULL,
    foreign_word    TEXT        NOT NULL,
    pronunciation   TEXT        ,
    corr_count      INTEGER     NOT NULL,
    fail_count      INTEGER     NOT NULL,
    FOREIGN KEY (lang_id) REFERENCES languages (lang_id),
    UNIQUE (lang_id, word_rank)
);

INSERT INTO languages (
    lang_name,
    lang_abv,
    curr_level,
    prime_col,
    sec_col,
    ter_col
) values (
    "Danish",
    "DA",
    null,
    '#C8102E',
    '#FFFFFF',
    null
);

INSERT INTO languages (
    lang_name,
    lang_abv,
    curr_level,
    prime_col,
    sec_col,
    ter_col
) values (
    "Estonian",
    "ET",
    null,
    '#0072CE',
    '#FFFFFF',
    null
);

INSERT INTO languages (
    lang_name,
    lang_abv,
    curr_level,
    prime_col,
    sec_col,
    ter_col
) values (
    "Lithuanian",
    "LT",
    null,
    '#046A38',
    '#FFB81C',
    '#BE3A34'
);