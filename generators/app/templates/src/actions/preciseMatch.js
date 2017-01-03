import {action, toJS} from 'mobx';
import fetch from 'isomorphic-fetch';
import {type_data_init} from '../states/preciseMatch';

export default {
  @action fetchFields: function(preciseMatch) {
    //TODO: fetch data from server
    preciseMatch.fields = [{
      name: 'AAA',
      label: 'ZZZ',
      type: '2'
    }, {
      name: 'BBB',
      label: 'XXX',
      type: '1'
    }, {
      name: 'CCC',
      label: 'QQQ',
      type: '0'
    }];
  },

  @action fetchType_data: function(preciseMatch) {
    //TODO: fetch data from server
    preciseMatch.type_data = type_data_init;
    //枚举
    preciseMatch.type_data.push({
      label: '枚举',
      children: [{
        label: '学历',
        value: '4-0'
      }, {
        label: '性别',
        value: '4-1'
      }]
    });
  },

  // @action deleteField: function(preciseMatch, data) {
  //   let index = preciseMatch.fields.findIndex((fields) => {
  //     return fields.name === data.name;
  //   });
  //
  //   preciseMatch.fields.splice(index, 1);
  // },

  // @action deleteEnumeration: function(preciseMatch, data) {
  //   let index = preciseMatch.enumeration.findIndex((enumerations) => {
  //     return enumerations.value === data.value;
  //   });
  //
  //   preciseMatch.enumeration.splice(index, 1);
  // },

  @action addEnumeration: function(preciseMatch, targetData) {
    //判断一下是否是当前存在的，如果是，那就是修改，那就在原地添加改动，如果是新建的，那就插在第一个
    let targetIndex = preciseMatch.enumeration.findIndex(child => {
      return targetData.value === child.value;
    });

    if (targetIndex >= 0) {
      //修改
      preciseMatch.enumeration.splice(targetIndex, 1, targetData);
    } else {
      //添加
      preciseMatch.enumeration.unshift(targetData);
    }
  },

  @action addFields: function(preciseMatch, targetData) {
    //判断一下是否是当前存在的，如果是，那就是修改，就在原地添加改动，如果是新建的，那就插在第一个
    let targetIndex = preciseMatch.fields.findIndex(child => {
      return targetData.name === child.name;
    });

    if (targetIndex >= 0) {
      //修改
      preciseMatch.fields.splice(targetIndex, 1, targetData);
    } else {
      //添加
      preciseMatch.fields.unshift(targetData);
    }
  },

  @action addCategory: function(preciseMatch, locationData, targetData) {
    // console.log(toJS(preciseMatch.job_category), locationData)
    if (locationData.key_f) {
      //添加子类
      this.deepFindInArray(preciseMatch.job_category, locationData.key_f, 'append', targetData);
    } else if (locationData.key) {
      //编辑
      this.deepFindInArray(preciseMatch.job_category, locationData.key, 'edit', targetData);
    } else {
      //创建新的
      preciseMatch.job_category.unshift(locationData);
    }
  },

  deepFindInArray: function(arr, targetKey, mode, targetData) {
    arr.map(v => {
      if (v.key === targetKey) {
        if (mode === 'edit') {
          v.label = targetData.label;
        } else if (mode === 'append') {
          v.children = v.children || [];
          v.children.unshift(targetData);
        }
      } else if (v.children) {
        this.deepFindInArray(v.children, targetKey, mode, targetData);
      }
    });
  }
};
