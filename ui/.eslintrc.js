module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended" // Add React linting configuration
    ],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", // Add React plugin
        "react-hooks", // Add React hooks plugin
    ],
    "rules": {
        // Add any additional rules specific to React linting
        "react/prop-types": "off", // Disable prop-types rule
        "react/react-in-jsx-scope": "off", // Disable react-in-jsx-scope rule
        'no-unused-vars': 'off', // Disable no-unused-vars rule
    }
}
