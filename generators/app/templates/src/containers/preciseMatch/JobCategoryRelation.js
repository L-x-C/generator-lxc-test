import React, {Component, PropTypes} from 'react';
import {action, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {progress} from '../../helpers/progress';
import {Table, Icon, Button, Row, Col} from 'antd';

@inject("preciseMatch")
@observer
export default class JobCategoryRelation extends Component {
  @action
  static onEnter({states, query, params}) {
    progress();
  }

  render() {
    const columns = [{
      title: '专业名称',
      dataIndex: 'label',
      key: 'label'
    }, {
      title: '专业id',
      dataIndex: 'key',
      key: 'key'
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 250,
      render: (res) => {
        return (
          <div>
            <Button type="ghost" className="admin-edit" size="small" style={{marginRight: 10}} onClick={() => {
              this.handleEdit(res);
            }}><Icon type="edit"/>编辑</Button>
          </div>
        );
      }
    }];
    return (
      <div>
        <Row type="flex" justify="end">
          <Col span={1}>
            <Button type="primary" onClick={this.showModal}><Icon type="plus"/>新增</Button>
          </Col>
        </Row>

        <Table className="admin-table" columns={columns} dataSource={toJS(this.props.preciseMatch.major)}/>
      </div>
    );
  }
}

JobCategoryRelation.propTypes = {
  preciseMatch: PropTypes.object
};
