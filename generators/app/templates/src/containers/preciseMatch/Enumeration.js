import React, {Component, PropTypes} from 'react';
import {action, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {progress} from '../../helpers/progress';
import preciseMatchActions from '../../actions/preciseMatch';
import {Modal, Table, Icon, Button, Row, Col, Form, Input} from 'antd';
const FormItem = Form.Item;

@inject("preciseMatch")
@observer
export default class Enumeration extends Component {
  @action
  static onEnter({states, query, params}) {
    progress();
  }

  state = {
    visible: false
  };

  showModal = () => {
    this.form.resetFields();
    this.form.setFieldsValue({
      e_children: ['init_0']
    });
    this.setState({
      visible: true
    });
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  handleOk = () => {
    this.form.validateFields((err, value) => {
      if (err) {
        return;
      }

      let collectData = this.form.getFieldsValue(),
        sequence = this.generateSequence(this.form.getFieldValue('e_children')),
        targetData = this.generateData(collectData, sequence);

      //TODO: send data to server and get key
      preciseMatchActions.addEnumeration(this.props.preciseMatch, targetData);

      this.setState({visible: false});
    });
  };

  generateData(collectData, sequence) {
    let targetData = {
      label: collectData.label
    };

    if (collectData.value) {
      targetData['value'] = collectData.value;
    }

    let e_children = [];

    sequence.map((v, index) => {
      if (v.startsWith('e_c_')) {
        //处理已有的children
        e_children.push({
          label: collectData[v],
          value: v
        });
      } else if (v.startsWith('init_')) {
        //处理新创建的children
        e_children.push({
          label: collectData[v]
        });
      }
    });

    targetData['e_children'] = e_children;
    return targetData;
  }

  generateSequence(e_children) {
    let sequence = [];
    for (let i in e_children) {
      if (typeof e_children[i] === 'string') {
        sequence.push(e_children[i]);
      } else {
        sequence.push(e_children[i].value);
      }
    }
    return sequence;
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleEdit = (data) => {
    this.form.setFieldsValue(data);
    this.setState({
      visible: true
    });
  };

  // handleDelete = (data) => {
  //   preciseMatchActions.deleteEnumeration(this.props.preciseMatch, data);
  // };

  render() {
    const columns = [{
      title: '下拉名称',
      dataIndex: 'label',
      key: 'label',
      width: 100
    }, {
      title: '下拉值',
      dataIndex: 'e_children',
      key: 'e_children',
      render: (res) => {
        return (
          <div>
            {res.map(data => {
              return (
                <span key={data.value}>{data.label} </span>
              );
            })}
          </div>
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

        <Table className="admin-table" columns={columns} dataSource={toJS(this.props.preciseMatch.enumeration)}/>

        <WrappedEnumerationModal
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleOk}
        />
      </div>
    );
  }
}


let uuid = 0;
class EnumerationModal extends React.Component {
  remove(target) {
    let {form} = this.props;
    let e_children = form.getFieldValue('e_children');

    form.setFieldsValue({
      e_children: e_children.filter(child => child !== target)
    });
  }

  add = () => {
    uuid++;
    let {form} = this.props;
    let e_children = form.getFieldValue('e_children');
    let nextChildren = e_children.concat(`init_${uuid}`);

    form.setFieldsValue({
      e_children: nextChildren
    });
  };

  listUp(target) {
    //上移
    let {form} = this.props;
    let e_children = form.getFieldValue('e_children');
    let targetIndex = e_children.findIndex(child => {
      return target.value === child.value;
    });
    let targetChild = e_children.splice(targetIndex, 1)[0];

    //如果是第一个，那把他移至最后一个,不然就往前移一位
    let moveIndex = targetIndex === 0 ? e_children.length : targetIndex - 1;

    e_children.splice(moveIndex, 0, targetChild);

    form.setFieldsValue({
      e_children: e_children
    });
  }

  listDown(target) {
    //下移
    let {form} = this.props;
    let e_children = form.getFieldValue('e_children');
    let targetIndex = e_children.findIndex(child => {
      return target.value === child.value;
    });
    let targetChild = e_children.splice(targetIndex, 1)[0];

    //如果是最后一个，那把他移至第一个,不然就往后移一位
    let moveIndex = targetIndex === e_children.length ? 0 : targetIndex + 1;

    e_children.splice(moveIndex, 0, targetChild);

    form.setFieldsValue({
      e_children: e_children
    });
  }

  render() {
    let {visible, onCancel, onCreate, form} = this.props;
    let {getFieldDecorator} = form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {span: 16, offset: 5}
    };

    const e_children = form.getFieldValue('e_children');
    let valueItems;
    if (visible) {
      valueItems = e_children.map((child, index) => {
        return (
          <FormItem {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={index === 0 ? '下拉选项' : ''}
                    key={`${child.value || child}`}>
            {getFieldDecorator(`${child.value || child}`, {
              initialValue: child.label,
              rules: [{
                required: true,
                message: "必填"
              }]
            })(
              <Input placeholder="请输入选项值" style={{width: '70%'}}/>
            )}
            {e_children.length !== 1 && !child.value &&
            <Icon
              className="enumeration-value__icon"
              type="minus-circle-o"
              onClick={() => this.remove(child)}
            />}
            {e_children.length !== 1 &&
            <Icon
              className="enumeration-value__icon"
              type="up-circle-o"
              onClick={() => this.listUp(child)}
            />}
            {e_children.length !== 1 &&
            <Icon
              className="enumeration-value__icon"
              type="down-circle-o"
              onClick={() => this.listDown(child)}
            />}
          </FormItem>
        );
      });
    } else {
      valueItems = null;
    }

    return (
      <Modal title="预定义下拉选项" visible={visible} onOk={onCreate} onCancel={onCancel}>
        <Form className="enumeration-form">
          <FormItem {...formItemLayout} className="form_hidden" label="Name">
            {getFieldDecorator('value', {})(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Name">
            {getFieldDecorator('label', {
              rules: [
                {required: true, message: '必填'}
              ]
            })(
              <Input placeholder="请输入label"/>
            )}
          </FormItem>
          {valueItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{width: '70%'}}>
              <Icon type="plus"/> 添加
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

let WrappedEnumerationModal = Form.create()(EnumerationModal);

Enumeration.propTypes = {
  preciseMatch: PropTypes.object
};
EnumerationModal.propTypes = {
  form: PropTypes.object,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func
};