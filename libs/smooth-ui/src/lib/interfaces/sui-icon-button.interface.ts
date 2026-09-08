import { SUI_ICON_BUTTON_VARIANT } from '../components/sui-icon-button/type/sui-icon-button-variant.type';
import { SUI_BUTTON_SHAPE } from '../types/sui-button-shape.type';
import { SUI_BUTTON_SIZE } from '../types/sui-button-size.type';
import { SUI_BUTTON_STATE } from '../types/sui-button-state.type';

export interface SuiIconButton {
  icon: string;
  badge?: number;
  iconSize?: number;
  selected?: boolean;
  shape?: SUI_BUTTON_SHAPE;
  size?: SUI_BUTTON_SIZE;
  state?: SUI_BUTTON_STATE;
  variant?: SUI_ICON_BUTTON_VARIANT;
}
