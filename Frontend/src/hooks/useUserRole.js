import { useEffect, useState } from "react";

import axios from "axios";

import { auth } from "../Firebase/firebase.js";

export default function useUserRole() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      if (auth.currentUser?.email) {
        const res = await axios.get(
          `http://localhost:5000/api/users/${auth.currentUser.email}`
        );

        setRole(res.data?.role || "patient");
        // setRole(res.data.role);
        // console.log(role)
      }
    };

    fetchRole();
  }, []);

  return role;
}