import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../redux/store";
import { createArticle } from "../../redux/slices/article.slice";

const CreateArticle: React.FC = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
      imageCover: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
      category: Yup.string().required("Category is required"),
      imageCover: Yup.string().url("Must be a valid URL"),
    }),
    onSubmit: (values) => {
      dispatch(createArticle(values));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label>Title</label>
        <input
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.errors.title && <div>{formik.errors.title}</div>}
      </div>
      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
        />
        {formik.errors.content && <div>{formik.errors.content}</div>}
      </div>
      <div>
        <label>Category</label>
        <input
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
        />
        {formik.errors.category && <div>{formik.errors.category}</div>}
      </div>
      <div>
        <label>Image Cover URL</label>
        <input
          name="imageCover"
          value={formik.values.imageCover}
          onChange={formik.handleChange}
        />
        {formik.errors.imageCover && <div>{formik.errors.imageCover}</div>}
      </div>
      <button type="submit">Create Article</button>
    </form>
  );
};

export default CreateArticle;
