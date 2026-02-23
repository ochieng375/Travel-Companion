import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { 
  Loader2, 
  LayoutDashboard, 
  Calendar, 
  Truck, 
  Package, 
  MessageSquare, 
  Quote, 
  LogOut,
  Image as ImageIcon,
  TrendingUp,
  Users,
  DollarSign,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Admin Sub-components
import { AdminBookings } from "./admin/AdminBookings";
import { AdminFleet } from "./admin/AdminFleet";
import { AdminPackages } from "./admin/AdminPackages";
import { AdminInquiries } from "./admin/AdminInquiries";
import { AdminTestimonials } from "./admin/AdminTestimonials";
import { AdminPhotos } from "./admin/AdminPhotos";

export default function Admin() {
  const { user, isLoading, isAuthenticated, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Redirect if not authenticated - FIXED: Use correct login route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/safari-admin-2024");  // CHANGED from "/login"
    }
  }, [isLoading, isAuthenticated, setLocation]);

  // Fetch real dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats");
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchStats();
    }
  }, [isAuthenticated, isAdmin]);

  if (isLoading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
          <p className="text-stone-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-serif text-stone-900">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-stone-600 mb-6">
              You must be logged in as an admin to access this dashboard.
            </p>
            <Button 
              onClick={() => setLocation("/safari-admin-2024")}  // CHANGED from "/login"
              className="w-full bg-amber-600 hover:bg-amber-700 rounded-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "fleet", label: "Fleet", icon: Truck },
    { id: "packages", label: "Packages", icon: Package },
    { id: "photos", label: "Photos", icon: ImageIcon },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
    { id: "testimonials", label: "Testimonials", icon: Quote },
  ];

  const dashboardStats = [
    { title: "Total Bookings", value: stats?.totalBookings || 0, icon: Calendar, color: "bg-blue-500" },
    { title: "Total Vehicles", value: stats?.totalVehicles || 0, icon: Truck, color: "bg-green-500" },
    { title: "Total Packages", value: stats?.totalPackages || 0, icon: Package, color: "bg-amber-500" },
    { title: "Total Inquiries", value: stats?.totalContacts || 0, icon: MessageSquare, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-stone-200 h-screen sticky top-0 flex flex-col shadow-xl">
        <div className="p-6 border-b border-stone-100">
          <Link href="/" className="block">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Safari Private Tours
            </h2>
            <span className="text-amber-600 text-xs font-bold tracking-widest uppercase">
              Admin Dashboard
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-amber-50 text-amber-700 shadow-sm" 
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-amber-600" : "text-stone-400")} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100 bg-stone-50">
          <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-stone-900 truncate">
                {user?.firstName || user?.email || 'Admin'}
              </p>
              <p className="text-xs text-stone-500 truncate capitalize">
                {user?.role || 'admin'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl" 
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="w-4 h-4" /> 
            {logout.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-stone-900 capitalize">
                {activeTab}
              </h1>
              <p className="text-stone-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Bell className="w-6 h-6 text-stone-400" />
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, idx) => (
                <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-stone-500 text-sm font-medium mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-stone-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl text-white`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "bookings" && <AdminBookings />}
          {activeTab === "fleet" && <AdminFleet />}
          {activeTab === "packages" && <AdminPackages />}
          {activeTab === "photos" && <AdminPhotos />}
          {activeTab === "inquiries" && <AdminInquiries />}
          {activeTab === "testimonials" && <AdminTestimonials />}
        </div>
      </main>
    </div>
  );
}