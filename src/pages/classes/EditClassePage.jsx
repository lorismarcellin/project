/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import Loading from "../../components/app/Loading"
import { useNavigate, useParams } from "react-router-dom"
import fetchApi from "../../helpers/fetchApi"
import { useForm } from "../../hooks/useForm"
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle"

const initialForm = {
   ID_CLASSE: "",
   NUMERO: "",
}

export default function EditClassePage() {
   const dispatch = useDispatch()
   const [data, handleChange, setData, setValue] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()
   const { idClasse } = useParams()
   const [classe, setClasse] = useState(null)
   const [loadingClasse, setLoadingClasse] = useState(true)

   // Validation rules
   const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
      ID_CLASSE: {
         required: true,
         length: [1, 10],
         alphaNum: true,
      },
      NUMERO: {
         required: true,
         numeric: true,
         length: [1, 5],
      },
   })

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!isValidate()) return
      setIsSubmitting(true)
      try {
         await fetchApi(`/classes/${idClasse}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         dispatch(
            setToastAction({
               severity: "success",
               summary: "Classe modifiée",
               detail: "La classe a été modifiée avec succès",
               life: 3000,
            })
         )
         navigate("/classes")
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
               })
            )
         }
      } finally {
         setIsSubmitting(false)
      }
   }

   const fetchClasse = useCallback(async () => {
      try {
         setLoadingClasse(true)
         const res = await fetchApi(`/classes/${idClasse}`)
         const cls = res.result
         setClasse(cls)
         setData({
            ID_CLASSE: cls.ID_CLASSE ?? "",
            NUMERO: cls.NUMERO ?? "",
         })
      } catch (error) {
         // handle error
      } finally {
         setLoadingClasse(false)
      }
   }, [idClasse, setData])

   useEffect(() => {
      dispatch(setBreadCrumbItemsAction([{ label: "Classes", url: "/classes" }, { label: "Modifier la classe" }]))
      return () => {
         dispatch(setBreadCrumbItemsAction([]))
      }
   }, [dispatch])

   useEffect(() => {
      fetchClasse()
   }, [fetchClasse])

   if (loadingClasse) {
      return (
         <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <div className="spinner-border" role="status" />
         </div>
      )
   }

   return (
      <>
         {isSubmitting ? <Loading /> : null}
         <div className="px-4 py-3 main_content bg-white has_footer">
            <div>
               <h1 className="mb-3">Modifier la classe {classe?.ID_CLASSE}</h1>
               <hr className="w-100" />
            </div>
            <form className="form w-75 mt-5" onSubmit={handleSubmit}>
               {/* ID_CLASSE Field */}
               <div className="form-group col-sm">
                  <div className="row">
                     <div className="col-md-4">
                        <label htmlFor="id_classe" className="label mb-1">ID_CLASSE</label>
                     </div>
                     <div className="col-sm">
                        <InputText
                           id="id_classe"
                           name="ID_CLASSE"
                           value={data.ID_CLASSE}
                           onChange={handleChange}
                           onBlur={checkFieldData}
                           className={`w-100 is-invalid ${hasError("ID_CLASSE") ? "p-invalid" : ""}`}
                        />
                        <div className="invalid-feedback" style={{ minHeight: 21 }}>
                           {hasError("ID_CLASSE") ? getError("ID_CLASSE") : ""}
                        </div>
                     </div>
                  </div>
               </div>

               {/* NUMERO Field */}
               <div className="form-group col-sm">
                  <div className="row">
                     <div className="col-md-4">
                        <label htmlFor="numero" className="label mb-1">NUMERO</label>
                     </div>
                     <div className="col-sm">
                        <InputText
                           id="numero"
                           name="NUMERO"
                           value={data.NUMERO}
                           onChange={handleChange}
                           onBlur={checkFieldData}
                           className={`w-100 is-invalid ${hasError("NUMERO") ? "p-invalid" : ""}`}
                        />
                        <div className="invalid-feedback" style={{ minHeight: 21 }}>
                           {hasError("NUMERO") ? getError("NUMERO") : ""}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Submit Buttons */}
               <div
                  style={{ position: "absolute", bottom: 0, right: 0 }}
                  className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
               >
                  <Button
                     label="Annuler"
                     type="reset"
                     outlined
                     className="mt-3"
                     size="small"
                     onClick={() => navigate("/classes")}
                  />
                  <Button
                     label="Modifier"
                     type="submit"
                     className="mt-3 ml-3"
                     size="small"
                     disabled={!isValidate() || isSubmitting}
                  />
               </div>
            </form>
         </div>
      </>
   )
}