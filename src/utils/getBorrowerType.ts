import { BORROWER_TYPE_LABELS } from "../constants";

// Hàm với xử lý lỗi tốt hơn
export const getBorrowerType = (id: string | number | null | undefined) => {
    if (id === null || id === undefined) {
        return 'N/A';
    }
    console.log("Borrower type: " + typeof(id));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return BORROWER_TYPE_LABELS[id] || `(${id})`;
};