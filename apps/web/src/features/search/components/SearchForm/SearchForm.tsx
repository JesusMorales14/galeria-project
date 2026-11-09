import Form from "next/form";
import { Button, Field, Select, TextInput } from "@galeria/ui";
import { ARTWORK_TYPES, PERIODS, SORT_OPTIONS } from "../../lib/options";
import type { SearchFilters } from "../../lib/searchParams";
import { SelectFilter } from "./SelectFilter";

/**
 * Formulario GET real: funciona sin JavaScript (mejora progresiva).
 * Con JavaScript, next/form navega sin recargar y precarga la página de resultados.
 */
export function SearchForm({ filters }: { filters: SearchFilters }) {
  return (
    <Form action="/buscar" role="search" aria-label="Buscar obras" className="flex flex-col gap-5">
      <Field
        label="Buscar"
        htmlFor="q"
        hint="Título, artista o tema, en inglés: la colección está en inglés."
      >
        <TextInput
          id="q"
          name="q"
          type="search"
          defaultValue={filters.q}
          aria-describedby="q-hint"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SelectFilter
          id="tipo"
          label="Tipo de obra"
          allLabel="Todos los tipos"
          options={ARTWORK_TYPES}
          value={filters.type}
        />
        <SelectFilter
          id="epoca"
          label="Época"
          allLabel="Todas las épocas"
          options={PERIODS}
          value={filters.period}
        />
        <Field label="Artista" htmlFor="artista">
          <TextInput id="artista" name="artista" defaultValue={filters.artist} autoComplete="off" />
        </Field>
        <Field label="Orden" htmlFor="orden">
          <Select id="orden" name="orden" defaultValue={filters.sort ?? "relevance"}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div>
        <Button type="submit">Buscar</Button>
      </div>
    </Form>
  );
}
