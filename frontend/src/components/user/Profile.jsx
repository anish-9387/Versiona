import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(`/user/${userId}`);
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <div className="border-b border-[#30363d]">
        <div className="max-w-screen-xl mx-auto px-6">
          <nav className="flex gap-4 -mb-px">
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-3 text-sm font-medium text-white border-b-2 border-[#f78166] bg-transparent cursor-pointer"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 inline mr-2 fill-white">
                <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25V2.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H2.75z" />
                <path d="M6.5 8.043V4.5a1 1 0 012 0v3.543a1 1 0 01-.5.866l-1.5.866a1 1 0 01-1-1.732l1-.578z" />
              </svg>
              Overview
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-3 text-sm font-medium text-[#8b949e] border-b-2 border-transparent hover:text-white hover:border-[#30363d] bg-transparent cursor-pointer"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 inline mr-2 fill-[#8b949e]">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
              </svg>
              Repositories
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-8">
        <div className="w-64 shrink-0">
          <div className="w-20 h-20 rounded-full bg-[#30363d] mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold text-center">{userDetails.username}</h3>
          <button className="w-full mt-4 py-1.5 px-4 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-sm font-semibold rounded-md border border-[#30363d] cursor-pointer">
            Follow
          </button>
          <div className="flex justify-center gap-3 mt-4 text-sm text-[#8b949e]">
            <span><strong className="text-white">10</strong> Followers</span>
            <span><strong className="text-white">3</strong> Following</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <HeatMapProfile />
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/login";
        }}
        className="fixed bottom-8 right-8 py-2 px-4 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-sm rounded-md border border-[#30363d] cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
