import { EditorRED } from "node-red";
// import { TransformTextEditorNodeProperties } from "./modules/types"; //Example, we can use the properties to dynamically change things
import { AIEnvironmentConfigNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AIEnvironmentConfigNodeProperties>(
  "ai-environment-config",
  {
    category: "HumAIne HAIC Benchmark Suite",
    color: "#58A69F",
    defaults: {
      // Example
      //   operation: { value: TransformTextOperation.UpperCase },
      //   name: { value: "" },
    },
    inputs: 1,
    outputs: 1,
    icon: "haic_icon_small.svg",
    paletteLabel: "environment config",
    label: "HAIC Environment config",
    // label: function () { //like here, the label changes based on the given properties
    //   if (this.name) {
    //     return this.name;
    //   }
    //   switch (this.operation) {
    //     case TransformTextOperation.UpperCase: {
    //       return "to upper case";
    //     }
    //     case TransformTextOperation.LowerCase: {
    //       return "to lower case";
    //     }
    //   }
    // },
  },
);
