import { SUI_ICON_BUTTON_VARIANT } from '../components/sui-icon-button/type/sui-icon-button-variant.type';
import { SUI_SHAPE } from '../types/sui-shape.type';
import { SUI_SIZE } from '../types/sui-size.type';
import { SUI_STATE } from '../types/sui-state.type';

export interface SuiIconButton {
  icon: string;
  badge?: number;
  iconSize?: number;
  selected?: boolean;
  shape?: SUI_SHAPE;
  size?: SUI_SIZE;
  state?: SUI_STATE;
  variant?: SUI_ICON_BUTTON_VARIANT;
  callback?: () => void;
}
