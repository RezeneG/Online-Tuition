import React, { useContext, useState } from "react";
import {
  GraduationCap,
  Search,
  ShoppingCart,
  Globe,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { CourseContext } from "../context/CourseContext";
import { config } from "../config";

// Components
import CourseCard from "../components/courses/CourseCard";
import CourseFilter from "../components/courses/CourseFilter";
import Loader from "../components/common/Loader";
import { createCheckoutSession } from "../services/paymentService";

// Initialize Stripe with config
const stripePromise = loadStripe(config.stripePublishableKey);

const CoursesPage = () => {
  const { filteredCourses, filters, setFilters, loading } = useContext(CourseContext);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => setFilters({ ...filters, search: e.target.value.toLowerCase() });

  const handleBuyCourse = async (courseId) => {
    const customerEmail = prompt("Enter your email for the purchase:");
    if (!customerEmail) return;
    try {
      const url = await createCheckoutSession(courseId, customerEmail);
      window.location.href = url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
      alert("Payment initialization failed. Please try again.");
    }
  };

  // ... rest of the code
};
