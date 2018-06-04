import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
  Tabs, 
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Setting/style.less';

import AssetClass from './AssetClass';
//import Department from './Department';
import UserRole from './UserRole';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane; 

@connect(({ loading }) => ({
}))
export default class DataDictionary extends PureComponent {
  render() {

    return (
   <PageHeaderLayout>
      <div className={styles.card}>
      <Tabs type="card">
        <TabPane tab="资产分类"  key="1">
         <AssetClass></AssetClass> 
        </TabPane>

        <TabPane tab="角色管理" key ="2">
        <UserRole></UserRole>
        </TabPane>
      </Tabs>
      </div>
    </PageHeaderLayout>
    );
  }
}
