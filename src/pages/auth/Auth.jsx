import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "./_components/Login";
import Register from "./_components/Register";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/dashboard");
    }
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-background p-6">
      <Tabs defaultValue="login" className="container max-w-xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login" className="text-sm font-medium">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-sm font-medium">
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Login />
        </TabsContent>

        <TabsContent value="signup">
          <Register />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
