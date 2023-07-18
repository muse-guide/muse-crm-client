export const normalizeText = (text: string, length: number): string => {
    return `${text.slice(0, length).trim()}${text.length > length ? "..." : ""}`;
};
