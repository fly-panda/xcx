module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off",
        "no-undef": "off",
        "no-multiple-empty-lines": "error",

        // ,号的无用空格
        "comma-spacing": "error",

        // 括号前的无用空格
        "space-in-parens": "error",

        "keyword-spacing": "error",

        // 注释前的空格
        "spaced-comment": "error",

        // 操作符的空格
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        // 不允许出现tab
        "no-tabs": "error",
        // 无多余的尾部空格
        "no-trailing-spaces": "error",

        // es6
        "arrow-parens": "error",
        "arrow-spacing": "error",
        "no-var": "error",
        "generator-star-spacing": "error"
    },
    "globals": {
      "wx": false,
      "App": false,
      "Page": false,
      "getApp": false
    }
};
