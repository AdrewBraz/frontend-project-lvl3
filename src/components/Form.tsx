import React from 'react';
import { useAppDispatch } from '../hooks/AppDispatch';
import { useFormik } from 'formik';
import { fetchFeed } from '../reducers/feedSlice';



const Form = () => {
    const dispatch = useAppDispatch();


    const generateOnSubmit = () => async (values) => {
        const { url } = values;
        dispatch(fetchFeed(url))
        
    }
    

    const formik = useFormik({
        initialValues: {
            url: ''
        },
        onSubmit: generateOnSubmit()
    })

    return(
        <form id="rss-form" onSubmit={formik.handleSubmit}>
            <div className="input-group flex-column mb-3">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <button type="submit" className="btn btn-primary" id="submit-btn" disabled={formik.isSubmitting}>Add Feed</button>
                    </div>
                    <input type="text" name="url" id="url" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.url} placeholder="url" aria-label="url"/>
                    </div>
                <small id="message" className="form-text text-muted">
                    Please, be sure your URL is valid
                </small>
            </div>
        </form>
    )
}

export default Form