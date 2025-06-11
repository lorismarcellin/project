/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { administration_routes_items } from "../../routes/admin/administration_routes"
import { Button } from "primereact/button"
import { useForm } from "../../hooks/useForm"
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle"
import fetchApi from "../../helpers/fetchApi"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import Loading from "../../components/app/Loading"
import { useNavigate, useParams } from "react-router-dom"

const initialForm = {
   NOM: "",
   PRENOM: "",
   ID_CLASSE: "",
}

export default function EditEtudiantPage() {
   const dispatch = useDispatch()
   const [data, handleChange, setData, setValue] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()
   const { idEtudiant } = useParams()
   const [etudiant, setEtudiant] = useState(null)
   const [loadingEtudiant, setLoadingEtudiant] = useState(true)
   const [classeOptions, setClasseOptions] = useState([])

   const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
      NOM: { required: true, alpha: true, length: [2, 50] },
      PRENOM: { required: true, alpha: true, length: [2, 50] },
      ID_CLASSE: { required: true },
   })

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!isValidate()) return false
      try {
         setIsSubmitting(true)
         const payload = {
            NOM: data.NOM,
            PRENOM: data.PRENOM,
            ID_CLASSE: data.ID_CLASSE,
         }

         await fetchApi(`/etudiants/${idEtudiant}`, {
            method: "PUT",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
         })

         dispatch(
            setToastAction({
               severity: "success",
               summary: "Étudiant modifié",
               detail: "L'étudiant a été modifié avec succès",
               life: 3000,
            }),
         )

         navigate("/etudiants")
      } catch (error) {
         if (error.httpStatus === "UNPROCESSABLE_ENTITY") {
            setErrors(error.result)
         } else {
            dispatch(
               setToastAction({
                  severity: "error",
                  summary: "Erreur du système",
                  detail: "Erreur du système, réessayez plus tard",
                  life: 3000,
               }),
            )
         }
      } finally {
         setIsSubmitting(false)
      }
   }

   const fetchEtudiant = useCallback(async () => {
      try {
         setLoadingEtudiant(true)
         const res = await fetchApi(`/etudiants/${idEtudiant}`)
         const etd = res.result
         setEtudiant(etd)
         setData({
            NOM: etd.NOM ?? "",
            PRENOM: etd.PRENOM ?? "",
            ID_CLASSE: etd.ID_CLASSE ?? "",
         })
      } catch (error) {
         console.log(error)
      } finally {
         setLoadingEtudiant(false)
      }
   }, [idEtudiant, setData])

   useEffect(() => {
      fetchApi("/classes").then((res) => {
         let classes = []
         if (res) classes = res
         setClasseOptions(classes.map((c) => ({ label: c.NOM, value: c.ID_CLASSE })))
      })
   }, [])

   useEffect(() => {
      dispatch(
         setBreadCrumbItemsAction([
            administration_routes_items.etudiants,
            administration_routes_items.edit_etudiant,
         ]),
      )
      return () => dispatch(setBreadCrumbItemsAction([]))
   }, [])

   useEffect(() => {
      fetchEtudiant()
   }, [fetchEtudiant])

   if (loadingEtudiant) {
      return (
         <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <div className="spinner-border" role="status" />
         </div>
      )
   }

   return (
      <>
         {isSubmitting && <Loading />}
         <div className="px-4 py-3 main_content bg-white has_footer">
            <h1 className="mb-3">
               {etudiant?.NOM} {etudiant?.PRENOM}
            </h1>
            <hr className="w-100" />
            <form className="form w-75 mt-5" onSubmit={handleSubmit}>
               {/* NOM */}
               <div className="form-group mt-3">
                  <label>Nom</label>
                  <InputText
                     name="NOM"
                     value={data.NOM}
                     onChange={handleChange}
                     onBlur={checkFieldData}
                     className={`w-100 ${hasError("NOM") ? "p-invalid" : ""}`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21 }}>{getError("NOM")}</div>
               </div>

               {/* PRENOM */}
               <div className="form-group mt-3">
                  <label>Prénom</label>
                  <InputText
                     name="PRENOM"
                     value={data.PRENOM}
                     onChange={handleChange}
                     onBlur={checkFieldData}
                     className={`w-100 ${hasError("PRENOM") ? "p-invalid" : ""}`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21 }}>{getError("PRENOM")}</div>
               </div>

               {/* ID_CLASSE */}
               <div className="form-group mt-3">
                  <label>Classe</label>
                  <Dropdown
                     value={data.ID_CLASSE}
                     options={classeOptions}
                     onChange={(e) => setValue("ID_CLASSE", e.value)}
                     placeholder="Sélectionner une classe"
                     className={`w-100 ${hasError("ID_CLASSE") ? "p-invalid" : ""}`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21 }}>{getError("ID_CLASSE")}</div>
               </div>

               {/* Submit */}
               <div className="form-group mt-5 d-flex justify-content-end">
                  <Button label="Modifier" icon="pi pi-check" className="p-button-success" type="submit" />
               </div>
            </form>
         </div>
      </>
   )
}