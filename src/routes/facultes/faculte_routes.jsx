import { lazy } from "react"
import { Route } from "react-router-dom"

const faculteListPage = lazy(() => import("../../pages/facultes/FaculteListPage"))
const newFacultePage = lazy(() => import("../../pages/facultes/NewFacultePage"))
const editFacultePage = lazy(() => import("../../pages/facultes/EditFacultePage"))

export const faculte_routes_items = {
   facultes: {
      path: "facultes",
      name: "Facultés",
      component: faculteListPage,
   },
   new_faculte: {
      path: "facultes/new",
      name: "Nouvelle faculté",
      component: newFacultePage,
   },
   edit_faculte: {
      path: "facultes/edit/:idFaculte",
      name: "Modifier la faculté",
      component: editFacultePage,
   },
}

const faculte_routes = []
for (let key in faculte_routes_items) {
   const route = faculte_routes_items[key]
   faculte_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default faculte_routes