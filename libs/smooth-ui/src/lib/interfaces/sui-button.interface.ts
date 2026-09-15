import { SUI_BUTTON_VARIANT } from '../components/sui-button/type/sui-button-variant.type';
import { SUI_SHAPE } from '../types/sui-shape.type';
import { SUI_SIZE } from '../types/sui-size.type';
import { SUI_STATE } from '../types/sui-state.type';

export interface SuiButton {
  name: string;
  fullWidth?: boolean;
  icon?: string;
  iconEnd?: boolean;
  iconSize?: number;
  loading?: boolean;
  selected?: boolean;
  shape?: SUI_SHAPE;
  size?: SUI_SIZE;
  state?: SUI_STATE;
  variant?: SUI_BUTTON_VARIANT;
  callback?: () => void;
}
