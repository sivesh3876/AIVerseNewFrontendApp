const fs = require("fs");
const path = require("path");

let componentName = process.argv[2];

if (!componentName) {
  console.log("Please provide component name");
  process.exit(1);
}

componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

const componentDir = path.join(
  __dirname,
  "..",
  "src",
  "components",
  componentName,
);

fs.mkdirSync(componentDir, { recursive: true });

fs.writeFileSync(
  path.join(componentDir, `${componentName}.jsx`),
  `import "./${componentName}.scss";

const ${componentName} = () => {
  return (
    <div className="${componentName.toLowerCase()}">
      ${componentName} Component
    </div>
  );
};

export default ${componentName};
`,
);

fs.writeFileSync(path.join(componentDir, `${componentName}.scss`), ``);

fs.writeFileSync(
  path.join(componentDir, "index.js"),
  `export { default } from "./${componentName}";`,
);

console.log(`Component ${componentName} created successfully!`);
