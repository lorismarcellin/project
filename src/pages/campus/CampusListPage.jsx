import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import fetchApi from "../../helpers/fetchApi"

export default function CampusListPage() {
   const [campusList, setCampusList] = useState([])
   const [loading, setLoading] = useState(true)
   const navigate = useNavigate()

   useEffect(() => {
      const fetchCampus = async () => {
         try {
            const res = await fetchApi("/campus")
            setCampusList(res)
         } catch (err) {
            console.error(err)
         } finally {
            setLoading(false)
         }
      }
      fetchCampus()
   }, [])

   return (
      <div className="main_content px-4 py-4">
         <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Liste des Campus</h3>
            <Button label="Nouveau Campus" icon="pi pi-plus" onClick={() => navigate("/campus/nouveau")} />
         </div>
         <DataTable value={campusList} loading={loading} paginator rows={10}>
            <Column field="ID_CAMPUS" header="ID" />
            <Column field="NOM" header="Nom" />
            <Column
               header="Actions"
               body={(rowData) => (
                  <Button
                     label="Modifier"
                     icon="pi pi-pencil"
                     outlined
                     size="small"
                     onClick={() => navigate(`/campus/${rowData.ID_CAMPUS}`)}
                  />
               )}
            />
         </DataTable>
      </div>
   )
}