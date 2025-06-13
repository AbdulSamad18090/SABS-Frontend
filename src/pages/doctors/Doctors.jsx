import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "@/redux/slices/doctorSlice";
import Loader from "@/components/loader/Loader";
import DoctorCard from "./_components/DoctorCard";

const DOCTORS_PER_PAGE = 12;

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const { doctors, loading, total } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(fetchDoctors({ page: currentPage, limit: DOCTORS_PER_PAGE }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Client-side search filtering (from fetched page)
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

  const totalPages = Math.ceil(total / DOCTORS_PER_PAGE);

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
            Showing {filteredDoctors.length} doctors on page {currentPage} of{" "}
            {totalPages}
          </p>
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No doctors found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => {
              const profile = doctor?.doctorProfile || {};
              const averageRating = doctor?.averageRating ?? "N/A";
              const totalReviews = doctor.totalReviews || 0;
              return (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  profile={profile}
                  avgRating={averageRating}
                  totalreviews={totalReviews}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default Doctors;
