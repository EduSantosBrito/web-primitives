import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import packageJson from "../package.json" assert { type: "json" };

import {
  cancel,
  intro,
  isCancel,
  multiselect,
  outro,
  spinner,
  text,
} from "@clack/prompts";
import color from "picocolors";

import {
  generateComponentFile,
  generateTestFile,
  generateConstantsFile,
  generateUtilsFile,
  generateStoriesFile,
} from "./templates/component.mjs";

const getOptionalFileTypes = (componentName) => [
  { value: "constants", label: `${componentName}.constants.ts` },
  { value: "utils", label: `${componentName}.utils.ts` },
];

const KEBAB_CASE_REGEX =
  /^([a-z](?![\d])|[\d](?![a-z]))+(-?([a-z](?![\d])|[\d](?![a-z])))*$|^$/;

async function main() {
  console.clear();

  intro(`Generate web-primitives component`);

  const componentName = await text({
    message: "What is your component name?",
    placeholder: "component-name",
    validate(value) {
      if (value.startsWith("primitive")) {
        return "Component name should not start with primitive keyword";
      }
      if (!KEBAB_CASE_REGEX.test(value)) {
        return "Component name should follow kebab-case";
      }
    },
  });

  if (isCancel(componentName)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const optionalFilesOptions = getOptionalFileTypes(componentName);
  const optionalFiles = await multiselect({
    message: "Choose which optional file types do you want:",
    options: optionalFilesOptions,
    required: false,
  });

  if (isCancel(optionalFiles)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const componentsRootFolder = path.resolve(process.cwd(), "lib");
  const storiesRootFolder = path.resolve(process.cwd(), "stories");
  const testRootFolder = path.resolve(process.cwd(), "test");
  const loader = spinner();
  loader.start("Creating component");
  if (existsSync(`${componentsRootFolder}/${componentName}`)) {
    cancel(
      "Folder already exist! Delete folder or try again with another component name."
    );
    process.exit(1);
  }

  await fs.mkdir(`${componentsRootFolder}/${componentName}`);
  await fs.writeFile(
    `${componentsRootFolder}/${componentName}/index.ts`,
    generateComponentFile(componentName)
  );
  await fs.writeFile(
    `${testRootFolder}/${componentName}.test.ts`,
    generateTestFile(componentName)
  );
  await fs.writeFile(
    `${storiesRootFolder}/${componentName}.stories.ts`,
    generateStoriesFile(componentName)
  );
  if (optionalFiles.includes("constants")) {
    await fs.writeFile(
      `${componentsRootFolder}/${componentName}/${componentName}.constants.ts`,
      generateConstantsFile(componentName)
    );
  }
  if (optionalFiles.includes("utils")) {
    await fs.writeFile(
      `${componentsRootFolder}/${componentName}/${componentName}.utils.ts`,
      generateUtilsFile()
    );
  }
  packageJson.exports = {
    ...packageJson.exports,
    [`./${componentName}`]: {
      import: `./dist/${componentName}.js`,
      require: `./dist/${componentName}.cjs`,
      types: `./dist/${componentName}.d.ts`,
    },
  };
  await fs.writeFile(`package.json`, JSON.stringify(packageJson));
  loader.stop(`${componentName} ${color.green("created")}`);
  outro(`${color.yellow("Have fun :)")}`);
}

main();
