import { SUI_BUTTON_VARIANT } from '../components/sui-button/type/sui-button-variant.type';
import { SUI_BUTTON_SHAPE } from '../types/sui-button-shape.type';
import { SUI_BUTTON_SIZE } from '../types/sui-button-size.type';
import { SUI_BUTTON_STATE } from '../types/sui-button-state.type';

export interface SuiButton {
  name: string;
  fullWidth?: boolean;
  icon?: string;
  iconEnd?: boolean;
  iconSize?: number;
  loading?: boolean;
  selected?: boolean;
  shape?: SUI_BUTTON_SHAPE;
  size?: SUI_BUTTON_SIZE;
  state?: SUI_BUTTON_STATE;
  variant?: SUI_BUTTON_VARIANT;
  callback?: () => void;
}
