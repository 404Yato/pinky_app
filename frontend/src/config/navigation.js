import {
  Books,
  CheckCircle,
  Clock,
  GearSix,
  Heart,
  House,
} from "@phosphor-icons/react";

export const navigationItems = [
  { id: "home", label: "Inicio", icon: House, available: true },
  { id: "library", label: "Biblioteca", icon: Books, available: true },
  { id: "favorites", label: "Favoritos", icon: Heart, available: false },
  { id: "read", label: "Leídos", icon: CheckCircle, available: false },
  { id: "pending", label: "Pendientes", icon: Clock, available: false },
  { id: "settings", label: "Configuración", icon: GearSix, available: false },
];
