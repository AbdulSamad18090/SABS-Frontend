import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  LoaderCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

// Validation schema
const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email is too long"),
    role: z.enum(["doctor", "patient"], {
      required_error: "Please select a role",
    }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    termsAccepted: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get default role from URL params (simulated)
  const defaultRole = "doctor"; // In real app: searchParams.get("role") || "doctor"

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      role: defaultRole,
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const watchedFields = watch();

  const onSubmit = async (data) => {
    setLoading(true);
    delete data.confirmPassword;
    delete data.termsAccepted;
    try {
      // Remove fields not needed for API
      const { ...formData } = data;

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Show success message (you can replace with your toast library)
        toast.success(result.message || "Registration successful!");
        // You can add navigation logic here if needed
        // navigate("/login");
      } else {
        throw new Error(
          result.error || result.details?.[0] || "Registration failed"
        );
      }
    } catch (error) {
      // Show error message (you can replace with your toast library)
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const hasError = errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const hasValue = watchedFields[fieldName];

    let baseClass = "pl-10 h-12 border transition-colors duration-200";

    if (hasError) {
      baseClass += " border-red-500 focus:border-red-500 focus:ring-red-500";
    } else if (isTouched && hasValue && !hasError) {
      baseClass +=
        " border-green-500 focus:border-green-500 focus:ring-green-500";
    } else {
      baseClass += " border-gray-200 focus:border-blue-500 focus:ring-blue-500";
    }

    return baseClass;
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Very Weak", color: "text-red-600" };
      case 2:
        return { text: "Weak", color: "text-orange-600" };
      case 3:
        return { text: "Fair", color: "text-yellow-600" };
      case 4:
        return { text: "Good", color: "text-blue-600" };
      case 5:
        return { text: "Strong", color: "text-green-600" };
      default:
        return { text: "Very Weak", color: "text-red-600" };
    }
  };

  const passwordStrength = getPasswordStrength(watchedFields.password || "");
  const strengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <Card>
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-medium">
            Full Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              className={getInputClassName("full_name")}
              {...register("full_name")}
            />
            {errors.full_name ? (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
            ) : (
              touchedFields.full_name &&
              watchedFields.full_name && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )
            )}
          </div>
          {errors.full_name && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={getInputClassName("email")}
              {...register("email")}
            />
            {errors.email ? (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
            ) : (
              touchedFields.email &&
              watchedFields.email && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Role *</Label>
          <RadioGroup
            value={watchedFields.role}
            onValueChange={(value) => setValue("role", value)}
            className="flex items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="doctor" id="doctor" />
              <Label htmlFor="doctor">Doctor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="patient" id="patient" />
              <Label htmlFor="patient">Patient</Label>
            </div>
          </RadioGroup>
          {errors.role && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className={`${getInputClassName("password")} pr-10`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {watchedFields.password && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Password strength:
                </span>
                <span className={`text-xs font-medium ${strengthInfo.color}`}>
                  {strengthInfo.text}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength === 1
                      ? "bg-red-500 w-1/5"
                      : passwordStrength === 2
                      ? "bg-orange-500 w-2/5"
                      : passwordStrength === 3
                      ? "bg-yellow-500 w-3/5"
                      : passwordStrength === 4
                      ? "bg-blue-500 w-4/5"
                      : passwordStrength === 5
                      ? "bg-green-500 w-full"
                      : "w-0"
                  }`}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <div className="space-y-1">
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </p>
              {/* Password Requirements */}
              <div className="text-xs space-y-1 mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-700">
                  Password requirements:
                </p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center gap-1 ${
                      (watchedFields.password?.length || 0) >= 8
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      /[A-Z]/.test(watchedFields.password || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    One uppercase letter
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      /[a-z]/.test(watchedFields.password || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    One lowercase letter
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      /[0-9]/.test(watchedFields.password || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    One number
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      /[^a-zA-Z0-9]/.test(watchedFields.password || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    One special character
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className={`${getInputClassName("confirmPassword")} pr-10`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.confirmPassword.message}
            </p>
          )}
          {!errors.confirmPassword &&
            watchedFields.confirmPassword &&
            watchedFields.password === watchedFields.confirmPassword && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Passwords match
              </p>
            )}
        </div>

        {/* Terms */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 mt-1"
              {...register("termsAccepted")}
            />
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </a>
            </span>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.termsAccepted.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full h-12"
          disabled={loading || !isValid}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-4 w-4" />
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Form Status */}
        {!isValid && Object.keys(errors).length > 0 && (
          <div className="text-center">
            <p className="text-sm text-red-600">
              Please fix the errors above to continue
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Register;
