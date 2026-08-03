// Frontend/src/hooks/useDoctorDashboard.ts
import { useEffect, useState } from "react";
import { getDoctorDashboard } from "../api/doctor";

const useDoctorDashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDoctorDashboard();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    dashboard,
    loading,
  };
};

export default useDoctorDashboard;