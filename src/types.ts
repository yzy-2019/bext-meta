export interface Meta {
  version: string;
  id: string; // 唯一id，取文件名
  name: string;
  tags: string[];
  synopsis: string; // 简介
  readme: string; // 详情
  type: 'ext'; // 类型
  source: Record<string, string>; // 源文件
  build: string; // 产物
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
