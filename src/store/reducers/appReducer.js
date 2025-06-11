 export const SET_BREADCRUMB = "SET_BREADCRUMB"
export const SET_TOAST = "SET_TOAST"
export const SET_LOCALE  = "SET_LOCALE"
export const SET_REGION  = "SET_REGION"


const initial = {
          breadCrumbItems: [],
          toast: null,
          locale: "fr",
          region:null
}
export default function appReducer(contributionState = initial, action) {
          switch (action.type) {
                    case SET_BREADCRUMB:
                              const newItems = action.payload ? action.payload.map(item => ({ name: item.name, path: item.path })) : []
                              return {...contributionState, breadCrumbItems: newItems}
                    case SET_TOAST:
                              return {...contributionState, toast: action.payload}
                    case SET_LOCALE:
                              return {...contributionState, locale: action.payload}
                    case SET_REGION:
                              return {...contributionState, region: action.payload}
                    default:
                              return contributionState
          }
}