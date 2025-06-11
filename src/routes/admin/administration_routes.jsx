import { lazy } from "react"
import { Route } from "react-router-dom"

const etudiantListPage = lazy(() => import("../../pages/etudiants/EtudiantListPage"))
const newEtudiantPage = lazy(() => import("../../pages/etudiants/NewEtudiantPage"))
const editEtudiantPage = lazy(() => import("../../pages/etudiants/EditEtudiantPage"))

export const etudiant_routes_items = {
   etudiants: {
      path: "etudiants",
      name: "Étudiants",
      component: etudiantListPage,
   },
   new_etudiant: {
      path: "etudiants/new",
      name: "Nouveau étudiant",
      component: newEtudiantPage,
   },
   edit_etudiant: {
      path: "etudiants/edit/:idEtudiant",
      name: "Modifier l'étudiant",
      component: editEtudiantPage,
   },
}

const etudiant_routes = []
for (let key in etudiant_routes_items) {
   const route = etudiant_routes_items[key]
   etudiant_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default etudiant_routes