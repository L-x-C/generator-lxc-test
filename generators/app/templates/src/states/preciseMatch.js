export default  {
  //fields的列表
  fields: [],
  type_data: type_data_init,
  //枚举
  enumeration: [{
    label: '学历',
    value: 'e_0',
    e_children: [{
      label: '本科',
      value: 'e_c_0'
    }, {
      label: '硕士',
      value: 'e_c_1'
    }]
  }, {
    label: '学历2',
    value: 'e_1',
    e_children: [{
      label: '本科2',
      value: 'e_c_0'
    }]
  }],
  //职类
  job_category: [{
    label: '互联网',
    key: 1,
    children: [{
      label: '前端',
      key: 2
    }, {
      label: '设计',
      key: 3,
      children: [{
        label: 'UI',
        key: 4
      }]
    }, {
      label: '后端',
      key: 5,
      children: [{
        label: 'JAVA',
        key: 6,
        children: [{
          label: 'J2EE',
          key: 7
        }, {
          label: 'SCALA',
          key: 8
        }]
      }]
    }]
  }, {
    label: '金融',
    key: 9
  }],
  //专业
  major: [{
    label: '工学',
    key: 1,
    children: [{
      label: '计算机类',
      key: 2,
      children: [{
        label: '软件工程',
        key: 3
      }]
    }]
  }]
};

export const type_data_init = [{   //fields中的type数据
  label: '文本',
  value: '0'
}, {
  label: '数字',
  value: '1'
}, {
  label: '是否',
  value: '2'
}, {
  label: '日期/时间',
  value: '3'
}, {
  label: '职类',
  value: 'category'
}, {
  label: '大学',
  value: 'university'
}, {
  label: '省市',
  value: 'city'
}, {
  label: '专业',
  value: 'major'
}, {
  label: '证书',
  value: 'certificate'
}];
