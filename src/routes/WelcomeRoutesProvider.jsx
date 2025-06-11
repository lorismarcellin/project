import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import welcome_routes from "./welcome/welcome_routes"
import LoginPage from "../pages/welcome/LoginPage"
import SlimTopLoading from "../components/app/SlimTopLoading"
import NotFound from "../components/app/NotFound"

export default function WelcomeRoutesProvider() {
   return (
      <Suspense fallback={<SlimTopLoading />}>
         <Routes>
            <Route path="/" element={<LoginPage />} />
            {welcome_routes}
            <Route Component={NotFound} path="*" />
         </Routes>
      </Suspense>
   )
}
