import { Field, Select } from "@galeria/ui";

type SelectFilterProps = {
  id: string;
  label: string;
  allLabel: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value?: string;
};

/** Filtro de opción única con una opción vacía que equivale a "sin filtro". */
export function SelectFilter({ id, label, allLabel, options, value }: SelectFilterProps) {
  return (
    <Field label={label} htmlFor={id}>
      <Select id={id} name={id} defaultValue={value ?? ""}>
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}
