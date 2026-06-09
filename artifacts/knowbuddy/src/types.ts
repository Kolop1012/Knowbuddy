export type SearchSource =
  | { kind: 'phrase'; phrase: string }
  | { kind: 'image'; imageUrl: string };

export type PerspectiveMode =
  | 'wissenschaft'
  | 'stakeholder'
  | 'politische_debatte';
