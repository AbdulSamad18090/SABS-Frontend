import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  MapPin,
  Star,
  Clock,
  GraduationCap,
  Phone,
  Mail,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "@/redux/slices/doctorSlice";
import Loader from "@/components/loader/Loader";

const DOCTORS_PER_PAGE = 6;

const Doctors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { doctors, loading } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDoctors({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.full_name?.toLowerCase() || "";
    const specialty = doctor.doctorProfile?.specialization?.toLowerCase() || "";
    const location = doctor.doctorProfile?.address?.toLowerCase() || "";

    return (
      name.includes(searchTerm.toLowerCase()) ||
      specialty.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE);
  const startIndex = (currentPage - 1) * DOCTORS_PER_PAGE;
  const endIndex = startIndex + DOCTORS_PER_PAGE;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getAvailabilityColor = (availability) => {
    if (availability?.includes("Today"))
      return "bg-green-500/10 text-green-600";
    if (availability?.includes("Tomorrow"))
      return "bg-blue-500/10 text-blue-600";
    return "bg-gray-500/10 text-gray-600";
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col justify-center items-center p-4 min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Find Your Doctor
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Connect with experienced healthcare professionals
            </p>
          </div>
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredDoctors.length)} of{" "}
            {filteredDoctors.length} doctors
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No doctors found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDoctors.map((doctor) => {
              const profile = doctor.doctorProfile || {};
              const rating = doctor.averageRating ?? "N/A";
              const reviews = doctor.totalReviews || 0;

              return (
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
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-muted-foreground">
                            {rating} ({reviews} reviews)
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
                        <span>
                          {profile.experience || "N/A"} year(s) experience
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{profile.address || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={getAvailabilityColor("Available Today")}
                      >
                        Available Today
                      </Badge>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Book Appointment
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
