import { useEffect, useRef } from "react"
import "./App.css"

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css"

//core
import "primereact/resources/primereact.min.css"
import SideBar from "./components/app/SideBar"
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min"
import "primeicons/primeicons.css"
import Header from "./components/app/Header"
import RoutesProvider from "./routes/RoutesProvider"
import "/node_modules/primeflex/primeflex.css"
import { Toast } from "primereact/toast"
import { useDispatch, useSelector } from "react-redux"
import { toastSelector, localeSelector } from "./store/selectors/appSelectors"
import { setToastAction } from "./store/actions/appActions"
import { userSelector } from "./store/selectors/userSelector"
import "./styles/app/style.css"
// eslint-disable-next-line no-unused-vars
import WelcomeRoutesProvider from "./routes/WelcomeRoutesProvider"
import { IntlProvider } from "react-intl"
import messagesFr from "./lang/fr.json"
import messagesEn from "./lang/en.json"

function App() {
   const toast = useRef(null)
   const appToast = useSelector(toastSelector)
   const dispatch = useDispatch()
   const user = useSelector(userSelector)
   const locale = useSelector(localeSelector)

   const messages = locale === "en" ? messagesEn : messagesFr

   useEffect(() => {
      if (appToast) {
         toast.current.show(appToast)
      }
   }, [appToast])
   if (!user) {
      //  return (
      //      <>
      //          <Toast ref={toast} position='top-left' onHide={() => {
      //              dispatch(setToastAction(null))
      //          }} />
      //          <WelcomeRoutesProvider />
      //      </>
      //  )
   }
   return (
      <IntlProvider locale={locale} messages={messages}>
         <div className="d-flex">
            <div id="desktop-sidebar" style={{ zIndex: 2 }}>
               <SideBar />
            </div>
            <Toast
               ref={toast}
               position="top-center"
               onHide={() => {
                  dispatch(setToastAction(null))
               }}
            />
            <div className="main flex-1">
               <Header />
               <RoutesProvider />
            </div>
         </div>
      </IntlProvider>
   )
}

export default App