export interface MenuItem {
  id: string;
  title: string;
  icon: {
    name: string;
    size: number;
  };
  separatorAfter?: boolean;
}
