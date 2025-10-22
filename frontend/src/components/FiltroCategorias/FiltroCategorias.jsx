'use client';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactSlider from 'react-slider';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function FiltroCategorias() {
  const [isOpen, setIsOpen] = useState(false);

  const [cordas, setCordas] = useState(null);
  const [cor, setCor] = useState(null);
  const [material, setMaterial] = useState('');
  const [ordem, setOrdem] = useState('');
  const [faixaPreco, setFaixaPreco] = useState([0, 1000]);

  const cores = [
    { nome: 'Azul Escuro', cor: '#002f46' },
    { nome: 'Marrom', cor: '#784421' },
    { nome: 'Preto', cor: '#1a0e0e' },
  ];

  const options = [
    { value: 'madeira', label: 'Madeira' },
    { value: 'nylon', label: 'Nylon' },
    { value: 'aço', label: 'Aço' },
    { value: 'fibra', label: 'Fibra de carbono' },
  ];

  const ordenacao = [
    { value: 'menor', label: 'Menor preço' },
    { value: 'maior', label: 'Maior preço' },
    { value: 'az', label: 'Nome (A-Z)' },
    { value: 'za', label: 'Nome (Z-A)' },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#fff',
      borderColor: state.isFocused ? '#c1121f' : '#d1d5db',
      borderRadius: '0.5rem',
      padding: '2px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(193,18,31,0.2)' : 'none',
      outline: 'none',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: '#c1121f' },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#c1121f'
        : state.isFocused
        ? '#fbeaec'
        : '#fff',
      color: state.isSelected ? '#fff' : '#111',
      cursor: 'pointer',
    }),
    input: (provided) => ({
      ...provided,
      outline: 'none !important',
      boxShadow: 'none !important',
    }),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      cordas,
      cor,
      material,
      ordem,
      precoMin: faixaPreco[0],
      precoMax: faixaPreco[1],
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ml-2 bg-white text-[#c1121f] p-5 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60 hover:ring-2 hover:ring-[#c1121f]/40 hover:shadow-[0_0_12px_2px_rgba(193,18,31,0.3)] hover:text-[#780000] transition-all duration-300"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      <div
        className={`fixed top-0 right-0 z-40 w-full max-w-xs h-screen p-6 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#c1121f]">
            Filtrar produtos
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-3 -mt-1">
              Escolha a cor
            </h3>
            <div className="flex gap-3">
              {cores.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCor(c.nome === cor ? null : c.nome)}
                  style={{ backgroundColor: c.cor }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    cor === c.nome ? 'border-[#c1121f]' : 'border-transparent'
                  } transition-all`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-2 ">
              Material
            </h3>
            <Select
              options={options}
              value={options.find((opt) => opt.value === material) || null}
              onChange={(selected) => setMaterial(selected?.value || '')}
              styles={customStyles}
              placeholder="Selecione o material"
            />
          </div>

          <div>
            <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-2 ">
              Ordenar por
            </h3>
            <Select
              options={ordenacao}
              value={ordenacao.find((opt) => opt.value === ordem) || null}
              onChange={(selected) => setOrdem(selected?.value || '')}
              styles={customStyles}
              placeholder="Selecione a ordem"
            />
          </div>

          <div className="-mb-9 -mt-1">
            <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-2">
              Faixa de preço (R$)
            </h3>

            <div className="relative pl-4 pr-4 pt-6 pb-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
              <ReactSlider
                className="relative h-2 bg-[#c1121f]/60 rounded-full -mb-2"
                thumbClassName="-mt-1.5 h-5 w-5 bg-[#c1121f] border-2 border-[#c1121f] dark:border-gray-800 rounded-full cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:scale-110 focus:ring-4 focus:ring-[#c1121f]/40"
                min={0}
                max={1000}
                step={10}
                value={faixaPreco}
                onChange={(value) => setFaixaPreco(value)}
                renderThumb={(props, state) => {
                  const { key, ...rest } = props;
                  return <div key={key} {...rest} />;
                }}
              />

              <div className="flex justify-between text-sm mt-4 text-gray-600 dark:text-gray-300 font-medium">
                <span>R$ {faixaPreco[0].toLocaleString()}</span>
                <span>R$ {faixaPreco[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="flex-1 text-white bg-[#c1121f] hover:bg-[#780000] font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300"
            >
              Aplicar
            </button>
            <button
              type="button"
              onClick={() => {
                setCordas(null);
                setCor(null);
                setMaterial('');
                setOrdem('');
                setFaixaPreco([0, 1000]);
              }}
              className="flex-1 text-[#c1121f] border border-[#c1121f] hover:bg-[#c1121f] hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
