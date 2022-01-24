export enum VALUE_UNIT {
  Absolute = 'Absolute values',
  Percentage = 'Percentage values',
}

export const VALUE_UNIT_OPTIONS = Object.entries(VALUE_UNIT).map(([value, label]) => ({
  label,
  value,
}));
