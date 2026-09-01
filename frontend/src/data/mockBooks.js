import { READING_STATUS } from "../constants/books.js";
import { ITEM_TYPE_ID, MOCK_USER_ID } from "../constants/items.js";

const canonicalBook = ({ item, book }) => ({
  item: { user: MOCK_USER_ID, item_type: ITEM_TYPE_ID.BOOK, description: "", favorite: false, deleted_at: null, ...item },
  book: { item: item.id, isbn: null, author: null, publisher: null, pages: null, publication_year: null, genre: null, cover_url: null, reading_status: READING_STATUS.PENDING, ...book },
});

export const mockBooks = Object.freeze([
  canonicalBook({
    item: { id: 1, name: "Cien años de soledad", description: "La historia de la familia Buendía y del pueblo de Macondo a través de varias generaciones.", favorite: true, created_at: "2026-01-08T14:20:00.000Z", updated_at: "2026-02-18T19:45:00.000Z" },
    book: { isbn: "9780307474728", author: "Gabriel García Márquez", publisher: "Vintage Español", pages: 496, publication_year: 1967, genre: "Realismo mágico", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 2, name: "El nombre de la rosa", description: "Un misterio intelectual entre manuscritos, símbolos y pasadizos de una abadía medieval.", favorite: true, created_at: "2026-01-12T09:10:00.000Z", updated_at: "2026-08-22T21:05:00.000Z" },
    book: { isbn: "9788426418803", author: "Umberto Eco", publisher: "Lumen", pages: 608, publication_year: 1980, genre: "Misterio histórico", reading_status: READING_STATUS.READING },
  }),
  canonicalBook({
    item: { id: 3, name: "La mano izquierda de la oscuridad", description: "Un enviado humano intenta comprender la cultura y la política del planeta Invierno.", created_at: "2026-02-03T16:30:00.000Z", updated_at: "2026-02-03T16:30:00.000Z" },
    book: { isbn: "9788445007785", author: "Ursula K. Le Guin", publisher: "Minotauro", pages: 336, publication_year: 1969, genre: "Ciencia ficción" },
  }),
  canonicalBook({
    item: { id: 4, name: "Pedro Páramo", description: "Juan Preciado llega a Comala buscando a su padre y encuentra un pueblo habitado por murmullos.", favorite: true, created_at: "2026-02-15T11:25:00.000Z", updated_at: "2026-03-02T18:12:00.000Z" },
    book: { isbn: "9788437604183", author: "Juan Rulfo", publisher: "Cátedra", pages: 144, publication_year: 1955, genre: "Novela latinoamericana", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 5, name: "Piranesi", description: "Un hombre registra con cuidado las maravillas de una Casa infinita llena de estatuas y mareas.", created_at: "2026-03-01T10:00:00.000Z", updated_at: "2026-03-19T20:40:00.000Z" },
    book: { isbn: "9788418451102", author: "Susanna Clarke", publisher: "Salamandra", pages: 272, publication_year: 2020, genre: "Fantasía", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 6, name: "El infinito en un junco", description: "Un recorrido por la invención de los libros y por quienes protegieron las palabras a lo largo del tiempo.", favorite: true, created_at: "2026-03-17T08:45:00.000Z", updated_at: "2026-08-29T15:15:00.000Z" },
    book: { isbn: "9788417860790", author: "Irene Vallejo", publisher: "Siruela", pages: 452, publication_year: 2019, genre: "Ensayo", reading_status: READING_STATUS.READING },
  }),
  canonicalBook({
    item: { id: 7, name: "La ridícula idea de no volver a verte", description: "Una reflexión íntima sobre el duelo, la memoria y la vida a partir del diario de Marie Curie.", created_at: "2026-04-05T13:20:00.000Z", updated_at: "2026-04-05T13:20:00.000Z" },
    book: { isbn: "9788432215483", author: "Rosa Montero", publisher: "Seix Barral", pages: 240, publication_year: 2013, genre: "Ensayo autobiográfico" },
  }),
  canonicalBook({
    item: { id: 8, name: "Klara y el Sol", description: "Klara observa el mundo desde un escaparate mientras espera convertirse en la amiga artificial de alguien.", favorite: true, created_at: "2026-04-22T17:55:00.000Z", updated_at: "2026-05-01T09:30:00.000Z" },
    book: { isbn: "9788433980854", author: "Kazuo Ishiguro", publisher: "Anagrama", pages: 336, publication_year: 2021, genre: "Ciencia ficción" },
  }),
  canonicalBook({
    item: { id: 9, name: "El adversario", created_at: "2026-05-03T12:15:00.000Z", updated_at: "2026-05-14T22:10:00.000Z" },
    book: { isbn: "9788433976901", author: "Emmanuel Carrère", publisher: "Anagrama", pages: 176, publication_year: 2000, genre: "Crónica", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 10, name: "Los detectives salvajes", description: "Poetas, viajes y testimonios reconstruyen la búsqueda de una escritora desaparecida.", created_at: "2026-05-18T07:50:00.000Z", updated_at: "2026-08-31T17:20:00.000Z" },
    book: { isbn: "9788433968067", author: "Roberto Bolaño", publisher: "Anagrama", pages: 624, publication_year: 1998, genre: "Novela latinoamericana", reading_status: READING_STATUS.READING },
  }),
  canonicalBook({
    item: { id: 11, name: "Persuasión", description: "Anne Elliot vuelve a encontrarse con el hombre al que rechazó años atrás.", favorite: true, created_at: "2026-06-02T19:35:00.000Z", updated_at: "2026-06-16T14:05:00.000Z" },
    book: { isbn: "9788491051329", author: "Jane Austen", publisher: "Penguin Clásicos", pages: 288, publication_year: 1817, genre: "Clásico", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 12, name: "Temporada de huracanes", description: "La muerte de una mujer revela las voces y violencias de una comunidad marcada por el miedo.", created_at: "2026-06-20T10:40:00.000Z", updated_at: "2026-06-20T10:40:00.000Z" },
    book: { isbn: "9788439733393", author: "Fernanda Melchor", publisher: "Literatura Random House", pages: 232, publication_year: 2017, genre: "Novela contemporánea" },
  }),
  canonicalBook({
    item: { id: 13, name: "El problema de los tres cuerpos", description: "Una investigación científica abre la puerta a un encuentro que cambiará el destino de la humanidad.", created_at: "2026-07-04T15:05:00.000Z", updated_at: "2026-07-28T16:25:00.000Z" },
    book: { isbn: "9788466659734", author: "Cixin Liu", publisher: "Nova", pages: 416, publication_year: 2006, genre: "Ciencia ficción", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 14, name: "Una habitación propia", description: "Un ensayo sobre creación, independencia y las condiciones materiales necesarias para escribir.", favorite: true, created_at: "2026-07-16T09:25:00.000Z", updated_at: "2026-07-25T11:45:00.000Z" },
    book: { isbn: "9788437637433", author: "Virginia Woolf", publisher: "Cátedra", pages: 160, publication_year: 1929, genre: "Ensayo", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 15, name: "Distancia de rescate", created_at: "2026-07-29T18:30:00.000Z", updated_at: "2026-07-29T18:30:00.000Z" },
    book: { isbn: "9788433997722", author: "Samanta Schweblin", publisher: "Random House", pages: 128, publication_year: 2014, genre: "Novela contemporánea" },
  }),
  canonicalBook({
    item: { id: 16, name: "Mañana, y mañana, y mañana", description: "Dos amigos construyen videojuegos y atraviesan décadas de colaboración, éxito y desencuentros.", favorite: true, created_at: "2026-08-02T08:10:00.000Z", updated_at: "2026-08-30T20:35:00.000Z" },
    book: { isbn: "9788418052422", author: "Gabrielle Zevin", publisher: "AdN", pages: 496, publication_year: 2022, genre: "Novela contemporánea", reading_status: READING_STATUS.READING },
  }),
  canonicalBook({
    item: { id: 17, name: "Ficciones", description: "Laberintos, bibliotecas y mundos posibles reunidos en relatos esenciales.", favorite: true, created_at: "2026-08-09T14:50:00.000Z", updated_at: "2026-08-21T10:20:00.000Z" },
    book: { isbn: "9788499089500", author: "Jorge Luis Borges", publisher: "Debolsillo", pages: 224, publication_year: 1944, genre: "Cuentos", reading_status: READING_STATUS.READ },
  }),
  canonicalBook({
    item: { id: 18, name: "La vegetariana", description: "Una decisión personal altera de forma irreversible la vida de una mujer y su familia.", created_at: "2026-08-17T12:00:00.000Z", updated_at: "2026-08-17T12:00:00.000Z" },
    book: { isbn: "9788416291144", author: "Han Kang", publisher: "Rata", pages: 240, publication_year: 2007, genre: "Novela contemporánea" },
  }),
  canonicalBook({
    item: { id: 19, name: "Las olas", created_at: "2026-08-24T09:40:00.000Z", updated_at: "2026-08-24T09:40:00.000Z" },
    book: { author: "Virginia Woolf", publisher: "Lumen", pages: 320, publication_year: 1931, genre: "Clásico" },
  }),
  canonicalBook({
    item: { id: 20, name: "Contra la lectura", created_at: "2026-08-30T13:15:00.000Z", updated_at: "2026-08-30T13:15:00.000Z" },
    book: { author: "Mikko Rimminen" },
  }),
]);
