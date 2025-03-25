
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="glass-panel max-w-lg mx-auto rounded-2xl p-8 text-center">
          <h1 className="text-6xl font-bold text-portal-900 mb-6">404</h1>
          <p className="text-2xl text-portal-700 mb-8">
            Oops! Page not found
          </p>
          <p className="text-portal-600 mb-8">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-portal-900 text-white rounded-lg hover:bg-portal-800 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
