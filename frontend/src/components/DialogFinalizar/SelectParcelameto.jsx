import Select from 'react-select';
import { useState, useEffect } from 'react';

export default function SelectParcelameto({ total, onChangePdv }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const parcelas = [
    total / 1,
    total / 2,
    total / 3,
    total / 4,
    total / 5,
    total / 6,
  ];

  const opcoesParcelas = parcelas.map((parcela, index) => ({
    value: `${index + 1}x de ${parseInt(parcela).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}`,
    label: `${index + 1}x de 
    ${parseInt(parcela).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}
    *sem juros`,
  }));

  useEffect(() => {
    setProdutoSelecionado(opcoesParcelas[0].value);
    onChangePdv(opcoesParcelas[0].value);
  }, []);

  return (
    <div>
      <div className="mb-2 ms-1">
        <label htmlFor="select-parcela">Selecione o número de parcelas:</label>
      </div>
      <Select
        classNamePrefix="select-produto"
        name="select-parcelas"
        options={opcoesParcelas}
        value={
          opcoesParcelas.find(
            (option) => option.value === produtoSelecionado
          ) || null
        }
        onChange={(selecionado) => {
          setProdutoSelecionado(selecionado ? selecionado.value : null);
          onChangePdv(selecionado ? selecionado.value : null);
        }}
        placeholder="Escolha uma opção"
      />
    </div>
  );
}
