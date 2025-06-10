import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, PhoneCall, Zap } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="w-full py-10 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="w-fit bg-primary/10 text-primary"
              >
                <Zap className="w-3 h-3 mr-1" />
                Smart Booking System
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                Find the Right Doctor.{" "}
                <span className="text-primary">Book in Minutes. </span>
                Feel Better Sooner.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Revolutionize your healthcare practice with our intelligent
                phone-based appointment booking system. Patients can easily
                book, reschedule, and manage appointments through our advanced
                IVR technology.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/auth?role=doctor">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Register as a Doctor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth?role=patient">
                <Button variant="outline" size="lg">
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>24/7 IVR support</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>HIPAA compliant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center  rounded-xl ">
            <img
              alt="Smart Doctor Appointment System Dashboard"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
              src="/images/hero_img.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
