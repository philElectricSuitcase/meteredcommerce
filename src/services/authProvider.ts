import { performLoginRequest, performLogoutRequest, getAccessTokenObject } from "./authentication";

export const authProvider = {
    // called when the user attempts to log in
    login: async ({ username, password }: { username: string, password: string }) => performLoginRequest(username, password),

    // called when the user clicks on the logout button
    logout: () => performLogoutRequest(),

    // called when the API returns an error
    checkError: (error: any) => {
        if (error === undefined)
            return Promise.resolve();

        const errorStatus = error.status;
        if (errorStatus === 401 || errorStatus === 403)
            return Promise.reject({ redirectTo: '/unauthorized', logoutUser: false });

        return Promise.resolve();
    },

    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => getAccessTokenObject().then(() => Promise.resolve()).catch(() => Promise.reject()),

    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve("internal")
};
