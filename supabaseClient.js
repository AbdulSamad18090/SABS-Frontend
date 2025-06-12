import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadProfileImage = async (
  file,
  userId,
  folder = "profile-images"
) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and WebP are allowed."
      );
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;

    // Create file path with custom folder
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from("smart-appointment-booking-system")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      console.log(data)

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("smart-appointment-booking-system")
      .getPublicUrl(filePath);

    return {
      success: true,
      path: filePath,
      publicUrl: publicUrlData.publicUrl,
      fileName: fileName,
      folder: folder,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to delete old profile image
export const deleteProfileImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from("smart-appointment-booking-system")
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to get public URL for existing image
export const getProfileImageUrl = (filePath) => {
  if (!filePath) return null;

  const { data } = supabase.storage
    .from("smart-appointment-booking-system")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
