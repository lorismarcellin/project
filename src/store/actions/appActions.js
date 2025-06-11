import { SET_BREADCRUMB, SET_LOCALE, SET_REGION, SET_TOAST } from "../reducers/appReducer"

export const setBreadCrumbItemsAction = (items) => {
          return {
                    type: SET_BREADCRUMB,
                    payload: items
          }
}

export const setToastAction = toast => {
          return {
                    type: SET_TOAST,
                    payload: toast
          }
}
export const setLocaleAction = (locale) => {
    return {
              type: SET_LOCALE,
              payload: locale
    }
}

export const setRegionAction = (region) => {
    return {
              type: SET_REGION,
              payload: region
    }
}