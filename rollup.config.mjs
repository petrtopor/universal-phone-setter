import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js", // Наш входной файл
  output: [
    {
      file: "dist/index.cjs.js", // CommonJS (для Node)
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js", // ES Module (для бандлеров типа Webpack/Rollup)
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.umd.js", // UMD (для браузера через <script>)
      format: "umd",
      name: "UniversalPhoneSetter", // Глобальная переменная для UMD
      sourcemap: true,
      plugins: [terser()], // Минифицируем UMD версию
    },
  ],
  plugins: [
    // Можно добавить другие плагины Rollup при необходимости
  ],
};
