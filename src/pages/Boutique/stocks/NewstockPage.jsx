/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../../store/actions/appActions"
import { stocks_routes_items } from "../../../routes/facultes/faculte_routes"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import Loading from "../../../components/app/Loading"
import { useNavigate } from "react-router-dom"
import { useForm } from "../../../hooks/useForm"
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle"
import fetchApi from "../../../helpers/fetchApi"

const initialForm = {
  ID_ART: "",
  QUANTITE_ENTR: "",
  QUANTITE_SORT: "",
  RESTE: "",
}

export default function NewStockPage() {
  const dispatch = useDispatch()
  const [data, handleChange, setData, setValue] = useForm(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [articles, setArticles] = useState([])
  const navigate = useNavigate()

  const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
    ID_ART: { required: true },
    QUANTITE_ENTR: {
      required: true,
      alpha: true,
      length: [1, 50],
    },
    QUANTITE_SORT: {
      required: false,
      alpha: true,
      length: [1, 50],
    },

  })

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!isValidate()) return false
      setIsSubmitting(true)
      const form = new FormData()
      form.append("ID_ART", data.ID_ART)
      form.append("QUANTITE_ENTR", data.QUANTITE_ENTR)
      form.append("QUANTITE_SORT", data.QUANTITE_SORT)
      form.append("RESTE", data.RESTE)
      await fetchApi("/stocks", {
        method: "POST",
        body: form,
      })
      dispatch(
        setToastAction({
          severity: "success",
          summary: "Stock enregistré",
          detail: "L'utilisateur a été enregistré avec succès",
          life: 3000,
        })
      )
      navigate("/stocks")
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

  useEffect(() => {
    dispatch(
      setBreadCrumbItemsAction([
        stocks_routes_items.stocks,
        stocks_routes_items.new_stocks,
      ])
    )
    return () => {
      dispatch(setBreadCrumbItemsAction([]))
    }
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetchApi("/articles")
        if (Array.isArray(res)) {
          setArticles(res)
        } else if (Array.isArray(res.data)) {
          setArticles(res.data)
        } else {
          setArticles([])
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchArticles()
  }, [])

  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div>
          <h1 className="mb-3">Ajouter au stock</h1>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          {/* ID_ART Field */}
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="id_article" className="label mb-1">
                  Article
                </label>
              </div>
              <div className="col-sm">
                <Dropdown
                  id="id_article"
                  name="ID_ART"
                  value={data.ID_ART}
                  options={articles}
                  optionLabel="DESCRIPTION"
                  optionValue="ID_ART"
                  placeholder="Sélectionner un article"
                  onChange={handleChange}
                  onBlur={() => checkFieldData({ target: { name: "ID_ART", value: data.ID_ART } })}
                  className={`w-100 is-invalid ${hasError("ID_ART") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("ID_ART") ? getError("ID_ART") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="QUANTITE_ENTR" className="label mb-1">
                  QUANTITE ENTREE
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  autoFocus
                  type="text"
                  placeholder="Entrer la quantité"
                  id="QUANTITE_ENTR"
                  name="QUANTITE_ENTR"
                  value={data.QUANTITE_ENTR}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("QUANTITE_ENTR") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("QUANTITE_ENTR") ? getError("QUANTITE_ENTR") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="QUANTITE_SORT" className="label mb-1">
                 QUANTITE SORTIE
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le QUANTITE_SORT"
                  id="QUANTITE_SORT"
                  name="QUANTITE_SORT"
                  value={data.QUANTITE_SORT}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("QUANTITE_SORT") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("QUANTITE_SORT") ? getError("QUANTITE_SORT") : ""}
                </div>
              </div>
            </div>
          </div>
         
          <div
            style={{ position: "absolute", bottom: 0, right: 0 }}
            className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
          >
            <Button
              label="Réinitialiser"
              type="reset"
              outlined
              className="mt-3"
              size="small"
              onClick={(e) => {
                e.preventDefault()
                setData(initialForm)
                setErrors({})
              }}
            />
            <Button
              label="Envoyer"
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