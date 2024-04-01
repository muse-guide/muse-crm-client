import {nanoid} from "nanoid";

export const nid = () => nanoid(8)

export type Status = "ACTIVE" | "PROCESSING" | "ERROR"

export interface ImageRef {
    id: string;
    name: string;
}

export const langMap = new Map<string, string>([
    ["pl-PL", "pl"],
    ["en-GB", "gb"],
    ["es-ES", "es"]
])