import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      "react-hooks": reactHooksPlugin,
    },

    settings: {
      react: {
        version: "detect",
      },

      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },

        alias: {
          map: [["@", "./src"]],
          extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
      },
    },

    rules: {
      // console.log 사용 금지
      "no-console": "error",

      // React 17+ 불필요
      "react/react-in-jsx-scope": "off",

      // TypeScript 사용
      "react/prop-types": "off",

      // svg react import 허용
      "import/no-unresolved": [
        "error",
        {
          ignore: ["\\.svg\\?react$"],
        },
      ],

      // import 정렬
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],

          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],

          pathGroupsExcludedImportTypes: ["react"],

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },

          "newlines-between": "always",
        },
      ],

      // prettier 충돌 방지
      "prettier/prettier": "error",

      // hooks 규칙
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },

  // Ignore
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
