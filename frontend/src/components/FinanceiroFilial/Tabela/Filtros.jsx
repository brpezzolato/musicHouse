"use client";
import Select from "react-select";

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '99999px',
    borderColor: state.isFocused ? '#403a3f' : '#403a3f',
    padding: '2px',
    minHeight: '40px',
    boxShadow: state.isFocused ? '0 0 0 1px #403a3f' : 'none',
    '&:hover': { borderColor: '#403a3f' },
    backgroundColor: '#27272a',
  }),

  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),

  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),

  placeholder: (base) => ({
    ...base,
    color: '#a7a7a7bb',
    fontSize: '14px',
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,

    backgroundColor: isFocused
      ? '#C1121F'
      : isSelected
      ? '#003049' 
      : 'white',

    color: isFocused || isSelected ? 'white' : '#003049',

    cursor: 'pointer',

    '&:active': {
      backgroundColor: '#003049',
      color: 'white',
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '6px',
    overflow: 'hidden',
  }),
};

export default function Filtros({
  busca,
  setBusca,
  categoriaFiltro,
  setCategoriaFiltro,
  statusFiltro,
  setStatusFiltro,
  categorias
}) {
  return (
    <div
      className="bg-zinc-900 border border-zinc-800 p-6 rounded-md
      grid grid-cols-1 md:grid-cols-3 gap-4"
    >

      <div className="flex flex-col col-span-1">
        <label className="text-sm text-zinc-400">Buscar descrição</label>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite a descrição..."
          className="p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 w-full focus:border-[#FDF0D5] focus:outline-none focus:ring-0"
        />
      </div>

      {/* CATEGORIA */}
      <div className="flex flex-col col-span-1">
        <label className="text-sm text-zinc-400">Categoria</label>

        <Select
          styles={selectStyle}
          value={{ label: categoriaFiltro, value: categoriaFiltro }}
          onChange={(opt) => setCategoriaFiltro(opt.value)}
          options={categorias.map((c) => ({ label: c, value: c }))}
          placeholder="Selecione..."
        />
      </div>

      {/* STATUS */}
      <div className="flex flex-col col-span-1">
        <label className="text-sm text-zinc-400">Status</label>

        <Select
          styles={selectStyle}
          value={{ label: statusFiltro, value: statusFiltro }}
          onChange={(opt) => setStatusFiltro(opt.value)}
          options={[
            { value: "todos", label: "todos" },
            { value: "Paga", label: "Paga" },
            { value: "Pendente", label: "Pendente" },
          ]}
          placeholder="Selecione..."
        />
      </div>

    </div>
  );
}
