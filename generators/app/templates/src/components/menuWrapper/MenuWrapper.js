import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import  './menuWrapper.scss';
import {observer, inject} from 'mobx-react';
import {toJS} from 'mobx';
import {Menu} from 'antd';

const SubMenu = Menu.SubMenu;

@inject("menu")
@observer
export default class MenuWrapper extends Component {
  render() {
    let access = toJS(this.props.menu.access);
    //因为defaultSelectedKeys只触发一次，所以得等他有值了再render
    if (this.props.menu.pathname || this.props.hello) {
      return (
        <div>
          <Menu className="admin-menu" mode="horizontal" defaultSelectedKeys={[this.props.menu.pathname]}>
            <Menu.Item key="other">
              <a href="http://cv.qiaobutang.com/admin/" >
                其他后台
              </a>
            </Menu.Item>
            {access.includes(24) &&
            <SubMenu title="精准匹配">
              <Menu.Item key="pmatch/field">
                <Link to="/pmatch/field">
                  字段
                </Link>
              </Menu.Item>
              <Menu.Item key="pmatch/category">
                <Link to="/pmatch/category">
                  职类
                </Link>
              </Menu.Item>
              <Menu.Item key="pmatch/category_relation">
                <Link to="/pmatch/category_relation">
                  职类相关性
                </Link>
              </Menu.Item>
              <Menu.Item key="pmatch/major">
                <Link to="/pmatch/major">
                  专业
                </Link>
              </Menu.Item>
              <Menu.Item key="pmatch/job">
                <Link to="/pmatch/job">
                  职位
                </Link>
              </Menu.Item>
              <Menu.Item key="pmatch/career">
                <Link to="/pmatch/career">
                  档案
                </Link>
              </Menu.Item>
              <Menu.Item key="pmatch/enumeration">
                <Link to="/pmatch/enumeration">
                  预定义下拉选项
                </Link>
              </Menu.Item>
            </SubMenu>}
          </Menu>
        </div>
      );
    } else {
      return null;
    }
  }
}


MenuWrapper.propTypes = {
  menu: PropTypes.object,
  hello: PropTypes.string
};
