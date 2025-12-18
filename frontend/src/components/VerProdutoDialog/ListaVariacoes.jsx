import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { IconH1 } from '@tabler/icons-react';

export default function ListaVariacoes({
  produtoId,
  page,
  setPage,
  setNomeCorVariacao,
}) {
  const [variacoes, setVariacoes] = useState([]);
  const [variacao, setVariacao] = useState(null);
  const [desc, setDesc] = useState(false);

  async function pegarVariacoes() {
    try {
      const response = await fetch(
        `http://localhost:8080/produtos/variacao/${produtoId}`
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setVariacoes(data);
      } else {
        alert('Erro');
      }
    } catch (error) {
      console.error('Erro ao buscar variacoes por id produto:', error);
    }
  }

  function formatarMoedaBR(valor) {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    let numero = (parseInt(valor, 10) / 100).toFixed(2);
    numero = numero.replace('.', ',');
    numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return numero;
  }

  async function obterDadosVariacaoPorId(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/produtos/variacao/detalhe/${id}`
      );
      const data = await response.json();
      if (response.ok) {
        setVariacao(data);
        if (data.desconto != 0) {
          const data2 = {
            ...data,
            desconto: `${data.desconto}`,
          };
          setVariacao(data2);
          setDesc(true);
        } else {
          setVariacao(data);
          setDesc(false);
        }
        setNomeCorVariacao(
          `${data.nome_cor
            .toLowerCase()
            .replace(/\b\w/g, (letra) => letra.toUpperCase())} | Hex: ${
            data.cor
          }`
        );
      } else {
        alert('Erro');
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }

  useEffect(() => {
    pegarVariacoes();
  }, [produtoId, page]);

  const listCss = 'cursor-pointer underline';
  const cssInput =
    'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

  return (
    <>
      {page === 4 ? (
        <>
          <div className="flex flex-col gap-y-10">
            {variacoes.length > 0 ? (
              variacoes.map((cada, index) => (
                <div key={index}>
                  <p
                    onClick={() => {
                      obterDadosVariacaoPorId(cada.id_variacao);
                      setPage(5);
                    }}
                    className={listCss}
                  >
                    -{' '}
                    {cada.nome_cor
                      .toLowerCase()
                      .replace(/\b\w/g, (letra) => letra.toUpperCase())}
                  </p>
                </div>
              ))
            ) : (
              <>
                <h1>
                  Ainda não existem variações criadas para este produto. Você
                  pode adicionar as primeiras.
                </h1>
                <div className="flex justify-center items-center mb-7">
                  <img src="/matriz/semVariacao.png" alt="" className="w-60" />
                </div>
              </>
            )}
          </div>
        </>
      ) : page === 5 ? (
        variacao && (
          <>
            <div className="flex gap-3 flex-col w-full mb-3">
              <div className="flex w-full gap-3">
                <div className="flex flex-col w-1/2">
                  <label className="mb-1">Preço:</label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      R$
                    </span>
                    <input
                      type="text"
                      className={`${cssInput} w-full pl-10`}
                      value={formatarMoedaBR(variacao.valor)}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-1">Custo de Produção:</label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      R$
                    </span>
                    <input
                      type="text"
                      className={`${cssInput} w-full pl-10`}
                      value={formatarMoedaBR(variacao.custo_producao)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Código Sku:</label>
              <input
                type="text"
                className={`${cssInput} w-full`}
                value={`# ${variacao.sku}`}
                disabled
              />
            </div>

            <div className="flex flex-col w-full mt-4 mb-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="subscribe"
                  className="border-2 border-gray shadow data-[state=checked]:bg-[var(--azul-marinho)] data-[state=checked]:text-white data-[state=checked]:border-[var(--azul-marinho)]"
                  checked={desc}
                  onCheckedChange={setDesc}
                  onClick={() => setDesconto(null)}
                  disabled
                />
                <span>Desconto{desc === false ? ' ?' : ':'}</span>
              </div>

              {desc && (
                <div className="flex flex-col mt-3">
                  <input
                    type="tex"
                    className={`${cssInput} w-full`}
                    value={
                      variacao.desconto != null || variacao.desconto != 0
                        ? `${variacao.desconto}% OFF`
                        : ''
                    }
                    readOnly
                  />
                </div>
              )}
            </div>
          </>
        )
      ) : (
        ''
      )}
    </>
  );
}
