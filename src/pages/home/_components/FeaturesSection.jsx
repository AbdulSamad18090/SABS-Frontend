import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Bot, Calendar, CheckCircle, Phone, Shield, UserCheck } from "lucide-react";
import React from "react";

const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 flex flex-col items-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything You Need for Smart Appointment Management
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our comprehensive IVR system provides seamless phone-based
              appointment booking, reducing administrative burden while
              improving patient access to healthcare services.
            </p>
          </div>
        </div>
        <div className="container mx-auto max-w-5xl grid gap-4 py-12 lg:grid-cols-3">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Phone className="h-10 w-10 text-primary" />
              <CardTitle>Advanced IVR System</CardTitle>
              <CardDescription>
                Intelligent voice response system that handles appointment
                booking, rescheduling, and cancellations 24/7.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Multi-language support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Natural voice recognition
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Automated confirmations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary" />
              <CardTitle>Smart Scheduling</CardTitle>
              <CardDescription>
                AI-powered scheduling that optimizes appointment slots and
                reduces wait times for better patient experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Real-time availability
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Automatic rescheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Waitlist management
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <UserCheck className="h-10 w-10 text-primary" />
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                Comprehensive patient information management with secure data
                handling and appointment history tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Patient verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Appointment history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Secure data storage
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Bot className="h-10 w-10 text-primary" />
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Intelligent chatbot and voice assistant that handles common
                queries and guides patients through the booking process.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Bell className="h-10 w-10 text-primary" />
              <CardTitle>Automated Reminders</CardTitle>
              <CardDescription>
                Reduce no-shows with automated appointment reminders via voice
                calls, helping maintain your schedule efficiency.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary" />
              <CardTitle>HIPAA Compliant</CardTitle>
              <CardDescription>
                Enterprise-grade security ensuring all patient data is protected
                and compliant with healthcare regulations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
