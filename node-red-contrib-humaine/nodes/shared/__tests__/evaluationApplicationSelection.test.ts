import {
    buildEvaluationApplicationOptions,
    resolveEvaluationConfigId,
} from "../helpers";

describe("evaluation application selection", () => {
    const appConfigs = [
        { id: 42, application_name: "Default Benchmark" },
        { id: 7, application_name: "Alternate Benchmark" },
    ];

    test("shows dynamic-only default option when no default application is configured", () => {
        const result = buildEvaluationApplicationOptions(appConfigs, "", "");

        expect(result.selectedValue).toBe("");
        expect(result.options[0]).toEqual({
            id: "",
            text: "ONLY Dynamic / Wired-in value",
        });
        expect(result.options.slice(1)).toEqual([
            { id: "42", text: "Default Benchmark (42)" },
            { id: "7", text: "Alternate Benchmark (7)" },
        ]);
    });

    test("shows the configured default application as the default option", () => {
        const result = buildEvaluationApplicationOptions(appConfigs, "42", "");

        expect(result.selectedValue).toBe("");
        expect(result.options[0]).toEqual({
            id: "",
            text: "Default Benchmark (42)",
        });
    });

    test("preserves an explicit node application selection", () => {
        const result = buildEvaluationApplicationOptions(appConfigs, "42", "7");

        expect(result.selectedValue).toBe("7");
        expect(result.options).toContainEqual({
            id: "7",
            text: "Alternate Benchmark (7)",
        });
    });

    test("resolves wired configId before node and default selections", () => {
        expect(resolveEvaluationConfigId({ configId: 9 }, "7", "42")).toBe(9);
    });

    test("resolves node application before default application", () => {
        expect(resolveEvaluationConfigId({}, "7", "42")).toBe(7);
    });

    test("resolves default application when node selection is dynamic", () => {
        expect(resolveEvaluationConfigId({}, "", "42")).toBe(42);
    });

    test("throws when no wired, node, or default application is available", () => {
        expect(() => resolveEvaluationConfigId({}, "", "")).toThrow(
            "configId is required",
        );
    });
});
