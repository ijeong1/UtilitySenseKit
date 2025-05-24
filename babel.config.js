module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      // '@babel/preset-react', // Support for React JSX syntax
      // '@babel/preset-flow',  // Flow type checking
      //'@babel/preset-typescript', // TypeScript support
    ],
  };
};