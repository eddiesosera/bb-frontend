import axios from "axios";

interface CloudinaryResponse {
  secure_url: string;
}

export const uploadImageToCloudinary = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET!;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await axios.post<CloudinaryResponse>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      },
    });

    return response.data.secure_url;
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(
      error.response?.data?.error?.message || "Image upload failed"
    );
  }
};
