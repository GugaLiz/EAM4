import { queryChange, getChange,updateChange } from '../services/api';

export default {
  namespace: 'change',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({payload}, { call, put }) {
      const response = yield call(queryChange, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get ({ payload,callback },{ call,put }){
      const resp = yield call(getChange,payload);
      if(callback) callback(resp);
    },
    *update({payload, callback}, { call, put }) {
      const resp = yield call(updateChange, payload);
      if (callback) callback(resp);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    clear() {
      return {
        data: {
          list: [],
          pagination: {},
        },
      };
    },
  },
};
