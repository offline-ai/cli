import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: 'esm',
  shims: true,
  // splitting: true,
  // sourcemap: true,
  clean: true,
  minify: 'terser',
  terserOptions: {
    // compress: {
    //   drop_console: true,
    //   drop_debugger: true,
    // },
    // https://terser.org/docs/options/#mangle-options
    "mangle": {
      "properties": {
        "regex": /^_[$]/,
        // "undeclared": true, // Mangle those names when they are accessed as properties of known top level variables but their declarations are never found in input code.
      },
      "toplevel": true,
      "reserved": [
        // # expected names in web-extension content
        "WeakSet", "Set",
        // # expected names in 3rd-party extensions' contents
        "requestIdleCallback",
        // # content global names:
        "browser",
      ],
    }
  },
})
