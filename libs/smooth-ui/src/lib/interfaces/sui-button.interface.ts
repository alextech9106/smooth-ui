import { SUI_BUTTON_VARIANT } from '../components/sui-button/type/sui-button-variant.type';
import { SUI_ICON_NAME } from '../components/sui-icon/type/sui-icon-name.type';
import { SUI_SHAPE } from '../types/sui-shape.type';
import { SUI_SIZE } from '../types/sui-size.type';
import { SUI_STATE } from '../types/sui-state.type';

export interface SuiButton {
  name: string;
  expanded?: boolean;
  fullWidth?: boolean;
  icon?: SUI_ICON_NAME;
  iconEnd?: boolean;
  label?: string;
  loading?: boolean;
  selected?: boolean;
  shape?: SUI_SHAPE;
  size?: SUI_SIZE;
  state?: SUI_STATE;
  variant?: SUI_BUTTON_VARIANT;
  callback?: () => void;
}
