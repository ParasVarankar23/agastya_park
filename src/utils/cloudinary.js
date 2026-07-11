import { v2 as cloudinary } from "cloudinary";

// =========================================
// CLOUDINARY CONFIG
// =========================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =========================================
// UPLOAD FILE
// =========================================

export const uploadToCloudinary = (
    buffer,
    fileName = "upload",
    mimeType = "application/octet-stream",
    folder = "agastya-park"
) => {
    return new Promise((resolve, reject) => {
        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: mimeType.startsWith("image/") ? "image" : "auto",
                    public_id: fileName.replace(/\.[^/.]+$/, ""),
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            );

        stream.end(buffer);
    });
};

export const uploadImage = uploadToCloudinary;

// =========================================
// DELETE FILE
// =========================================

export const deleteFromCloudinary = async (
    publicId
) => {
    try {
        const result =
            await cloudinary.uploader.destroy(
                publicId,
                {
                    resource_type: "image",
                }
            );

        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteImage = deleteFromCloudinary;