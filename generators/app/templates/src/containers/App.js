import React, {PropTypes, Component} from 'react';
import MenuWrapper from '../components/menuWrapper/MenuWrapper';
import MenuHeader from '../components/menuHeader/MenuHeader';
import {isClient} from '../helpers/utils';
import {Row, Col} from 'antd';
import {action} from 'mobx';
import menuActions from '../actions/menu';

export default class App extends Component {
  @action
  static onEnter({states, pathname, query, params}) {
    states.menu.pathname = pathname;
    return Promise.all([
      menuActions.fetchUsers(states)
    ]).then((res) => {
      res.map((fn) => {
        if (Object.prototype.toString.call(fn) === '[object Function]') {
          fn();
        }
      });
    });
  }

  render() {
    return (
      <div>
        <MenuHeader />

        <div className="admin-content__wrapper">
          <Row className="admin-content">
            <MenuWrapper />

            <div className="admin-detail">
              {this.props.children}
            </div>
          </Row>
        </div>

        <Row className="admin-footer" type="flex" justify="center" align="middle">
          <Col span={12} className="admin-footer__content">( ◕‿‿◕ )</Col>
        </Row>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};