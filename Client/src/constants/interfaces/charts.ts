export interface TooltipProps<T> {
  active?: boolean;
  label?: string;
  payload?: {
    value: number;
    name: string;
    dataKey: string;
    payload: T;
  }[];
}