export const useOptionList = <Item extends Record<string, any>>(
  data: Item[],
  labelKey: keyof Item,
  valueKey: keyof Item,
  options?: {
    disabledKey?: keyof Item;
    placeholder?: string;
    additionalOptions?: { label: string; value: string }[];
  }
) => {
  return [
    ...(options?.placeholder ? [{ label: options.placeholder, value: '', disabled: true }] : []),
    ...(options?.additionalOptions ?? []),
    ...data.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
      disabled: options?.disabledKey ? (item[options.disabledKey] as boolean) : false,
    })),
  ];
};
