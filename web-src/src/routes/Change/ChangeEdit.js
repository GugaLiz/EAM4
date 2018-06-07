import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Moment from 'moment';
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

import styles from '../Site/SiteEdit.less';
const { TextArea } = Input;


const FormItem = Form.Item;
@connect(({ change, loading }) => ({
    change,
    loading: loading.models.change,
  }))
@Form.create()
export default class ChangeEdit extends PureComponent {
    state = {
        recordId:0,
    };

    componentDidMount(){
        this.props.dispatch({
            type: 'user/fetchCurrent',
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
          type: 'change/get',
          payload: {
            id:id 
          },
          callback: (resp) =>{
            if(resp){
              if(resp.status=="ok"){
                const rec = resp.record;
               this.setState({
                  record: rec
                });
              }else {
                message.error(resp.message);
              }
            }
          }
        });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values) => {
            if(!err){
                this.props.dispatch({
                    type:'change/update',
                    payload:{
                        Id:this.state.recordId,
                        ...values
                    },
                    callback:function(resp){
                        if(resp){
                            if(resp.status=="ok"){
                                message.success("修改成功");
                                this.props.handleEditModalVisible(false);
                                this.props.form.resetFields();
                            }else{
                                message.error(resp.message);
                            }
                        }
                    }
            });
        }
    });       
    }

    render() {
        const { record,modalVisible, form, handleEdit, handleModalVisible,currentUser} = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        //console.log(currentUser) //当前用户

        //选项里面的数据
        const children = [];
        for (let i = 10; i < 36; i++) {
        children.push(<Select.Option key={i.toString(36) + i}>{i.toString(36) + i}</Select.Option>);
        };

        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                form.resetFields();
                this.handleSubmit(record.Id,fieldsValue);
                //this.props.handleEdit(record.key,fieldsValue);
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
            Modal title = "编辑位置变动信息" 
            visible = { modalVisible }
            onOk = { this.handleSubmit }
            onCancel = {
                () => this.props.handleEditModalVisible()
            } >
           
            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="资产名称"
            >
            <span style={{color:'black'}}>{record.AssetName}</span>
            </FormItem>               
            </Col>       
            </Row>

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="标签编号"
            >
            <span style={{color:'black'}}>{record.TagId}</span>
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="EPC编码"
            >
            <span>{record.EPC}</span>
            </FormItem>
            </Col>
            </Row>

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}            
            label="之前位置"
            key="lastSiteId"
            >
            <Select
            mode="combobox"
            allowClear="true"
            style={{ width: '100%' }}
            placeholder="请选择所在位置"
            defaultValue={record.LastSiteId}
        >
            {children}
        </Select>
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="当前位置"
            key='currentSiteId'
            >
            <Select
            mode="combobox"
            allowClear="true"
            style={{ width: '100%' }}
            placeholder="请选择所在位置"
            defaultValue={record.CurrentSiteId}
        >
            {children}
        </Select>

            </FormItem>
            </Col>
            </Row>

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "审核人员"> {
                form.getFieldDecorator('CheckUserId',{
                    rules:[{required: true, message: '必须输入审核人员'}],
                    initialValue:record.CheckUserId 
                })(<Input placeholder = "请输入审核人员" />
            )
            }
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "是否通过"> {
                form.getFieldDecorator('IsPass',{
                    rules:[{required: true, message: '必须选择通过情况'}],
                    initialValue:record.IsPass
                })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="0">未通过</Select.Option>
                    <Select.Option value="1">通过</Select.Option>                    
                  </Select>
            )
            }
            </FormItem>
            </Col>
            </Row>

            <Row gutter={24}>
            <Col span={24}>
            <FormItem {...formItemLayout2 }
            style={style}
            label = "备注" > {
                getFieldDecorator('Memo', {
                    rules: [{}],
                    initialValue:record.Memo
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