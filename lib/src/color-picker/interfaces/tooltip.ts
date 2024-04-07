import { NzTooltipTrigger } from "ng-zorro-antd/tooltip";

export interface TooltipConfig {
  show?: boolean;
  title?: string;
  placement?: string;
  color?: string;
  trigger?: NzTooltipTrigger;
}

export const defaultTooltipConfig = {
  show: false,
  title: '',
  trigger: 'hover' as NzTooltipTrigger
}