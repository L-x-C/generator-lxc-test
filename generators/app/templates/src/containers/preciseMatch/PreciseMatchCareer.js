import React, {Component, PropTypes} from 'react';
import {action} from 'mobx';
import {progress} from '../../helpers/progress';


export default class PreciseMatch extends Component {
  @action
  static onEnter({states, query, params}) {
    progress();
  }

  render() {
    return (
      <div>
        <h1>精准匹配-档案</h1>
      </div>
    );
  }
}


PreciseMatch.propTypes = {
  student: PropTypes.object
};
