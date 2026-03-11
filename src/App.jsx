import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Component/Dashboard";
import JobPage from "./Pages/JobPage";
import DashboardLayout from "./Component/Sidebar";
import JobDetailsForm from "./Pages/JobDetailsForm";

function App() {
  return (
    <BrowserRouter>

      <DashboardLayout>

        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/job-page" element={<JobPage />} />
          <Route path="/job-details" element={<JobDetailsForm />} />
         

        </Routes>

      </DashboardLayout>

    </BrowserRouter>
  );
}

export default App;
