import { API } from "aws-amplify";

// TypeScript users must reference the type `DataProvider`
export const dataProvider = {
  getList: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] getList: running...`);
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      let sort = JSON.stringify([field, order]);
      let range = JSON.stringify([(page - 1) * perPage, perPage]);
      let filter = JSON.stringify(params.filter);
      const query = {
        sort: sort,
        range: range,
        filter: filter,
      };
      const myInit = {
        queryStringParameters: query,
      };
      API.get("database", `/${resource}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  getOne: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] getOne: running...`);
      const myInit = {};
      API.get("database", `/${resource}/${params.id}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  getMany: async (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] getMany: running...`);
      const query = {
        filter: JSON.stringify({ id: params.ids }),
      };
      const myInit = {
        queryStringParameters: query,
      };
      API.get("database", `/${resource}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  getManyReference: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] getManyReference: running...`);
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, perPage]),
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id,
        }),
      };
      const myInit = {
        queryStringParameters: query,
      };
      return API.get("database", `/${resource}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  update: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] update: running...`);
      const myInit = {
        body: params.data,
      };
      return API.put("database", `/${resource}/${params.id}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  updateMany: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] updateMany: running...`);
      const myInit = {
        body: params,
      };
      return API.put("database", `/${resource}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  create: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] create: running...`);
      const myInit = {
        body: params.data,
      };
      return API.post("database", `/${resource}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  delete: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] delete: running...`);
      const myInit = {
        body: params.previousData,
      };
      return API.del("database", `/${resource}/${params.id}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },

  deleteMany: (resource: string, params: any) => {
    return new Promise((resolve, reject) => {
      // console.log(`[dataProvider] deleteMany: running...`);
      const myInit = {
        body: params.ids,
      };
      return API.del("database", `/${resource}`, myInit)
        .then((response) => {
          // console.log(response);
          resolve(response);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    });
  },
};
