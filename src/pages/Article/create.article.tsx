import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState, useAppDispatch } from "../../redux/store";
import { createArticle } from "../../redux/slices/article.slice";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { uploadImageToCloudinary } from "../../util/cloudinaryUpload";
import { toast } from "react-toastify";
import cld from "../../util/cloudinaryConfig";
import { AdvancedImage } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";

const CreateArticle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useSelector((state: RootState) => state.articles);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imagePublicId, setImagePublicId] = useState<string | null>(null); // To store public ID

  // Initialize Formik
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
      imageCover: Yup.string()
        .url("Must be a valid URL")
        .required("Image cover is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(createArticle(values)).unwrap();
        toast.success("Article created successfully!");
        formik.resetForm();
        setImagePublicId(null); // Reset image state
        // Optionally, navigate to the newly created article's page
        // navigate(`/articles/${values.slug}`);
      } catch (err: any) {
        toast.error(err.message || "Failed to create article");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle image upload
  const handleImageUpload = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0]; // Only handle the first file for imageCover

      console.log("handleImageUpload called with:", acceptedFiles);

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        console.log("File size exceeds limit:", file.size);
        toast.error("File size exceeds 5MB");
        return;
      }

      setUploadingImage(true);
      setUploadProgress(0);

      try {
        const imageUrl = await uploadImageToCloudinary(file, (progress) => {
          setUploadProgress(progress); // Update progress
          console.log(`Upload Progress: ${progress}%`);
        });

        console.log("Image URL received:", imageUrl);

        // Extract the public ID from the URL
        const urlParts = imageUrl.split("/");
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split(".")[0];
        setImagePublicId(publicId);
        console.log("Public ID set to:", publicId);

        formik.setFieldValue("imageCover", imageUrl);
        console.log("Formik imageCover set to:", imageUrl);
        toast.success("Image uploaded successfully!");
      } catch (error: any) {
        console.error("Image Upload Failed:", error);
        toast.error(error.message || "Image upload failed");
      } finally {
        setUploadingImage(false);
        setUploadProgress(0);
      }
    },
    [formik]
  );

  // ImageUploader component
  const ImageUploader: React.FC<{ onUpload: (files: File[]) => void }> = ({
    onUpload,
  }) => {
    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        console.log("Accepted Files:", acceptedFiles); // Debugging line
        onUpload(acceptedFiles);
      },
      [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
        "image/webp": [".webp"],
        // Add other image MIME types and extensions if needed
      },
      multiple: false, // Only allow single file
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop image cover here, or click to select an image</p>
        )}
      </div>
    );
  };

  // Function to create CloudinaryImage for AdvancedImage
  const getCloudinaryImage = (): CloudinaryImage | null => {
    if (!imagePublicId) return null;
    return cld
      .image(imagePublicId)
      .resize({
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "auto",
      })
      .format("auto")
      .quality("auto");
  };

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-2xl mx-auto p-4">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Form Title */}
      <h2 className="font-bold text-2xl mb-6">Create a New Article</h2>

      {/* Debugging Display */}
      <div className="mb-4">
        <strong>Formik imageCover Value:</strong> {formik.values.imageCover}
      </div>

      {/* Title Field */}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-bold text-gray-700 mb-2 text-2xl"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`mt-1 block w-full border ${
            formik.touched.title && formik.errors.title
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter article title"
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
        )}
      </div>

      {/* Content Field */}
      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-bold text-gray-700 mb-2 text-2xl"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`mt-1 block w-full border ${
            formik.touched.content && formik.errors.content
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 h-64`}
          placeholder="Enter article content"
        ></textarea>
        {formik.touched.content && formik.errors.content && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.content}
          </div>
        )}
      </div>

      {/* Category Field */}
      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-bold text-gray-700 mb-2 text-2xl"
        >
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`mt-1 block w-full border ${
            formik.touched.category && formik.errors.category
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter article category"
        />
        {formik.touched.category && formik.errors.category && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.category}
          </div>
        )}
      </div>

      {/* Image Cover Upload */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2 text-2xl">
          Image Cover
        </label>
        <ImageUploader onUpload={handleImageUpload} />
        {uploadingImage && (
          <p className="text-blue-500 mt-2">Uploading image...</p>
        )}
        {/* Progress Bar (Optional) */}
        {uploadProgress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}
        {/* Image Preview using AdvancedImage */}
        {imagePublicId && (
          <div className="mt-4 relative">
            {getCloudinaryImage() && (
              <AdvancedImage cldImg={getCloudinaryImage()!} />
            )}
            <button
              type="button"
              onClick={() => {
                formik.setFieldValue("imageCover", "");
                setImagePublicId(null);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Remove Image"
            >
              &times;
            </button>
          </div>
        )}
        {formik.touched.imageCover && formik.errors.imageCover && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.imageCover}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={formik.isSubmitting || uploadingImage}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            formik.isSubmitting || uploadingImage
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {formik.isSubmitting ? "Creating..." : "Create Article"}
        </button>
      </div>
    </form>
  );
};

export default CreateArticle;
