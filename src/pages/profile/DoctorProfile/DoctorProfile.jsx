import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  MapPin,
  GraduationCap,
  Stethoscope,
  Clock,
  User,
  Loader,
  LoaderCircle,
} from "lucide-react";
import axiosInstance from "../../../../axiosInstance";
import { toast } from "sonner";
import {
  uploadProfileImage,
  deleteProfileImage,
  getProfileImageUrl,
} from "../../../../supabaseClient";

const DoctorProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=120&width=120"
  );
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const profile = user?.doctorProfile;

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: profile?.phone_number || "",
    bio: profile?.bio || "",
    specialization: profile?.specialization || "",
    university: profile?.university || "",
    graduation_year: profile?.graduation_year
      ? parseInt(profile.graduation_year)
      : "",
    experience: profile?.experience ? parseInt(profile.experience) : "",
    address: profile?.address || "",
    medical_license: profile?.medical_license || "",
    profile_image: profile?.profile_image || "",
  });

  // Load existing profile image on component mount
  useEffect(() => {
    if (profile?.profile_image) {
      // Check if it's already a complete URL or just a path
      const imageUrl = profile.profile_image.startsWith("http")
        ? profile.profile_image
        : getProfileImageUrl(profile.profile_image);

      if (imageUrl) {
        setProfileImage(imageUrl);
      }
    }
  }, [profile?.profile_image]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "graduation_year" || field === "experience"
          ? parseInt(value) || ""
          : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result);
      };
      reader.readAsDataURL(file);

      // Delete old image if exists
      if (formData.profile_image) {
        await deleteProfileImage(formData.profile_image);
      }

      // Upload new image
      const uploadResult = await uploadProfileImage(
        file,
        user?.id,
        "doctor_images"
      );

      if (uploadResult.success) {
        // Store the complete URL instead of just the path
        setFormData((prev) => ({
          ...prev,
          profile_image: uploadResult.publicUrl, // Changed from uploadResult.path to uploadResult.publicUrl
        }));

        // Update profile image display with public URL
        setProfileImage(uploadResult.publicUrl);

        toast.success("Profile image uploaded successfully!");
      } else {
        throw new Error(uploadResult.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");

      // Reset to previous image if upload failed
      if (profile?.profile_image) {
        const imageUrl = getProfileImageUrl(profile.profile_image);
        if (imageUrl) {
          setProfileImage(imageUrl);
        }
      } else {
        setProfileImage("/placeholder.svg?height=120&width=120");
      }
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BASE_URL}/api/user/doctor/update`,
        {
          id: user?.id,
          ...formData,
        }
      );

      if (response.data.success) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.details?.[0] || "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              Doctor Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your professional information and credentials
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 shadow-lg">
                  <AvatarImage
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                  />
                  <AvatarFallback className="text-2xl bg-blue-500/10 text-primary">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className={`absolute bottom-0 right-0 bg-primary hover:bg-blue-700/30 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors ${
                    imageUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {imageUploading ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {imageUploading
                  ? "Uploading image..."
                  : "Click the camera icon to update your profile photo"}
                <br />
                <span className="text-xs">
                  Max size: 5MB. Formats: JPEG, PNG, WebP
                </span>
              </p>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled={true}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">Medical License Number</Label>
                <Input
                  id="license"
                  value={formData.medical_license}
                  onChange={(e) =>
                    handleInputChange("medical_license", e.target.value)
                  }
                  placeholder="Enter your license number"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="specialization"
                    className="flex items-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Specialization
                  </Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) =>
                      handleInputChange("specialization", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Emergency Medicine">
                        Emergency Medicine
                      </SelectItem>
                      <SelectItem value="Family Medicine">
                        Family Medicine
                      </SelectItem>
                      <SelectItem value="Internal Medicine">
                        Internal Medicine
                      </SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="experience"
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    placeholder="Enter years of experience"
                    min="0"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="university"
                    className="flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Medical University
                  </Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) =>
                      handleInputChange("university", e.target.value)
                    }
                    placeholder="Enter your medical school"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) =>
                      handleInputChange("graduation_year", e.target.value)
                    }
                    placeholder="Enter graduation year"
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Write a brief description about your medical practice, expertise, and approach to patient care..."
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground text-right">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Address Section */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Practice Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your practice address"
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                onClick={handleSave}
                disabled={loading || imageUploading}
                className="w-1/4"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
