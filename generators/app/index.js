var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  method1() {
    console.log('method 1 just ran');
  }

  method2() {
    console.log('method 2 just ran');
  }
};