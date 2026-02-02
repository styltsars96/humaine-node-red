import { Node } from "node-red";
import { HaicConfigNode } from "../haic-config/modules/types";
import { z } from "zod";

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
