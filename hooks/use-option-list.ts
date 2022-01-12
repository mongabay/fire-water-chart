export const useOptionList = <
  Item extends Record<string, any>,
  Label extends keyof Item,
  Value extends keyof Item,
  Disabled extends keyof Item
>(
  data: Item[],
  labelKey: Item[Label] extends string ? Label : never,
  valueKey: Item[Value] extends string ? Value : never,
  options?: {
    disabledKey?: Item[Disabled] extends boolean ? Disabled : never;
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
      disabled: options?.disabledKey ? item[options.disabledKey] : false,
    })),
  ];
};
