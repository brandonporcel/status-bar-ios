export interface MenuItem {
  id: number;
  image: string;
  name: string;
  route: string;
  parentId: number;
  menuType: MenuType;
}

export interface MenuType {
  Id: number;
  Description: string;
}
