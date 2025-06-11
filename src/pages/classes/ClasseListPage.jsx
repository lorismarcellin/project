import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import fetchApi from "../../helpers/fetchApi";

export default function ClasseListPage() {
   const [classes, setClasses] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   const fetchClasses = async () => {
      setLoading(true);
      try {
         const res = await fetchApi("/classes");
         setClasses(res);
      } catch (error) {
         console.error("Erreur lors de la récupération des classes:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchClasses();
   }, []);

   return (
      <div className="main_content px-4 py-3">
         <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Liste des Classes</h3>
            <Button label="Nouvelle Classe" icon="pi pi-plus" onClick={() => navigate("/classes/new")} />
         </div>

         <DataTable value={classes} loading={loading} paginator rows={10}>
            <Column field="ID_CLASSE" header="ID" sortable />
            <Column field="NUMERO" header="Numéro" sortable />
         </DataTable>
      </div>
   );
}