export interface IChapter {
  id?: string;
  anime: string;
  name: string;
  pages: IPage[];
  order: number;
}

export interface IPage {
  order: string;
  url: string;
}
