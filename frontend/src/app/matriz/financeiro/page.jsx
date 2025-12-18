"use client";

import { useEffect, useState } from "react";

import FinanceiroHeader from "@/components/FinanceiroMatriz/FinanceiroHeader";
import FinanceiroCards from "@/components/FinanceiroMatriz/FinanceiroCards";
import ModalAdicionarDespesa from "@/components/FinanceiroMatriz/ModalAdicionarDespesa";
import TabelaFinanceiro from "@/components/FinanceiroMatriz/Tabela/TabelaFinanceiro";
import TabelaVendasFiliais from "@/components/FinanceiroMatriz/TabelaVenda/TabelaVenda";
import TabelaMovimentacoesEstoque from "@/components/FinanceiroMatriz/TabelaMovimentacoesEstoque/TabelaMovimentacoesEstoque"


export default function FinanceiroPage() {

    const [lucroMes, setLucroMes] = useState(0);
    const [despesasAPagar, setDespesasAPagar] = useState(0);
    const [contasAtrasadas, setContasAtrasadas] = useState(0);

    const [open, setOpen] = useState(false);
    const [erroForm, setErroForm] = useState("");

    const [novaDespesa, setNovaDespesa] = useState({
        categoria: "",
        descricao: "",
        valor: "",
        data_pagamento: "",
        status: "",
        id_fornecedor: "",
    });


    useEffect(() => {
        async function carregarLucro() {
            try {
                const res = await fetch(
                    "http://localhost:8080/despesas/matriz/totalLucroMes", {
                    cache: 'no-store',
                    credentials: 'include',
                }
                );
                const data = await res.json();
                setLucroMes(Number(data.total_lucro_mes) || 0);
            } catch (error) {
                console.error(error);
            }
        }
        carregarLucro();
    }, []);

    useEffect(() => {
        async function carregarDespesasAPagar() {
            try {
                const res = await fetch(
                    "http://localhost:8080/despesas/franquia/DespesasAPagar", {
                    cache: 'no-store',
                    credentials: 'include',
                }
                );
                const data = await res.json();
                setDespesasAPagar(Number(data.total_despesas_a_pagar) || 0);
            } catch (error) {
                console.error(error);
            }
        }
        carregarDespesasAPagar();
    }, []);

    useEffect(() => {
        async function carregarContasAtrasadas() {
            try {
                const res = await fetch("http://localhost:8080/despesas/franquia/atrasadas", {
                    cache: 'no-store',
                    credentials: 'include',
                });
                const data = await res.json();
                setContasAtrasadas(data.length || 0);
            } catch (error) {
                console.error(error);
            }
        }
        carregarContasAtrasadas();
    }, []);


    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }


    const handleSubmit = async () => {
        if (
            !novaDespesa.categoria.trim() ||
            !novaDespesa.descricao.trim() ||
            !novaDespesa.valor ||
            !novaDespesa.status.trim()
        ) {
            setErroForm("Preencha todos os campos obrigatórios antes de salvar.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/despesas/franquia/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: 'no-store',
                credentials: 'include',
                body: JSON.stringify(novaDespesa),

            });

            if (!res.ok) {
                const erro = await res.json();
                setErroForm(erro.mensagem || "Erro ao enviar dados.");
                return;
            }

            setErroForm("");
            setOpen(false);

            setNovaDespesa({
                categoria: "",
                descricao: "",
                valor: "",
                data_pagamento: "",
                status: "",
                id_fornecedor: "",
            });

            setTimeout(() => window.location.reload(), 300);
        } catch (error) {
            setErroForm("Erro ao conectar com o servidor.");
        }
    };

    // ------------------ ATUALIZAR ------------------
    const handleUpdate = async (id, dadosAtualizados) => {
        try {
            const res = await fetch(`http://localhost:8080/despesas/franquia/${id}`, {
                method: "PUT",
                cache: 'no-store',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosAtualizados),
            });

            if (!res.ok) {
                const erro = await res.json();
                console.error("Erro ao atualizar:", erro.mensagem);
                return { sucesso: false, erro: erro.mensagem };
            }

            return { sucesso: true };
        } catch (error) {
            console.error("Erro ao conectar:", error);
            return { sucesso: false, erro: "Erro ao conectar ao servidor." };
        }
    };




    return (
        <div className="p-6 space-y-6">

            <FinanceiroHeader setOpen={setOpen} />

            <ModalAdicionarDespesa
                open={open}
                setOpen={setOpen}
                novaDespesa={novaDespesa}
                setNovaDespesa={setNovaDespesa}
                erroForm={erroForm}
                handleSubmit={handleSubmit}
            />

            <FinanceiroCards
                lucroMes={lucroMes}
                despesasAPagar={despesasAPagar}
                contasAtrasadas={contasAtrasadas}
                formatarMoeda={formatarMoeda}
            />

            <TabelaFinanceiro handleUpdate={handleUpdate} />
       



            <TabelaVendasFiliais></TabelaVendasFiliais>


            <TabelaMovimentacoesEstoque></TabelaMovimentacoesEstoque>
        </div>




    );
}
