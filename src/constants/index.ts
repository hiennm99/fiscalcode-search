// Hoặc tạo một object để tái sử dụng
export const BORROWER_TYPES = {
    MAIN: 0,
    JOINT: 1,
    GUARANTOR: 2,
    OTHER: 3,
    POSSIBLE: 4,
    EREDE: 5

};

export const BORROWER_TYPE_LABELS = {
    [BORROWER_TYPES.MAIN]: 'Main Borrower',
    [BORROWER_TYPES.JOINT]: 'Joint Borrower',
    [BORROWER_TYPES.OTHER]: 'Others ',
    [BORROWER_TYPES.POSSIBLE]: 'Possible Guarantor Borrower',
    [BORROWER_TYPES.GUARANTOR]: 'Guarantor',
    [BORROWER_TYPES.EREDE]: 'Erede Borrower',

};