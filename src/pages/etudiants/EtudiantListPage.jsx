import { useEffect, useState } from "react"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useNavigate } from "react-router-dom"
import fetchApi from "../../helpers/fetchApi"

export default function EtudiantListPage() {
   const [etudiants, setEtudiants] = useState([])
   const [loading, setLoading] = useState(true)
   const navigate = useNavigate()

   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await fetchApi("/etudiants")
            setEtudiants(res || [])
         } catch (error) {
            console.error("Erreur lors de la récupération des étudiants", error)
         } finally {
            setLoading(false)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="main_content px-4 py-3">
         <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Liste des étudiants</h2>
            <Button label="Nouveau" icon="pi pi-plus" onClick={() => navigate("/etudiants/nouveau")} />
         </div>
         <DataTable value={etudiants} loading={loading} paginator rows={10} stripedRows responsiveLayout="scroll">
            <Column field="NOM" header="Nom" />
            <Column field="PRENOM" header="Prénom" />
            <Column field="ID_CLASSE" header="Classe" />
            <Column
               header="Actions"
               body={(rowData) => (
                  <Button
                     icon="pi pi-pencil"
                     className="p-button-sm"
                     onClick={() => navigate(`/etudiants/${rowData.ID_ETUDIANT}/modifier`)}
                  />
               )}
            />
         </DataTable>
      </div>
   )
}