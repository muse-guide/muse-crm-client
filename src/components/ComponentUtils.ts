export const normalizeText = (length: number, text?: string): string => {
    if (!text) return ""
    return `${text.slice(0, length).trim()}${text.length > length ? "..." : ""}`;
};
