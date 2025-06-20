import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Star,
  Clock,
  GraduationCap,
  Eye,
  X,
  CalendarCheck,
  Mail,
  Phone,
  School,
  Calendar,
  Stethoscope,
  ShieldCheck,
  Plus,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import axiosInstance from "../../../../axiosInstance";
import { getInitials } from "@/pages/dashboard/dashboardUtils";
import { formatDateTime, formatPhone } from "@/lib/utils";
import { toast } from "sonner";
import BookAppointmentDrawer from "./BookAppointmentDrawer";

const DoctorCard = ({ doctor, profile, avgRating, totalreviews }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const reviewsRef = useRef(null);
  const [scrollToReviews, setScrollToReviews] = useState(false);
  const [isOpenBookAppointmentDrawer, setIsOpenBookAppointmentDrawer] =
    useState(false);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/api/review/get/${doctor?.id}`);
      setReviews(response?.data?.reviews);
    } catch (error) {
      console.log(error.response?.data?.message || "Fetch failed");
    }
  };

  const submitReview = async () => {
    if (!reviewText.trim() || rating === 0) {
      toast.info("Please provide both a review and rating");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await axiosInstance.post(`/api/review/create`, {
        patient_id: user?.id,
        doctor_id: doctor?.id,
        review: reviewText,
        rating: rating,
      });

      // Reset form
      setReviewText("");
      setRating(0);
      setShowWriteReview(false);

      // Refresh reviews
      await fetchReviews();

      console.log(response);

      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Review submission failed");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (isOpen && doctor?.id) {
      fetchReviews();
      console.log("Reviews ==>", reviews);
    }
  }, [isOpen, doctor?.id]);

  useEffect(() => {
    if (isOpen && scrollToReviews) {
      // Delay to allow Dialog content to mount
      const timeout = setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
        setScrollToReviews(false); // reset flag
      }, 300); // adjust this based on Dialog open animation time

      return () => clearTimeout(timeout);
    }
  }, [isOpen, scrollToReviews]);

  const getAvailabilityColor = (availability) => {
    if (availability?.includes("Today"))
      return "bg-green-500/10 text-green-600";
    if (availability?.includes("Upcoming"))
      return "bg-blue-500/10 text-blue-600";
    return "bg-rose-500/10 text-rose-600";
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= (interactive ? hoverRating || rating : rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
            onClick={() => interactive && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card
        key={doctor.id}
        className="hover:shadow-lg transition-shadow duration-300"
      >
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profile.profile_image || "/placeholder.svg"}
                alt={doctor.full_name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                {doctor.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {doctor.full_name}
              </h3>
              <p className="text-primary font-medium">
                {profile.specialization || "Specialty N/A"}
              </p>
              <div
                className="flex items-center mt-1 cursor-pointer hover:underline"
                onClick={() => {
                  setIsOpen(true);
                  setScrollToReviews(true);
                }}
              >
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-muted-foreground">
                  {avgRating} ({totalreviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span>{profile.university || "N/A"}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{profile.experience || "N/A"} year(s) experience</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{profile.address || "N/A"}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {doctor?.isAvailableToday ? (
              <Badge className={getAvailabilityColor("Available Today")}>
                Available Today
              </Badge>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getAvailabilityColor("Not Available")}>
                  Not Available Today
                </Badge>
                {doctor?.hasUpcomingSlots && (
                  <Badge className={getAvailabilityColor("Upcoming")}>
                    Upcoming slots available
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => setIsOpen(true)}
            >
              <Eye />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Details Dialog */}
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className={"sm:max-w-3xl"}>
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogDescription>
              Here is a complete doctor details.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-4">
            <Card>
              <CardContent className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={profile.profile_image || "/placeholder.svg"}
                    alt={doctor.full_name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                    {doctor.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {doctor.full_name}
                  </h3>
                  <p className="text-primary font-medium">
                    {profile.specialization + " Specialist" || "Specialty N/A"}
                  </p>
                  <div
                    className="flex items-center mt-1 hover:underline w-fit cursor-pointer"
                    onClick={() =>
                      reviewsRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-muted-foreground">
                      {avgRating} ({totalreviews} reviews)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className={"pb-0 mb-0"}>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <a href={`mailto:${doctor?.email}`}>
                    <Badge
                      variant={"secondary"}
                      className={
                        "border border-muted-foreground cursor-default hover:underline"
                      }
                    >
                      <Mail />
                      {doctor?.email}
                    </Badge>
                  </a>
                  <a href={`tel:${formatPhone(profile?.phone_number)}`}>
                    <Badge
                      variant={"secondary"}
                      className={
                        "border border-muted-foreground cursor-default hover:underline"
                      }
                    >
                      <Phone />
                      {formatPhone(profile?.phone_number) || "Not Provided"}
                    </Badge>
                  </a>
                </div>
              </CardContent>
            </Card>
            {/* BIO */}
            <Card>
              <CardHeader>
                <CardTitle className={"pb-0 mb-0"}>Bio</CardTitle>
              </CardHeader>
              <CardContent>{profile?.bio}</CardContent>
            </Card>
            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className={"pb-0 mb-0"}>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={"secondary"}
                  className={"border border-muted-foreground"}
                >
                  <Stethoscope />
                  {profile?.experience} Year(s) of Experience
                </Badge>
              </CardContent>
            </Card>
            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className={"pb-0 mb-0"}>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={"secondary"}
                    className={"border border-muted-foreground"}
                  >
                    <School />
                    {profile?.university}
                  </Badge>
                  <Badge
                    variant={"secondary"}
                    className={"border border-muted-foreground"}
                  >
                    <Calendar />
                    {profile?.graduation_year}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            {/* Clinic Address */}
            <Card>
              <CardHeader>
                <CardTitle className={"pb-0 mb-0"}>
                  Clinic / Hospital Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={"secondary"}
                  className={"border border-muted-foreground"}
                >
                  <MapPin />
                  {profile?.address}
                </Badge>
              </CardContent>
            </Card>
            {/* Medical License */}
            <Card>
              <CardHeader>
                <CardTitle className={"pb-0 mb-0"}>Medical License</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={"secondary"}
                  className={"border border-muted-foreground"}
                >
                  <ShieldCheck />
                  {profile?.medical_license}
                </Badge>
              </CardContent>
            </Card>
            {/* Reviews */}
            <Card ref={reviewsRef}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={"pb-0 mb-0"}>Reviews</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWriteReview(!showWriteReview)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Write Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Write Review Form */}
                  {showWriteReview && (
                    <Card className="border-2 border-dashed border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Write a Review
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Rating
                          </label>
                          <StarRating
                            rating={rating}
                            onRatingChange={setRating}
                            interactive={true}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Your Review
                          </label>
                          <Textarea
                            placeholder="Share your experience with this doctor..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={submitReview}
                            disabled={
                              isSubmittingReview ||
                              !reviewText.trim() ||
                              rating === 0
                            }
                            size="sm"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            {isSubmittingReview
                              ? "Submitting..."
                              : "Submit Review"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowWriteReview(false);
                              setReviewText("");
                              setRating(0);
                            }}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews List */}
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Card key={review?.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={
                                    review?.patient?.patientProfile
                                      ?.profile_image
                                  }
                                  alt={"pic"}
                                />
                                <AvatarFallback>
                                  {getInitials(review?.patient?.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">
                                  {review?.patient?.full_name}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  {formatDateTime(review?.created_at)}
                                </p>
                              </div>
                            </div>
                            <StarRating rating={review?.rating || 0} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{review?.review}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-2">
                        <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-lg font-medium">No reviews yet</p>
                        <p className="text-sm">
                          Be the first to write a review
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>
                <X />
                Close
              </Button>
            </DialogClose>
            <Button onClick={() => setIsOpenBookAppointmentDrawer(true)}>
              <CalendarCheck /> Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <BookAppointmentDrawer
        isOpen={isOpenBookAppointmentDrawer}
        onClose={() => setIsOpenBookAppointmentDrawer(false)}
        doctorId={doctor?.id}
        availableSlots={doctor?.slots?.filter((slot) => !slot.is_booked) || []}
      />
    </>
  );
};

export default DoctorCard;
