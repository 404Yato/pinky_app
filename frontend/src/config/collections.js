import { READING_STATUS } from "../constants/books.js";

export const focusedCollections = Object.freeze({
  favorites: {
    id: "favorites",
    path: "/favorites",
    label: "Favoritos",
    eyebrow: "Historias especiales",
    title: "Tus favoritos",
    description: "Los libros que tienen un lugar especial en tus estantes.",
    emptyTitle: "Todavía no tienes libros favoritos.",
    emptyDescription: "Marca una historia como favorita y aparecerá aquí para que puedas volver a ella.",
    query: { favorite: true },
    icon: "favorite",
  },
  read: {
    id: "read",
    path: "/read",
    label: "Leídos",
    eyebrow: "Historias terminadas",
    title: "Libros leídos",
    description: "Un recorrido por las historias que ya te acompañaron hasta su última página.",
    emptyTitle: "Aún no has terminado ningún libro.",
    emptyDescription: "Cuando marques una lectura como terminada, la encontrarás en este estante.",
    query: { status: READING_STATUS.READ },
    icon: "read",
  },
  reading: {
    id: "reading",
    path: "/reading",
    label: "Leyendo",
    eyebrow: "Lecturas en curso",
    title: "Leyendo ahora",
    description: "Las historias en las que dejaste un marcador y quieres seguir avanzando.",
    emptyTitle: "No tienes lecturas en curso.",
    emptyDescription: "Cambia el estado de un libro a “Leyendo” para continuar desde aquí.",
    query: { status: READING_STATUS.READING },
    icon: "reading",
  },
  pending: {
    id: "pending",
    path: "/pending",
    label: "Pendientes",
    eyebrow: "Próximas lecturas",
    title: "Libros pendientes",
    description: "Historias que esperan con calma el momento indicado para comenzar.",
    emptyTitle: "No tienes lecturas pendientes.",
    emptyDescription: "Los libros que agregues como pendientes aparecerán en este estante.",
    query: { status: READING_STATUS.PENDING },
    icon: "pending",
  },
});

export const focusedCollectionList = Object.freeze(Object.values(focusedCollections));

export function getFocusedCollection(id) {
  return focusedCollections[id] ?? null;
}

export function getFocusedCollectionByPath(path) {
  return focusedCollectionList.find((collection) => collection.path === path) ?? null;
}
