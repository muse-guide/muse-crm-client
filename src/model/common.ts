import {nanoid} from "nanoid";

export const nano_8 = () => nanoid(8)
export const nano_12 = () => nanoid(12)

export type Status = "ACTIVE" | "PROCESSING" | "ERROR"

export interface ImageRef {
    id: string;
    name: string;
    tmp?: boolean;
}

export const langMap = new Map<string, string>([
    ["pl-PL", "pl"],
    ["en-GB", "gb"],
    ["es-ES", "es"]
])

export const voices = new Map<string, string>([
    ["FEMALE_1", "Female 1"],
    ["MALE_1", "Male 1"],
])