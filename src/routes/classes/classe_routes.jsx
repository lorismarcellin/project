import { lazy } from "react"
import { Route } from "react-router-dom"

const classeListPage = lazy(() => import("../../pages/classes/ClasseListPage"))
const newClassePage = lazy(() => import("../../pages/classes/NewClassePage"))
const editClassePage = lazy(() => import("../../pages/classes/EditClassePage"))

export const classe_routes_items = {
   classes: {
      path: "classes",
      name: "Classes",
      component: classeListPage,
   },
   new_classe: {
      path: "classes/new",
      name: "Nouvelle classe",
      component: newClassePage,
   },
   edit_classe: {
      path: "classes/edit/:ID_CLASSE",
      name: "Modifier la classe",
      component: editClassePage,
   },
}

const classe_routes = []
for (let key in classe_routes_items) {
   const route = classe_routes_items[key]
   classe_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default classe_routes