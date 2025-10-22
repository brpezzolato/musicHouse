"use client";
import "swiper/css";

export default function Page() {
    const produtos = [
        {
            id: 1,
            nome: "Guitarra Fender",
            descricao: "Guitarra Elétrica 2023",
            preco: "$990,00",
            imagem: "/catalogo/violao-nylon-frente-sem-fundo.png",
            desconto: "10% desc",
            cores: ["#003049", "#c1121f"],
        },
        {
            id: 2,
            nome: "Guitarra Fender",
            descricao: "Guitarra Elétrica 2023",
            preco: "$990,00",
            imagem: "/catalogo/violao-nylon-frente-sem-fundo.png",
            desconto: "",
            cores: ["#003049", "#c1121f"],
        },
        {
            id: 3,
            nome: "Guitarra Fender",
            descricao: "Guitarra Elétrica 2023",
            preco: "$990,00",
            imagem: "/catalogo/violao-nylon-frente-sem-fundo.png",
            desconto: "10% desc",
            cores: ["#003049", "#c1121f"],
        },
    ];

    return (
        <div className="body-produto">
            <div className="py-6 sm:py-8 lg:py-12 p-20">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-9">
                        {produtos.map((produto) => (
                            <div key={produto.id}>
                                <a
                                    href="#"
                                    className="group relative block h-72 overflow-hidden bg-gray-100"
                                >
                                    <img
                                        src={produto.imagem}
                                        loading="lazy"
                                        alt={produto.nome}
                                        className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                                        draggable={false}
                                    />
                                    {produto.desconto && (
                                        <span className="absolute left-0 top-0 bg-[#c1121f] px-4 py-2.5 text-xs italic tracking-wider text-white">
                                            {produto.desconto}
                                        </span>
                                    )}
                                </a>

                                <div className="flex items-start justify-between gap-2 bg-gray-100 p-4">
                                    <div className="flex flex-col">
                                        <span className="italic text-xs text-gray-700 xs:text-base">
                                            {produto.descricao}
                                        </span>
                                        <a
                                            href="#"
                                            className="font-bold text-gray-800 transition duration-100 hover:text-[#c1121f] lg:text-lg"
                                        >
                                            {produto.nome}
                                        </a>
                                        <span className="text-[#c1121f] base:text-base italic">
                                            {produto.preco}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <ul role="list" className="flex gap-3">
                                            {produto.cores.map((cor, i) => (
                                                <li
                                                    key={i}
                                                    style={{ backgroundColor: cor }}
                                                    className="w-5 h-5 rounded-full cursor-pointer border-2 border-transparent hover:border-gray-400 transition"
                                                >
                                                    <span className="sr-only">Cor {i + 1}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
