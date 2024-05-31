import StyleDictionary from "style-dictionary";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("Build started...");
console.log("\n==============================================");

// REGISTER THE CUSTOM TRANSFORMS

StyleDictionary.registerTransform({
  name: "number/px",
  type: "value",
  filter: (token) =>
    token.$type === "number" &&
    ["WIDTH_HEIGHT", "CORNER_RADIUS", "GAP"].some((el) =>
      token.$extensions["com.figma"].scopes.includes(el)
    ),
  transform: (token) => `${token.$value}px`,
});

// REGISTER THE CUSTOM TRANSFORM GROUPS

StyleDictionary.registerTransformGroup({
  name: "custom/css",
  transforms: ["attribute/cti", "name/kebab", "number/px"],
});

//console.log(StyleDictionary.hooks.transformGroups["css"]);

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const sd = new StyleDictionary(__dirname + "/config.json");

// FINALLY, BUILD ALL THE PLATFORMS
await sd.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");
