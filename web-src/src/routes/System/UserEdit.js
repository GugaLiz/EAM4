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

import styles from './UserEdit.less';
const { TextArea } = Input;


const FormItem = Form.Item;
@connect(({ user, loading }) => ({
    user,
    loading: loading.models.user,
  }))
@Form.create()
export default class UserEdit extends PureComponent {
    state = {
        recordId: 0,
        record: {}
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            let me = this;
            this.props.dispatch({
                type: 'user/update',
                payload: {
                    Id: this.state.recordId,
                    ...values
                },
                callback:  function(resp){
                if(resp){
                    if(resp.status=="ok"){
                        message.success('修改成功');
                        me.setState({
                            uploading: false,
                        });
                        //me.props.form.resetFields();
                        //me.props.handleEditModalVisible(false);
                    } else {
                        message.error(resp.message);
                        me.setState({
                            uploading: false,
                        });
                    }
                }
                }
             });
            }
        });
    }

    componentWillReceiveProps(nextProps) {
      const id = nextProps.editRecordId;
      if(id != null &&id != this.state.recordId){
            this.setState({
              recordId: id
          });
      const { dispatch } = this.props;
      dispatch({
        type: 'user/get',
        payload: {
          id:id 
        },
        callback: (resp) =>{
          if(resp){
            if(resp.status=="ok"){
              const rec = resp.record;
              console.info(rec);
             this.setState({
                record: rec,
              });
            }else {
              message.error(resp.message);
            }
          }
        }
      });
      }
  }

    render() {
        const { modalVisible, form, handleEdit, handleModalVisible } = this.props;
        const { record } = this.state;

        const { getFieldDecorator, getFieldValue } = form;

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
            Modal title = "编辑用户" 
            visible = { modalVisible }
            onOk={this.handleSubmit}
            onCancel={() => this.props.handleEditModalVisible()}
            >

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "用户名" >             
            <span className="ant-form-text" style={{color:'black'}}>{record.account}</span>
             </FormItem> 
            </Col>
            </Row>

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "昵称" > {
                form.getFieldDecorator('Name', {initialValue:record.name})( <
                    Input placeholder = "请输入昵称" / >
                )
            } 
            </FormItem>
            </Col>
            
            <Col span={12}>
            <FormItem {...formItemLayout}

            label = "用户角色" > {
                getFieldDecorator('Role', { initialValue:record.role })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="0">管理员</Select.Option>
                    <Select.Option value="1">普通用户</Select.Option>
                    <Select.Option value="2">维护人员</Select.Option>
                  </Select>
                )
            } </FormItem>
            
            </Col>
            </Row>

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "邮箱" > {
                form.getFieldDecorator('Email', {
                    rules: [{
                        type: 'email',
                        message: '请输入正确格式'
                    }, { required: true, message: '请输入邮箱' }],
                    initialValue:record.email
                })( <
                    Input placeholder = "请输入邮箱" / >
                )
            } 
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "手机"> {
                form.getFieldDecorator('Phone',{
                    rules:[{}],
                    initialValue:record.phone
                })(<Input placeholder = "请输入手机" />
            )
            } </FormItem>
            </Col>
            </Row>


            <Row gutter={24}>
            <Col span={24}>
            <FormItem {...formItemLayout2 }
            style={style}
            label = "备注" > {
                getFieldDecorator('Memo', {
                    rules: [{}],
                    initialValue:record.memo
                })( <
                    TextArea style = {
                        { minHeight: 32 }
                    }
                    placeholder = "请输入备注"
                    rows = { 4 }
                    />
                )
            } 
            </FormItem> 
            </Col>
            </Row>

            </ Modal >
        );
    }
}