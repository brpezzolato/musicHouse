import {
  Home,
  Briefcase,
  User,
  Table,
  BookText,
  PieChart,
  Shapes,
  ShieldCheck,
  Guitar,
  CircleDollarSign,
  Pencil,
  Mail,
  Box,
} from "lucide-react";

export const NAV_DATA = [
  {
    label: "MENU PRINCIPAL",
    items: [
      {
        title: "Dashboard",
        url: "/filial",
        icon: Home,
        items: [],
      },
      {
        title: "Funcionários",
        url: "/filial/funcionarios",
        icon: Briefcase,
        items: [],
      },
      {
        title: "Estoque",
        url: "",
        icon: Box,
        items: [
          {
          title: "Estoque",
          url: "/filial/estoque",
          
        }, {
          title: "Pedidos matriz",
          url: "/filial/pedidosMatriz",
  
        }
        ],
      },
      {
        title: "Financeiro",
        url: "/filial/financeiro",
        icon: CircleDollarSign,
        items: [],
      },
      {
        title: "Chamados",
        url: "/filial/chamado",
        icon: Mail,
        items: [],
      }
    ],
  },


];
