import React from 'react';
import { useAppDispatch } from '../hooks/AppDispatch';
import { useTypedSelector } from '../hooks/useTypeSelector';
import { Alert, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { fetchFeed } from '../reducers/feedSlice';
import { inputSchema } from '../validationSchema'



const Form = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useTypedSelector(state => state.feedState)

    const generateOnSubmit = () => async (values, {resetForm}) => {
        const { url } = values;
        dispatch(fetchFeed(url))
        resetForm()
    }

    const formik = useFormik({
        initialValues: {
            url: ''
        },
        onSubmit: generateOnSubmit(),
        validationSchema: inputSchema
    })
    
    const validationString = formik.isValid ? <Alert variant='info'>Valid Url</Alert> : <Alert variant='danger'>Invalid Url</Alert>

    return(
        <form id="rss-form" onSubmit={formik.handleSubmit}>
            <div className="input-group flex-column mb-3">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <button type="submit" className="btn btn-primary" id="submit-btn" disabled={formik.isValidating || formik.isSubmitting}>
                          {isLoading ? <Spinner size='sm' animation="border" /> : 'Add Feed'}
                        </button>
                    </div>
                    <input type="text" name="url" id="url" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.url} placeholder="url" aria-label="url"/>
                    </div>
                <small id="message" className="form-text text-muted">
                    {formik.values.url.length === 0 ? 'Please be sure that url is valid' : validationString}
                </small>
            </div>
        </form>
    )
}

export default Form