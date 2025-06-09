import { Badge } from "@/components/ui/badge";
import React from "react";

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="w-full py-10 bg-muted/30"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple Steps to Smart Appointment Booking
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our system makes appointment booking effortless for both patients
              and healthcare providers.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-start space-x-4 w-full">
              <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold">Patient Calls Your Number</h3>
                <p className="text-gray-600">
                  Patients call your dedicated appointment line to access the
                  intelligent IVR system.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold">IVR Guides the Process</h3>
                <p className="text-gray-600">
                  Our intelligent IVR system guides patients through available
                  time slots and doctor preferences.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold">Instant Confirmation</h3>
                <p className="text-gray-600">
                  Appointments are confirmed immediately with automatic calendar
                  updates and reminder scheduling.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-muted rounded-xl">
            <img
              alt="How the system works"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg"
              src="/images/hero_sec_img.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
