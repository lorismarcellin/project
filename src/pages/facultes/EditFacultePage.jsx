import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Button } from "primereact/button"
import fetchApi from "../../helpers/fetchApi"
import { useForm } from "../../hooks/useForm"
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle"
import Loading from "../../components/app/Loading"

const initialForm = {
   NOM: "",
   ID_CAMPUS: null,
}

export default function EditFacultePage() {
   const [data, handleChange, setData] = useForm(initialForm)
   const [campusList, setCampusList] = useState([])
   const [loading, setLoading] = useState(true)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()
   const { idFaculte } = useParams()

   const { hasError, getError, isValidate, checkFieldData, setErrors } = useFormErrorsHandle(data, {
      NOM: { required: true, alpha: true, length: [2, 100] },
      ID_CAMPUS: { required: true },
   })

   const fetchFaculte = useCallback(async () => {
      try {
         const res = await fetchApi(`/facultes/${idFaculte}`)
         setData({
            NOM: res.result.NOM ?? "",
            ID_CAMPUS: res.result.ID_CAMPUS ?? null,
         })
      } catch (err) {
         console.error(err)
      } finally {
         setLoading(false)
      }
   }, [idFaculte, setData])

   useEffect(() => {
      fetchApi("/campus").then(res => setCampusList(res.result))
      fetchFaculte()
   }, [fetchFaculte])

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!isValidate()) return
      setIsSubmitting(true)
      try {
         await fetchApi(`/facultes/${idFaculte}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         navigate("/facultes")
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
            <h2 className="mb-3">Modifier Faculté</h2>
            <form onSubmit={handleSubmit} className="form w-75">
               <div className="form-group">
                  <label htmlFor="nom">Nom</label>
                  <InputText
                     id="nom"
                     name="NOM"
                     value={data.NOM}
                     onChange={handleChange}
                     onBlur={checkFieldData}
                     className={`w-100 ${hasError("NOM") ? "p-invalid" : ""}`}
                  />
                  <div className="invalid-feedback">{hasError("NOM") && getError("NOM")}</div>
               </div>
               <div className="form-group mt-3">
                  <label htmlFor="ID_CAMPUS">Campus</label>
                  <Dropdown
                     id="ID_CAMPUS"
                     name="ID_CAMPUS"
                     value={data.ID_CAMPUS}
                     options={campusList}
                     optionLabel="NOM"
                     optionValue="ID_CAMPUS"
                     onChange={handleChange}
                     onBlur={checkFieldData}
                     placeholder="Choisir un campus"
                     className={`w-100 ${hasError("ID_CAMPUS") ? "p-invalid" : ""}`}
                  />
                  <div className="invalid-feedback">{hasError("ID_CAMPUS") && getError("ID_CAMPUS")}</div>
               </div>
               <div className="d-flex justify-content-end mt-4">
                  <Button type="button" label="Annuler" className="mr-2" outlined onClick={() => navigate("/facultes")} />
                  <Button type="submit" label="Modifier" disabled={!isValidate() || isSubmitting} />
               </div>
            </form>
         </div>
      </>
   )
}