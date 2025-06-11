import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "../../hooks/useForm"
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle"
import fetchApi from "../../helpers/fetchApi"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import Loading from "../../components/app/Loading"

const initialForm = {
   NOM: "",
}

export default function EditCampusPage() {
   const [data, handleChange, setData] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [loading, setLoading] = useState(true)
   const navigate = useNavigate()
   const { idCampus } = useParams()

   const { hasError, getError, isValidate, checkFieldData, setErrors } = useFormErrorsHandle(data, {
      NOM: { required: true, alpha: true, length: [2, 100] },
   })

   const fetchCampus = useCallback(async () => {
      try {
         const res = await fetchApi(`/campus/${idCampus}`)
         setData({ NOM: res.result.NOM ?? "" })
      } catch (err) {
         console.error(err)
      } finally {
         setLoading(false)
      }
   }, [idCampus, setData])

   useEffect(() => {
      fetchCampus()
   }, [fetchCampus])

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!isValidate()) return
      setIsSubmitting(true)
      try {
         await fetchApi(`/campus/${idCampus}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         navigate("/campus")
      } catch (err) {
         if (err.httpStatus === "UNPROCESSABLE_ENTITY") {
            setErrors(err.result)
         }
      } finally {
         setIsSubmitting(false)
      }
   }

   if (loading) {
      return <div className="d-flex justify-content-center align-items-center h-100"><div className="spinner-border" /></div>
   }

   return (
      <>
         {isSubmitting && <Loading />}
         <div className="main_content bg-white p-4 has_footer">
            <h2 className="mb-3">Modifier Campus</h2>
            <form onSubmit={handleSubmit} className="form w-75">
               <div className="form-group">
                  <label htmlFor="nom" className="label">Nom</label>
                  <InputText
                     id="nom"
                     name="NOM"
                     value={data.NOM}
                     onChange={handleChange}
                     onBlur={checkFieldData}
                     className={`w-100 ${hasError("NOM") ? "p-invalid" : ""}`}
                  />
                  {hasError("NOM") && (
                     <div className="invalid-feedback">{getError("NOM")}</div>
                  )}
               </div>
               <div className="d-flex justify-content-end mt-3">
                  <Button type="button" label="Annuler" className="mr-2" outlined onClick={() => navigate("/campus")} />
                  <Button type="submit" label="Modifier" disabled={!isValidate() || isSubmitting} />
               </div>
            </form>
         </div>
      </>
   )
}