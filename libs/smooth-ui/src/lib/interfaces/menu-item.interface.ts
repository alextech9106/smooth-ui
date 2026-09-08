export interface MenuItem {
  title?: string;
  icon: {
    name: string;
    size: number;
  };
  separatorAfter?: boolean;
}
