import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload Image
export const uploadImage = async (
    file,
    folder = "agastya-park"
) => {
    try {
        const result =
            await cloudinary.uploader.upload(
                file,
                {
                    folder,
                }
            );

        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

// Delete Image
export const deleteImage = async (
    public_id
) => {
    try {
        await cloudinary.uploader.destroy(
            public_id
        );

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};