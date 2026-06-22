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
    preselectedValue?: string,
    // When true (default), a saved selection that is missing from the fetched
    // options is preserved as a synthetic "unavailable" entry rather than
    // silently discarded. Pass false where a stale selection should NOT be kept
    // (e.g. dependent dropdowns after the parent selection changes).
    preserveMissingPreselection: boolean = true,
) => {
    element.innerHTML = "";

    const preselectionInOptions =
        !!preselectedValue &&
        options.some((opt) => opt.id === preselectedValue);

    // The saved value is no longer offered by the backend. Keep it visible and
    // selected (clearly marked) so opening the editor does not wipe a valid
    // configuration just because the options list came back incomplete.
    const preserveMissing =
        !!preselectedValue &&
        !preselectionInOptions &&
        preserveMissingPreselection;
    if (preserveMissing) {
        const missingOption = document.createElement("option");
        missingOption.value = preselectedValue as string;
        missingOption.textContent = `${preselectedValue} (unavailable)`;
        element.appendChild(missingOption);
    }

    // Handle zero options case: keep a preserved selection if we have one,
    // otherwise show a disabled "No available options" placeholder so the
    // control is never left blank.
    if (options.length === 0) {
        if (preserveMissing) {
            element.value = preselectedValue as string;
        } else {
            const noOptionsOption = document.createElement("option");
            noOptionsOption.value = "";
            noOptionsOption.textContent = "No available options";
            noOptionsOption.disabled = true;
            noOptionsOption.selected = true;
            element.appendChild(noOptionsOption);
        }
        return;
    }

    // If only one option exists and there is no selection to honor, auto-select
    // it (ignore placeholder).
    if (options.length === 1 && !preselectionInOptions && !preserveMissing) {
        const opt = options[0];
        const optionEl = document.createElement("option");
        optionEl.value = opt.id;
        optionEl.textContent = opt.text;
        element.appendChild(optionEl);
        element.value = opt.id;
        return;
    }

    // For ≥2 options: show a placeholder only when there is no selection to
    // honor (neither a valid preselection nor a preserved unavailable one).
    if (!preselectionInOptions && !preserveMissing) {
        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent = "Select an option";
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        element.appendChild(placeholderOption);
    }

    options.forEach((opt) => {
        const optionEl = document.createElement("option");
        optionEl.value = opt.id;
        optionEl.textContent = opt.text;
        element.appendChild(optionEl);
    });

    if (preselectionInOptions || preserveMissing) {
        element.value = preselectedValue as string;
    }
};

export const showErrorStatus = (
    node: Node,
    errorMsg: string,
    normalMsg: string,
    errorVisibilityMs: number,
) => {
    node.status({
        fill: "red",
        shape: "dot",
        text: errorMsg,
    });

    setTimeout(() => {
        node.status({
            fill: "green",
            shape: "dot",
            text: normalMsg,
        });
    }, errorVisibilityMs);
};

export const showSuccessStatus = (
    node: Node,
    tempMsg: string,
    normalMsg: string,
    tempVisibilityMs: number,
) => {
    node.status({
        fill: "green",
        shape: "ring",
        text: tempMsg,
    });

    setTimeout(() => {
        node.status({
            fill: "green",
            shape: "dot",
            text: normalMsg,
        });
    }, tempVisibilityMs);
};

// Simple JSONPath implementation for basic paths
type JsonValue = any;
export const getJsonPath = (obj: JsonValue, path: string): JsonValue => {
    if (!path) return obj;

    // Remove leading $ if present
    const cleanPath = path.replace(/^\$\.?/, "");

    // Handle empty path after cleaning
    if (!cleanPath) return obj;

    // Split by dots and bracket notation properly
    const parts: string[] = [];
    let current = "";
    let i = 0;

    while (i < cleanPath.length) {
        const char = cleanPath[i];

        if (char === ".") {
            if (current) {
                parts.push(current);
                current = "";
            }
            i++;
        } else if (char === "[") {
            // Handle bracket notation
            if (current) {
                parts.push(current);
                current = "";
            }

            let j = i + 1;
            while (j < cleanPath.length && cleanPath[j] !== "]") {
                j++;
            }

            const bracketContent = cleanPath.slice(i + 1, j);
            if (bracketContent) {
                parts.push(bracketContent);
            }

            i = j + 1;
        } else {
            current += char;
            i++;
        }
    }

    // Push remaining part
    if (current) {
        parts.push(current);
    }

    let result: JsonValue = obj;
    for (const part of parts) {
        if (result == null) return undefined;

        // Convert string number to integer for array access
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(result)) {
            result = result[index];
        } else if (typeof result === "object" && result !== null) {
            result = result[part as keyof typeof result];
        } else {
            return undefined;
        }
    }

    return result;
};

const PACKAGE_PREFIX = "/node-red-contrib-humaine";

export const adminUrl = (path: string): string => {
    let bp = window.location.pathname;
    if (bp.endsWith("/")) {
        bp = bp.slice(0, -1);
    }
    if (!path.startsWith("/")) {
        path = `/${path}`;
    }
    return `${bp}${PACKAGE_PREFIX}${path}`;
};
