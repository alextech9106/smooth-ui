import { SUI_ICON_NAME } from '../components/sui-icon/type/sui-icon-name.type';

export interface MenuItem {
  id: string;
  title: string;
  icon: {
    name: SUI_ICON_NAME;
    size: number;
  };
  separatorAfter?: boolean;
}
