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

export default function FiltrosFuncionarios({
  busca,
  setBusca,
  cargoFiltro,
  setCargoFiltro,
  statusFiltro,
  setStatusFiltro,
}) {
  const cargos = ["Todos", "Caixa", "Gerente de Loja"];
  const statusList = ["Todos", "Ativo", "Inativo"];

  const cargoOptions = cargos.map((c) => ({ value: c, label: c }));
  const statusOptions = statusList.map((s) => ({ value: s, label: s }));

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="flex flex-col">
        <label className="text-sm text-zinc-400">Buscar nome</label>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 w-full focus:border-[#FDF0D5] focus:outline-none focus:ring-0"
          placeholder="Digite o nome..."
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-400">Cargo</label>
        <Select
          value={cargoOptions.find((o) => o.value === cargoFiltro)}
          onChange={(option) => setCargoFiltro(option.value)}
          options={cargoOptions}
          styles={selectStyle}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-400">Status</label>
        <Select
          value={statusOptions.find((o) => o.value === statusFiltro)}
          onChange={(option) => setStatusFiltro(option.value)}
          options={statusOptions}
          styles={selectStyle}
        />
      </div>

    </div>
  );
}
