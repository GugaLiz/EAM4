import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    Switch,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider
} from 'antd';

import styles from './UserRoleAdd.less';
const { TextArea } = Input;


const FormItem = Form.Item;
@Form.create()
export default class UserRoleAdd extends PureComponent {
    state = {
        confirmDirty: false
    };

    render() {
        const { modalVisible, form, handleAdd, handleModalVisible } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                //form.resetFields();
                this.props.handleAdd(fieldsValue);
            });
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 16 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
            },
        };
        const style = {
            right:'4px'
        };
        return ( < 
            Modal 
            title = "新增角色" 
            visible = { modalVisible }
            onOk = { okHandle }
            onCancel = {
                () => this.props.handleAddModalVisible()
            } 
            >
          <Row gutter={24}>
          <Col span={24}>
            <FormItem {...formItemLayout2}
            style={style}
            label = "角色名称" >             
            {
                form.getFieldDecorator('Name', {
                    rules: [{ required: true, message: '必须输入角色名称' }],
                })( <
                    Input placeholder = "请输入角色名称" / >
                )
            } 
            </FormItem> 
            </Col>
            </Row>
            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "创建者" > {
                form.getFieldDecorator('Creater', {})( <
                    Input placeholder = "请输入创建者" / >
                )
            } 
            </FormItem>
            </Col>
            
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "创建时间"> {
                form.getFieldDecorator('CreateTime',
            )(<DatePicker showTime format="YYYY-MM-DD" />
            )
            }
            </FormItem>
            </Col> 
            </Row>            

            <Row gutter={24}>
            <Col span={24}>
            <FormItem {...formItemLayout2 }
            style = {style}
            label = "备注" > {
                getFieldDecorator('Memo', {
                    rules: [{}],
                })( <
                    TextArea style = {
                        { minHeight: 32 }
                    }
                    placeholder = "请输入备注"
                    rows = { 4 }
                    />
                )
            } </FormItem> 
            </Col>
            </Row>

            </Modal >
        );
    }
}