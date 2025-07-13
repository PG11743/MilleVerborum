// This contains types that are used across a few different pages and components

// This won't really do anything but show the dev what the types should be, since TypeScript can't tell at compile time whether this is correct.
export type LangRowType = {
    lang_id:        number;
    lang_name:      string;
    lang_level?:    number | null;
};

export type StageMode = 'level' | 'fail' | 'active';
