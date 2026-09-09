export const ITEM_TYPE_ID = Object.freeze({
  BOOK: 1,
  VINYL: 2,
});

export const ITEM_DETAIL_TYPE = Object.freeze({
  BOOK: "BOOK",
  VINYL: "VINYL",
});

export const POSSESSION_STATUS = Object.freeze({
  OWNED: "OWNED",
  LOANED: "LOANED",
});

export const POSSESSION_STATUS_LABEL = Object.freeze({
  [POSSESSION_STATUS.OWNED]: "En mi colección",
  [POSSESSION_STATUS.LOANED]: "Prestado",
});

export const MOCK_USER_ID = 1;
