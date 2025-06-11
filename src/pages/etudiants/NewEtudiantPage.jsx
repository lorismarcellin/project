import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import fetchApi from "../../helpers/fetchApi"
import { setToastAction } from "../../store/actions/appActions"
import { useForm } from "../../hooks/useForm"
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle"

const initialForm = {
   NOM: "",
   PRENOM: "",
   ID_CLASSE: "",
}

export default function NewEtudiantPage() {
   const [data, handleChange] = useForm(initialForm)
   const { hasError, getError, isValidate, checkFieldData } = useFormErrorsHandle(data, {
      NOM: { required: true, alpha: true, length: [2, 50] },
      PRENOM: { required: true, alpha: true, length: [2, 50] },
      ID_CLASSE: { required: true, length: [1, 10] },
   })
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!isValidate()) return
      setIsSubmitting(true)
      try {
         await fetchApi("/etudiants", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
         })
         dispatch(
            setToastAction({
               severity: "success",
               summary: "Succès",
               detail: "Étudiant ajouté avec succès",
               life: 3000,
            })
         )
         navigate("/etudiants")
      } catch (error) {
         dispatch(
            setToastAction({
               severity: "error",
               summary: "Erreur",
               detail: "Une erreur est survenue",
               life: 3000,
            })
         )
      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <div className="main_content px-4 py-3">
         <h2 className="mb-4">Ajouter un étudiant</h2>
         <form className="w-50" onSubmit={handleSubmit}>
            <div className="form-group mb-4">
               <label>Nom</label>
               <InputText
                  name="NOM"
                  value={data.NOM}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("NOM") ? "p-invalid" : ""}`}
               />
               <small className="text-danger">{getError("NOM")}</small>
            </div>
            <div className="form-group mb-4">
               <label>Prénom</label>
               <InputText
                  name="PRENOM"
                  value={data.PRENOM}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("PRENOM") ? "p-invalid" : ""}`}
               />
               <small className="text-danger">{getError("PRENOM")}</small>
            </div>
            <div className="form-group mb-4">
               <label>ID Classe</label>
               <InputText
                  name="ID_CLASSE"
                  value={data.ID_CLASSE}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("ID_CLASSE") ? "p-invalid" : ""}`}
               />
               <small className="text-danger">{getError("ID_CLASSE")}</small>
            </div>
            <div className="d-flex justify-content-end">
               <Button
                  label="Annuler"
                  type="button"
                  className="p-button-secondary mr-2"
                  onClick={() => navigate("/etudiants")}
               />
               <Button
                  label="Ajouter"
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValidate()}
               />
            </div>
         </form>
      </div>
   )
}