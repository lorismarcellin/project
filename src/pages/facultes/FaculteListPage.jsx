import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import fetchApi from "../../helpers/fetchApi"

export default function FaculteListPage() {
   const [facultes, setFacultes] = useState([])
   const [loading, setLoading] = useState(true)
   const navigate = useNavigate()

   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await fetchApi("/facultes?_include=campus")
            setFacultes(res)
         } catch (err) {
            console.error(err)
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [])

   return (
      <div className="main_content px-4 py-4">
         <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Liste des Facultés</h3>
            <Button label="Nouvelle Faculté" icon="pi pi-plus" onClick={() => navigate("/facultes/nouveau")} />
         </div>
         <DataTable value={facultes} loading={loading} paginator rows={10}>
            <Column field="ID_FACULTE" header="ID" />
            <Column field="NOM" header="Nom" />
            <Column field="campus.NOM" header="Campus" />
            <Column
               header="Actions"
               body={(rowData) => (
                  <Button
                     label="Modifier"
                     icon="pi pi-pencil"
                     outlined
                     size="small"
                     onClick={() => navigate(`/facultes/${rowData.ID_FACULTE}`)}
                  />
               )}
            />
         </DataTable>
      </div>
   )
}