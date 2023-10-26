import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import { API } from "aws-amplify";

const apiUrl = "https://4hmjxzebnc.execute-api.eu-west-2.amazonaws.com/dev";
const httpClient = fetchUtils.fetchJson;

// TypeScript users must reference the type `DataProvider`
export const dataProvider = {
  getList: (resource: string, params: any) => {
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
    return API.get("database", `/${resource}`, myInit)
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        return error;
      });
  },

  getOne: (resource: string, params: any) => {
    const myInit = {};
    return API.get("database", `/${resource}/${params.id}`, myInit)
      .then((response) => {
        console.log(response);
        return { data: response[0] };
      })
      .catch((error) => {
        return error.response;
      });
  },

  getMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const myInit = {
      queryStringParameters: query,
    };
    return API.get("database", `/${resource}`, myInit)
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        return error;
      });
  },

  getManyReference: (resource: string, params: any) => {
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
        console.log(response);
        return response;
      })
      .catch((error) => {
        return error;
      });
  },

  update: (resource: string, params: any) => {
    const myInit = {
      body: JSON.stringify(params.data),
    };
    return API.put("database", `/${resource}/${params.id}`, myInit)
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        return error;
      });
  },

  updateMany: (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const myInit = {
      queryStringParameters: query,
      body: JSON.stringify(params.data),
    };
    return API.put("database", `/${resource}`, myInit)
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        return error;
      });
  },

  create: (resource: string, params: any) => {
    const myInit = {
      body: JSON.stringify(params.data),
    };
    return API.post("database", `/${resource}`, myInit)
      .then((response) => {
        console.log(response);
        return { data: { ...params.data, id: response.id } };
      })
      .catch((error) => {
        return error;
      });
  },

  delete: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json.params.ids }));
  },
};
