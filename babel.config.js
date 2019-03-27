module.exports = function(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-react-jsx-source',
      '@babel/plugin-proposal-class-properties',
      '@babel/transform-flow-strip-types'
    ]
  }
}
