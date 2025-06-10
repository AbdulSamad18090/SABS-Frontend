import { Badge } from "@/components/ui/badge";
import { Clock, Star, UserCheck, Users } from "lucide-react";
import React from "react";

const BenefitsSection = () => {
  return (
    <section id="benefits" className="w-full py-10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="w-fit bg-primary/10 text-primary"
              >
                Benefits
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Transform Your Healthcare Practice
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Reduce administrative burden, improve patient satisfaction, and
                increase operational efficiency.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Reduce no-shows by up to 40%
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Save 3+ hours of staff time daily
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Improve patient satisfaction scores
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  24/7 appointment booking availability
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-muted rounded-xl">
            <img
              alt="Healthcare benefits"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg"
              src="/images/hero_sec_img.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
