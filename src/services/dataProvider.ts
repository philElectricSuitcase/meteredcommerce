import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = "https://4hmjxzebnc.execute-api.eu-west-2.amazonaws.com/dev";
const httpClient = fetchUtils.fetchJson;

// TypeScript users must reference the type `DataProvider`
export const dataProvider = {
  getList: (resource: string, params: any) => {
    console.log(resource);
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
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  getOne: (resource: string, params: any) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(
      ({ json }) => ({
        data: json[0],
      })
    );
  },

  getMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    console.log(url);

    let result = await httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
    console.table(result);
    return result;
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
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  update: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json.data })),

  updateMany: (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource: string, params: any) => {
    const sentData = params.data;
    console.log(sentData);
    let fieldString = Object.keys(sentData);
    let valueString = Object.values(sentData);
    console.table(fieldString);
    console.table(valueString);
    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    }));
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
