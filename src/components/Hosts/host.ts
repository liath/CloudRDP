export interface Tag {
  Key: string;
  Value: string;
}

export interface Host {
  id: string;
  ip: string;
  name: string;
  tags: Tag[];
  hidden: boolean;
}
