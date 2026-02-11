import { Node } from "node-red";
import { HaicConfigNode } from "../haic-config/modules/types";
import { z } from "zod";
import { SelectionOptions } from "./types";

// CONSTANTS FOR THE UTILITY FUNCTIONS
const RETRIES_NUM = 3;
const RETRIES_INTERVAL = 1000;

const recordSchema = z.record(z.string(), z.string());

export const getStringsRecord = (
    jsonString: string,
): Record<string, string> | null => {
    let parsedJson;
    try {
        parsedJson = JSON.parse(jsonString);
    } catch (e) {
        console.log("Error parsing JSON string:", jsonString);
        return null;
    }
    const result = recordSchema.safeParse(parsedJson);
    if (result.success) {
        // Type is guaranteed to be Record<string, string>
        const validatedRecord: Record<string, string> = result.data;
        return validatedRecord;
    } else {
        console.log(
            "Expected a set of string key-value pairs, and got this error:",
            result.error,
        );
        return null;
    }
};

export const isHaicConfigNode = (node: Node): node is HaicConfigNode => {
    if (!node) return false;
    return "OpenAPI" in node;
};

export const isEmpty = (obj: any): boolean => {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
};

export const mergeObjects = (a: any, b: any) => ({
    ...((a ?? {}) || {}),
    ...((b ?? {}) || {}),
});

export const delay = (time: number) => {
    return new Promise((res) => {
        setTimeout(res, time);
    });
};

export const retryWithDelay = async (
    fn,
    retries = RETRIES_NUM,
    interval = RETRIES_INTERVAL,
) => {
    try {
        return await fn();
    } catch (err) {
        if (retries <= 0) throw err;
        await delay(interval);
        return retryWithDelay(fn, retries - 1, interval);
    }
};

export const populateSelectWithOptions = (
    element: HTMLSelectElement,
    options: SelectionOptions,
) => {
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.id;
        optionElement.text = option.text;
        element.appendChild(optionElement);
    });
};
