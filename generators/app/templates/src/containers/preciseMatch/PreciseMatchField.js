import React, {Component, PropTypes} from 'react';
import {action, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {progressStart, progressDone} from '../../helpers/progress';
import preciseMatchActions from '../../actions/preciseMatch';
import {Modal, Table, Icon, Button, Row, Col, Form, Input, TreeSelect, InputNumber, Radio} from 'antd';
import './preciseMatch.scss';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@inject("preciseMatch")
@observer
export default class PreciseMatch extends Component {
  @action
  static onEnter({states, query, params}) {
    progressStart();
    return Promise.all([
      preciseMatchActions.fetchFields(states.preciseMatch),
      preciseMatchActions.fetchType_data(states.preciseMatch)
    ]).then(values => {
      //do something
      progressDone();
    });
  }

  state = {
    visible: false,
    editMode: false   //如果是编辑状态，那么等下弹窗中的type不可选
  };

  showModal = () => {
    this.form.resetFields();
    this.setState({
      visible: true,
      editMode: false
    });
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  handleOk = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      //TODO: send data to server and get key
      preciseMatchActions.addFields(this.props.preciseMatch, this.form.getFieldsValue());

      this.setState({
        visible: false,
        editMode: false
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      editMode: false
    });
  };

  handleEdit = (data) => {
    this.form.setFieldsValue(data);
    this.setState({
      visible: true,
      editMode: true
    });
  };

  // handleDelete = (data) => {
  //   preciseMatchActions.deleteField(this.props.preciseMatch, data);
  // };

  render() {
    const columns = [{
      title: '字段名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '字段描述',
      dataIndex: 'label',
      key: 'label'
    }, {
      title: '字段类型',
      dataIndex: 'type',
      key: 'type',
      render: (res) => {
        let type = '';
        toJS(this.props.preciseMatch.type_data).map(v => {
          if (v.value === res) {
            type = v.label;
          }
        });
        return (
          <span>{type}</span>
        );
      }
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

        <Table className="admin-table" columns={columns} dataSource={toJS(this.props.preciseMatch.fields)}/>
        <WrappedFieldModal
          ref={this.saveFormRef}
          visible={this.state.visible}
          editMode={this.state.editMode}
          onCancel={this.handleCancel}
          onCreate={this.handleOk}
          treeData={toJS(this.props.preciseMatch.type_data)}
        />
      </div>
    );
  }
}


class FieldModal extends React.Component {
  render() {
    const {visible, onCancel, onCreate, form, treeData, editMode} = this.props;
    const {getFieldDecorator} = form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    };
    let type = form.getFieldsValue().type;
    return (
      <Modal title="字段" visible={visible} onOk={onCreate} onCancel={onCancel}>
        <Form >
          <FormItem {...formItemLayout} label="字段名称">
            {getFieldDecorator('name', {
              rules: [
                {required: true, message: '必填'}
              ]
            })(
              <Input placeholder="请输入name"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="字段描述">
            {getFieldDecorator('label', {
              rules: [
                {required: true, message: '必填'}
              ]
            })(
              <Input placeholder="请输入label"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="字段类型">
            {getFieldDecorator('type', {
              rules: [
                {required: true, message: '必填'}
              ]
            })(
              <TreeSelect disabled={editMode} showSearch treeNodeFilterProp="label"
                          dropdownStyle={{maxHeight: 200, overflow: 'auto'}} treeData={treeData} placeholder="请选择type"/>
            )}
          </FormItem>
          {/*最大值最小值*/}
          {(type === '0' || type === '1')  &&
          <FormItem {...formItemLayout} label="范围">
            <Col span="6">
              <FormItem >
                {getFieldDecorator('min', {

                })(
                  <InputNumber disabled={editMode} placeholder="min"/>
                )}
              </FormItem>
            </Col>
            <Col span="1">
              <p className="ant-form-split">-</p>
            </Col>
            <Col span="6">
              <FormItem>
                {getFieldDecorator('max', {

                })(
                  <InputNumber disabled={editMode} placeholder="max"/>
                )}
              </FormItem>
            </Col>
          </FormItem>}
          {/*正则表达式*/}
          {type === '0' &&
          <FormItem {...formItemLayout} label="格式">
            {getFieldDecorator('reg', {

            })(
              <Input disabled={editMode} placeholder="请输入正则表达式"/>
            )}
          </FormItem>}
          {/*小数点允许几位*/}
          {type === '1' &&
          <FormItem {...formItemLayout} label="小数点允许几位">
            {getFieldDecorator('accuracy', {

            })(
              <Input disabled={editMode} type="number" placeholder="小数点后最多几位（0位则仅允许整数）"/>
            )}
          </FormItem>}
          {/*日期选择器精度*/}
          {type === '3' &&
          <FormItem {...formItemLayout} label="日期精确度">
            {getFieldDecorator('dateType', {

            })(
              <RadioGroup disabled={editMode}>
                <Radio value="1">年</Radio>
                <Radio value="2">年月</Radio>
                <Radio value="3">年月日</Radio>
                <Radio value="4">时分秒</Radio>
                <Radio value="5">范围</Radio>
              </RadioGroup>
            )}
          </FormItem>}
        </Form>
      </Modal>
    );
  }
}

let WrappedFieldModal = Form.create()(FieldModal);

PreciseMatch.propTypes = {
  form: PropTypes.object,
  preciseMatch: PropTypes.object
};
FieldModal.propTypes = {
  form: PropTypes.object,
  treeData: PropTypes.array,
  visible: PropTypes.bool,
  editMode: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func
};