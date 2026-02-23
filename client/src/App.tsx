import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Packages from "@/pages/Packages";
import Fleet from "@/pages/Fleet";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import Gallery from "@/pages/Gallery";
import About from "@/pages/About"; // FIXED: Capital 'A'
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/packages" component={Packages} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/about" component={About} /> {/* FIXED: Moved up, capital 'A' */}
      <Route path="/contact" component={Contact} />
      <Route path="/safari-admin-2024" component={Login} /> {/* FIXED: Secret URL */}
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} /> {/* FIXED: Must be last */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;