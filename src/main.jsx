import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import store from "./store"
import { localeSelector } from './store/selectors/appSelectors.js'
import FRANCAIS from './lang/fr.json'
import ENGLISH from './lang/en.json'
import { IntlProvider } from 'react-intl'

navigator.serviceWorker.register('/sw.js')
// import './index.css'
// updateAllCachedData()
const IntlApp = () => {
    const locale = useSelector(localeSelector)
    var messages
    switch (locale) {
              case 'en':
                        messages = ENGLISH
                        break
              default:
                        messages = FRANCAIS
    }
    return (
              <IntlProvider messages={messages} locale={locale} defaultLocale="fr">
                        <App />
              </IntlProvider>
    )
} 
ReactDOM.createRoot(document.getElementById('root')).render(
                    <Provider store={store}>
                              <BrowserRouter>
                                        <IntlApp />
                              </BrowserRouter>
                    </Provider>
)