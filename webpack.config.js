const { NgConfigBuilder } = require('./webpack.config.builder');

const configBuilder = new NgConfigBuilder();

module.exports = [
  configBuilder.build('angular:build'),
  configBuilder.build('angular:build:production')
];
