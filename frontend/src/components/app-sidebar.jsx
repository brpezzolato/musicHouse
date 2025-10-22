"use client"

import * as React from "react"
import {
  Guitar,
  Drum,
  Keyboard,
  Piano,
  Settings2,
  AudioLines,
  Wind,
  Speaker,
  Plug,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  teams: [
    {
      name: "Music House",
      logo: () => (
        <div
          className="h-10 w-10 aspect-square shrink-0 rounded-full overflow-hidden
               border border-[#FDF0D5] bg-[#780000] shadow-sm flex-none"
        >
          <img
            src="/catalogo/logoPrincipal.png"
            alt="Logo Music House"
            className="block h-full w-full object-cover"
            draggable={false}
          />
        </div>
      ),
      plan: "catálogo",
    },
  ],
  navMain: [
    {
      title: "Cordas",
      url: "#",
      icon: Guitar,
      isActive: true,
      items: [
        { title: "Violão", url: "#" },
        { title: "Guitarra", url: "#" },
        { title: "Baixo Acústico", url: "#" },
        { title: "Baixo Elétrico", url: "#" },
        { title: "Viola Caipira", url: "#" },
        { title: "Violino", url: "#" },
        { title: "Viola Clássica", url: "#" },
        { title: "Violoncelo", url: "#" },
        { title: "Contrabaixo Acústico", url: "#" },
        { title: "Ukulele", url: "#" },
        { title: "Banjo", url: "#" },
        { title: "Cavaquinho", url: "#" },
      ],
    },
    {
      title: "Percussão",
      url: "#",
      icon: Drum,
      items: [
        { title: "Bateria Acústica", url: "#" },
        { title: "Bateria Eletrônica", url: "#" },
        { title: "Cajón", url: "#" },
        { title: "Pandeiro", url: "#" },
        { title: "Tamborim", url: "#" },
        { title: "Congas", url: "#" },
        { title: "Bongôs", url: "#" },
        { title: "Surdo", url: "#" },
        { title: "Triângulo", url: "#" },
        { title: "Tantan", url: "#" },
        { title: "Reco-reco", url: "#" },
        { title: "Xilofone", url: "#" },
        { title: "Marimba", url: "#" },
        { title: "Vibrafone", url: "#" },
        { title: "Metalofone", url: "#" },
        { title: "Tímpano", url: "#" },
        { title: "Glockenspiel", url: "#" },
      ],
    },
    {
      title: "Teclas",
      url: "#",
      icon: Piano,
      items: [
        { title: "Piano acústico", url: "#" },
        { title: "Piano digital", url: "#" },
        { title: "Teclado arranjador", url: "#" },
        { title: "Teclado controlador MIDI", url: "#" },
        { title: "Sintetizador", url: "#" },
        { title: "Harmônio", url: "#" },
      ],
    },
    {
      title: "Sopro",
      url: "#",
      icon: AudioLines,
      items: [
        { title: "Flauta doce", url: "#" },
        { title: "Flauta transversal", url: "#" },
        { title: "Saxofone", url: "#" },
        { title: "Trompete", url: "#" },
        { title: "Trombone", url: "#" },
        { title: "Clarinete", url: "#" },
        { title: "Gaita", url: "#" },
        { title: "Oboé", url: "#" },
        { title: "Fagote", url: "#" },
        { title: "Tuba", url: "#" },
        { title: "Trompa", url: "#" },
        { title: "Corneta", url: "#" },
      ],
    },
    {
      title: "Foles",
      url: "#",
      icon: Wind,
      items: [
        { title: "Acordeon (Sanfona)", url: "#" },
        { title: "Gaita de fole", url: "#" },
        { title: "Concertina", url: "#" },
        { title: "Harmonium", url: "#" },
        { title: "Bandoneón", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Equipamentos de Áudio",
      url: "#",
      icon: Speaker,
      items: [
        { title: "Amplificadores", url: "#" },
        { title: "Caixas acústicas", url: "#" },
        { title: "Mesas de som", url: "#" },
        { title: "Microfones", url: "#" },
        { title: "Monitores de áudio", url: "#" },
        { title: "Interfaces de áudio", url: "#" },
        { title: "Fones", url: "#" },
      ],
    },
    {
      name: "Acessórios",
      url: "#",
      icon: Plug,
      items: [
        { title: "Cordas avulsas", url: "#" },
        { title: "Palhetas", url: "#" },
        { title: "Capotraste", url: "#" },
        { title: "Estantes", url: "#" },
        { title: "Pedais de efeito", url: "#" },
        { title: "Cabos", url: "#" },
        { title: "Suportes", url: "#" },
        { title: "Cases e bags", url: "#" },
        { title: "Afinadores eletrônicos", url: "#" },
        { title: "Baquetas", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}