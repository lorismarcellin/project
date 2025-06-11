import { lazy } from "react"
import { Route } from "react-router-dom"

const campusListPage = lazy(() => import("../../pages/campus/CampusListPage"))
const newCampusPage = lazy(() => import("../../pages/campus/NewCampusPage"))
const editCampusPage = lazy(() => import("../../pages/campus/EditCampusPage"))

export const campus_routes_items = {
   campus: {
      path: "campus",
      name: "Campus",
      component: campusListPage,
   },
   new_campus: {
      path: "campus/new",
      name: "Nouveau campus",
      component: newCampusPage,
   },
   edit_campus: {
      path: "campus/edit/:idCampus",
      name: "Modifier le campus",
      component: editCampusPage,
   },
}

const campus_routes = []
for (let key in campus_routes_items) {
   const route = campus_routes_items[key]
   campus_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default campus_routes