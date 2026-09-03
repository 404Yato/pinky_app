import {
  Books,
  BookmarkSimple,
  CheckCircle,
  Clock,
  GearSix,
  Heart,
  House,
} from "@phosphor-icons/react";

export const navigationItems = [
  { id: "home", label: "Inicio", icon: House, available: true },
  { id: "library", label: "Biblioteca", icon: Books, available: true },
  { id: "favorites", label: "Favoritos", icon: Heart, available: true },
  { id: "read", label: "Leídos", icon: CheckCircle, available: true },
  { id: "reading", label: "Leyendo", icon: BookmarkSimple, available: true },
  { id: "pending", label: "Pendientes", icon: Clock, available: true },
  { id: "settings", label: "Configuración", icon: GearSix, available: false },
];
