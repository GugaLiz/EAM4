import { queryTag, exportTag} from '../services/tag';

export default {
  namespace: 'tag',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({payload}, { call, put }) {
      const response = yield call(queryTag, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *doExport({ payload }, { call, put }) {
      console.info(payload);
      yield call(exportTag, payload);
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
