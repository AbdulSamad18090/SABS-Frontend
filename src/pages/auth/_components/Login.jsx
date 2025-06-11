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
  LoaderCircle,
  Lock,
  Mail,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  remember: z.boolean().optional(),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Watch form values for conditional styling
  const watchedFields = watch();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Show success message
        toast.success(result.message || "Login successful!");

        // Store tokens and user data in localStorage
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        // Navigate to dashboard (you can add navigation logic here)
        navigate("/dashboard");
      } else {
        throw new Error(result.error || result.details?.[0] || "Login failed");
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
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

  return (
    <Card>
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Field */}
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
            {errors.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`${getInputClassName("password")} pr-10`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-muted-foreground z-10"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="space-y-1">
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </p>
              {/* Password Requirements Checklist */}
              <div className="text-xs space-y-1 mt-2 p-3 bg-background rounded-md">
                <p className="font-medium text-muted-foreground">
                  Password requirements:
                </p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center gap-1 ${
                      watchedFields.password?.length >= 6
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    At least 6 characters
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      /[A-Z]/.test(watchedFields.password || "")
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    One uppercase letter
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      /[a-z]/.test(watchedFields.password || "")
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    One lowercase letter
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      /[0-9]/.test(watchedFields.password || "")
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    One number
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              {...register("remember")}
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </a>
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
              Signing In...
            </div>
          ) : (
            "Sign In"
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

export default Login;
