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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, FileText, Save, Phone, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../../../axiosInstance";
import {
  deleteProfileImage,
  getProfileImageUrl,
  uploadProfileImage,
} from "../../../../supabaseClient";

const PatientProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    problem: "",
    profile_image: "",
    age: "",
    blood_group: "",
    phone_number: "",
    emergency_contact: "",
    address: "",
  });

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
      setFormData({
        full_name: userData?.full_name || "",
        problem: userData?.patientProfile?.problem || "",
        profile_image: userData?.patientProfile?.profile_image || "",
        age: userData?.patientProfile?.age || "",
        blood_group: userData?.patientProfile?.blood_group || "",
        phone_number: userData?.patientProfile?.phone_number || "",
        emergency_contact: userData?.patientProfile?.emergency_contact || "",
        address: userData?.patientProfile?.address || "",
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" ? (value === "" ? "" : parseInt(value, 10)) : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageUploading(true);

    try {
      if (formData.profile_image) {
        await deleteProfileImage(formData.profile_image);
      }

      const uploadResult = await uploadProfileImage(
        file,
        user?.id,
        "patient_images"
      );

      if (uploadResult.success) {
        setFormData((prev) => ({
          ...prev,
          profile_image: uploadResult.publicUrl,
        }));
        toast.success("Profile image uploaded successfully!");
      } else {
        throw new Error(uploadResult.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
      const fallback = user?.patientProfile?.profile_image
        ? getProfileImageUrl(user.patientProfile.profile_image)
        : "/placeholder.svg?height=120&width=120";

      setFormData((prev) => ({
        ...prev,
        profile_image: fallback,
      }));
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BASE_URL}/api/user/patient/update`,
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Patient Profile</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="medical">Medical Information</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                View and update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={
                          formData.profile_image ||
                          "/placeholder.svg?height=120&width=120"
                        }
                        alt={formData.full_name}
                      />
                      <AvatarFallback className="text-2xl">
                        {getInitials(formData.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <Label
                        htmlFor="profile_image"
                        className="cursor-pointer text-sm text-primary hover:underline"
                      >
                        {imageUploading ? "Uploading..." : "Change Photo"}
                      </Label>
                      <Input
                        id="profile_image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="full_name"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Age
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Enter your age"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="blood_group"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Blood Group
                      </Label>
                      <Input
                        id="blood_group"
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleInputChange}
                        placeholder="e.g., A+, B-, O+, AB-"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone_number"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="emergency_contact"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergency_contact"
                        name="emergency_contact"
                        value={formData.emergency_contact}
                        onChange={handleInputChange}
                        placeholder="Emergency contact name and number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete address"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>
                Manage your medical details and health information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="problem"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Medical Problem
                    </Label>
                    <Textarea
                      id="problem"
                      name="problem"
                      value={formData.problem || ""}
                      onChange={handleInputChange}
                      placeholder="Describe your medical condition or health concerns"
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 w-1/4"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PatientProfile;
