import { Route, Routes } from "react-router-dom"
import RootPage from "../pages/home/RootPage"
import administration_routes from "./admin/administration_routes"
import campus_routes from "./campus/campus_routes"
import classe_routes from "./classes/classe_routes"
import faculte_routes from "./facultes/faculte_routes"
import NotFound from "../components/app/NotFound"
import { Suspense } from "react"
import SlimTopLoading from "../components/app/SlimTopLoading"

export default function RoutesProvider() {
   return (
      <Suspense fallback={<SlimTopLoading />}>
         <Routes>
            <Route path="/" element={<RootPage />} />
            {administration_routes}
            {classe_routes}
            {campus_routes}
            {faculte_routes}
            <Route path="*" Component={NotFound} />
         </Routes>
      </Suspense>
   )
}