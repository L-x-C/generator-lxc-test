import React, {Component, PropTypes} from 'react';
import {action, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {progress} from '../../helpers/progress';
import {Modal, Table, Icon, Button, Row, Col, Form, Input} from 'antd';
import preciseMatchActions from '../../actions/preciseMatch';
const FormItem = Form.Item;

@inject("preciseMatch")
@observer
export default class JobCategory extends Component {
  @action
  static onEnter({states, query, params}) {
    progress();
  }

  state = {
    visible: false,
    subMode: false
  };

  showModal = () => {
    this.setState({
      visible: true,
      subMode: false
    });
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  handleCreateChild = (res) => {
    this.form.resetFields();
    this.form.setFieldsValue({
      key_f: res.key,
      label_f: res.label
    });
    this.setState({
      visible: true,
      subMode: true
    });
  };

  handleEdit = (res) => {
    this.form.resetFields();
    this.form.setFieldsValue(res);
    this.setState({
      visible: true,
      subMode: false
    });
  };

  handleOk = () => {
    this.form.validateFields((err, value) => {
      if (err) {
        return;
      }

      //TODO: send data to server and get key
      preciseMatchActions.addCategory(this.props.preciseMatch, this.form.getFieldsValue(), {label: 'test', key: 'test_key'});

      this.setState({
        visible: false,
        subMode: false
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      subMode: false
    });
  };

  render() {
    const columns = [{
      title: '职类名称',
      dataIndex: 'label',
      key: 'label',
      width: 400
    }, {
      title: '职类id',
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
            <Button type="ghost" className="admin-edit" size="small" style={{marginRight: 10}} onClick={() => {
              this.handleCreateChild(res);
            }}><Icon type="plus"/>添加子集</Button>
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

        <Table className="admin-table" columns={columns} dataSource={toJS(this.props.preciseMatch.job_category)}/>

        <WrappedPopupModal
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleOk}
          subMode={this.state.subMode}
        />
      </div>
    );
  }
}

class PopupModal extends React.Component {
  render() {
    let {visible, onCancel, onCreate, form, subMode} = this.props;
    let {getFieldDecorator} = form;
    let fieldsValue = form.getFieldsValue();
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    };
    return (
      <Modal title="职类" visible={visible} onOk={onCreate} onCancel={onCancel}>
        <Form className="enumeration-form">
          {subMode &&
          <FormItem {...formItemLayout} className="form_hidden" label="上一层key">
            {getFieldDecorator('key_f', {})(
              <Input disabled/>
            )}
          </FormItem>}
          {subMode &&
          <FormItem {...formItemLayout} label="上一层名称">
            {getFieldDecorator('label_f', {})(
              <Input disabled/>
            )}
          </FormItem>}
          <FormItem {...formItemLayout} className="form_hidden" label="当前key">
            {getFieldDecorator('key', {})(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('label', {
              rules: [
                {required: true, message: '必填'}
              ]
            })(
              <Input placeholder="请输入名称"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

let WrappedPopupModal = Form.create()(PopupModal);

JobCategory.propTypes = {
  preciseMatch: PropTypes.object
};
PopupModal.propTypes = {
  form: PropTypes.object,
  visible: PropTypes.bool,
  subMode: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func
};
