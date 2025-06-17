import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneCall } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section id="contact" className="w-full py-10 bg-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Ready to Modernize Your Appointment System?
            </h2>
            <p className="mx-auto max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of healthcare providers who have transformed their
              patient experience with our smart booking system.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1 bg-white"
              />
              <Button type="submit" variant="secondary">
                Get Started
              </Button>
            </form>
            <p className="text-xs text-white">
              Start your free 30-day trial. No credit card required.{" "}
              <Link
                to="/terms"
                className="underline underline-offset-2 hover:text-white"
              >
                Terms & Conditions
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" variant="secondary">
              <PhoneCall className="mr-2 h-4 w-4" />
              Continue as Doctor
            </Button>
            <Button size="lg" variant="outline">
              Continue as Patient
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
