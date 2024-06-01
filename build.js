import StyleDictionary from "style-dictionary";
import path, { dirname } from "path";
import { kebabCase } from "change-case";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("Build started...");
console.log("\n==============================================");

// REGISTER THE CUSTOM TRANSFORMS

StyleDictionary.registerTransform({
  name: "attribute/figma",
  type: "attribute",
  transform: (token) => {
    // Following operations return the file name in lowercase segments
    const firstSlashIndex = token.filePath.indexOf("/");
    const afterSlash = token.filePath.substring(firstSlashIndex + 1);
    const withoutExtension = afterSlash.replace(".json", "");
    const filePathSegments = withoutExtension.toLowerCase().split(".");

    // Merge all subgroups into a single group name
    const group = token.path.slice(0, -1).join("/");

    /** @type {Record<string, string>} */
    const attributes = {
      collection: filePathSegments[0],
      mode: filePathSegments[1],
      group: group,
      item: token.path.at(-1),
    };

    console.log(attributes);

    return attributes;
  },
});

StyleDictionary.registerTransform({
  name: "name/kebab-case-custom",
  type: "name",
  transform: (token) =>
    kebabCase(
      Object.values(token.attributes)
        .map((value) => value.replace(/\//g, "-"))
        .join("-")
    ),
});

StyleDictionary.registerTransform({
  name: "number/px",
  type: "value",
  filter: (token) =>
    token.$type === "number" &&
    ["WIDTH_HEIGHT", "CORNER_RADIUS", "GAP"].some((value) =>
      token.$extensions["com.figma"].scopes.includes(value)
    ),
  transform: (token) => `${token.$value}px`,
});

// REGISTER THE CUSTOM TRANSFORM GROUPS

StyleDictionary.registerTransformGroup({
  name: "custom/css",
  transforms: ["attribute/figma", "name/kebab-case-custom", "number/px"],
});

//console.log(StyleDictionary.hooks.transformGroups["css"]);

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const sd = new StyleDictionary(__dirname + "/config.json", {
  verbosity: "verbose",
});

// FINALLY, BUILD ALL THE PLATFORMS
await sd.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");
