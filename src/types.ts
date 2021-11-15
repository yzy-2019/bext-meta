export interface Meta {
  id: string;
  name: string;
  tags: string[];
  synopsis: string;
  detail: string;
  source: string;
  lang: string;
  build: string;
}

export interface MetaVersion {
  hash: string;
  date: string;
  message: string;
  author_name: string;
  author_email: string;
  version: string;
}

export interface MetaIndex {
  hash: string;
  versions: MetaVersion[];
  meta?: Meta;
}
