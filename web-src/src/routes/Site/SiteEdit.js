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

import styles from './SiteEdit.less';
const { TextArea } = Input;


const FormItem = Form.Item;
@connect(({ site, loading }) => ({
    site,
    loading: loading.models.site,
  }))
@Form.create()
export default class SiteEdit extends PureComponent {
    state = {
        recordId:0,
    };

    componentWillReceiveProps(nextProps) {
        const id = nextProps.editRecordId;
        if(id != null &&id != this.state.recordId){
              this.setState({
                recordId: id
            });
        const { dispatch } = this.props;
        dispatch({
          type: 'site/get',
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

    handleSubmit = (id,values) => {
        this.props.dispatch({
            type:'site/update',
            payload:{
                Id: parseInt(id),
            ...values
        },callback:function(resp){
            if(resp){
                if(resp.status=="ok"){
                    message.success("修改成功");
                    this.props.handleEditModalVisible(false);
                }else{
                    message.error(resp.message)
                }
            }
        }
        })
    }

    render() {
        const { record,modalVisible, form, handleEdit, handleModalVisible,maintainers } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
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

        const inputNumStyle = {
            width:'100%'
        };

        //维护人员下拉表
        const options = [];
        for(let i = 0;i<maintainers.length;i++){
          options.push(<Select.Option key={i}>{maintainers[i]}</Select.Option>)
        }

        return ( <
            Modal title = "编辑基站信息" 
            visible = { modalVisible }
            onOk = { okHandle }
            onCancel = {
                () => this.props.handleEditModalVisible()
            } >
           
            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="基站名称"
            >
            <span style={{color:'black'}}>{record.Name}</span>
            </FormItem>
            </Col> 
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="城市"
            >
            <span>{record.City}</span>
            </FormItem>
            </Col>          
            </Row>

            <Row gutter={24}>            
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="地区"
            >
            <span>{record.District}</span>
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="地址"
            >
            <span>{record.Address}</span>
            </FormItem>
            </Col>
            </Row>

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "经度"> {
                form.getFieldDecorator('longitude',{
                    rules:[{required: true, message: '必须输入经度'}],
                    initialValue:record.Lng
                })(<InputNumber placeholder = "请输入经度" style={inputNumStyle}/>
            )
            }
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "纬度"> {
                form.getFieldDecorator('latitude',{
                    rules:[{required: true, message: '必须输入纬度'}],
                    initialValue:record.Lat
                })(<InputNumber placeholder = "请输入纬度" style={inputNumStyle}/>
            )
            }
            </FormItem>
            </Col>
            </Row>

            <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label="维护人员"
            >
            <Select
            showSearch
            style={{width:150}}
            placeholder="请选择维护人员"
            optionFilterProp="children"
            defaultValue={record.Maintainer}
            filterOption={(input,option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
            >
            {options}
            </Select>
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formItemLayout}
            label = "创建时间"> {
                form.getFieldDecorator('createTime',{
                    rules:[{required: true, message: '必须输入创建时间'}],
                    initialValue:Moment(record.CreateTime)
                })(<DatePicker showTime format="YYYY-MM-DD" />
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
                getFieldDecorator('memo', {
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