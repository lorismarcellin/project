import store from "../store"
import { setToastAction } from "../store/actions/appActions"
import { unsetUserAction } from "../store/actions/userActions"
import removeUserDataAndCaches from "../utils/removeUserDataAndCaches"

const enableRemote = false
export const API_URL = enableRemote ? "https://prodev.mediabox.bi:1068" : "http://localhost:3001"
const initialOptions = {
   method: "GET",
   cacheData: false,
   getCachedDataFirst: false,
   timeout: 1 * 60 * 1000,
}

/**
 * consomer une api avec les options par défaut
 * @param {string} url - le lien à appeler
 * @param {object} options - autres options comme les headers et le body
 * @returns { Promise }
 */
export default async function fetchApi(url, options = initialOptions) {
   options = {
      ...initialOptions,
      ...options,
   }
   const controller = new AbortController()
   const timeoutId = setTimeout(() => {
      controller.abort()
   }, options.timeout)
   const userF = localStorage.getItem("user")
   const locale = localStorage.getItem("locale")
   const user = JSON.parse(userF)
   // eslint-disable-next-line no-unused-vars
   const { cacheData, getCachedDataFirst, ...otherOptions } = options
   var headers = {
      ...otherOptions.headers,
      // 'x-access-token': authorizationToken,
      "accept-language": locale || "fr",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   }
   if (user) {
      headers = {
         ...headers,
         authorization: `bearer ${user.token}`,
         "x-refresh-token": user.REFRESH_TOKEN,
      }
   }
   var response, json
   response = await fetch(API_URL + url, {
      ...otherOptions,
      headers: { ...headers },
      signal: controller.signal,
   })
   json = await response.json()
   if (response.status == 401) {
      if (json.authStatus == "INVALID_ACCESS_TOKEN") {
         if (user) {
            const accssesHeaders = {
               authorization: `bearer ${user.token}`,
               "x-refresh-token": user.REFRESH_TOKEN,
            }
            const accessRes = await fetch(`${API_URL}/admin/auth/access_token`, {
               method: "POST",
               headers: accssesHeaders,
            })
            const accessResult = await accessRes.json()
            if (accessRes.ok) {
               // retry the request with new access token
               const newAccessToken = accessResult.result
               localStorage.setItem("user", JSON.stringify({ ...user, token: newAccessToken }))
               response = await fetch(API_URL + url, {
                  ...otherOptions,
                  headers: { ...headers, authorization: `bearer ${newAccessToken}` },
               })
               json = await response.json()
            } else {
               // need to login again
               removeUserDataAndCaches(user.ID_UTILISATEUR, user.REFRESH_TOKEN)
               store.dispatch(unsetUserAction())
               store.dispatch(
                  setToastAction({
                     severity: "error",
                     summary: "Authentification is required",
                     detail: "Please login again to continue",
                     life: 3000,
                  }),
               )
            }
         }
      }
   }

   clearTimeout(timeoutId)
   if (response.ok) {
      const data = json
      return data
   } else {
      if (response.status == 500) {
         // store.dispatch(setToastAction(TOAST_TYPES.SYSTEM_ERROR))
      }
      throw json
   }
}
