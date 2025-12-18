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
  Building2,
  Mail,
  Box,
  Users,
  ShoppingCart
} from "lucide-react";

export const NAV_DATA = [
  {
    label: "MENU PRINCIPAL",
    items: [
      {
        title: "Dashboard",
        url: "/matriz",
        icon: Home,
        items: [],
      },
      {
        title: "Funcionários",
        url: "/matriz/funcionarios",
        icon: Briefcase,
        items: [],
      },
      {
        title: "Produtos",
        url: "/matriz/produtos",
        icon: Guitar,
        items: [],
      },
      {
        title: "Estoque",
        url: "",
        icon: Box,
        items: [     
             {
        title: "Estoque Matriz",
        url: "/matriz/estoque ", 
        icon: ShoppingCart, 
      }, {
        title: "Pedidos Filiais",
        url: "/matriz/pedidosFiliais", 
        icon: ShoppingCart, 
      }
    
    ],
      },
      
      {
        title: "Financeiro",
        url: "/matriz/financeiro",
        icon: CircleDollarSign,
        items: [],
      },
      {
        title: "Franquias",
        url: "/matriz/franquias",
        icon: Building2,
        items: [],
      },
      {
        title: "Chamados",
        url: "/matriz/chamado",
        icon: Mail,
        items: [

        ],
      },
      {
        title: "Fornecedores",
        url: "/matriz/fornecedores",
        icon: Users,
        items: [

        ],
      }
    ],
  },


];
