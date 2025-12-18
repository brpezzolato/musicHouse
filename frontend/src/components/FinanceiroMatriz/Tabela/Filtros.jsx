"use client";
import Select from "react-select";

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: "99999px",
    borderColor: "#5a6870",
    padding: "2px",
    minHeight: "40px",
    boxShadow: "none",
    backgroundColor: "#003049",
    "&:hover": { borderColor: "#fdf0d5" },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#ffffff",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#ffffff99", // ✔ branco suave
  }),

  input: (base) => ({
    ...base,
    color: "#ffffff", // ✔ texto branco ao digitar dentro do select
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
  categorias,
}) {
  return (
    <div
      className="rounded-md p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      style={{
        backgroundColor: "#00263a",
        border: "1px solid #003049",
      }}
    >
      {/* BUSCA */}
      <div className="flex flex-col col-span-1">
        <label className="text-sm" style={{ color: "#ffffff" }}>
          Buscar descrição
        </label>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite a descrição..."
          className="p-2 pl-3 w-full rounded bg-[#003049] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
        />
      </div>

      {/* CATEGORIA */}
      <div className="flex flex-col col-span-1">
        <label className="text-sm" style={{ color: "#ffffff" }}>
          Categoria
        </label>

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
        <label className="text-sm" style={{ color: "#ffffff" }} >
          Status
        </label>

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
