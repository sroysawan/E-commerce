import React, { useEffect, useState } from "react";
import useEcomStore from "../store/ecom-store";
import { currentUser } from "../api/auth";
import LoadingToRedirect from "../routes/LoadingToRedirect";
import PrivateRoute from "./PrivateRoute";
const ProtectRouteUser = ({ element }) => {
  // const [ok, setOk] = useState(false);
  const [ok, setOk] = useState(null); // เริ่มต้นด้วย null เพื่อไม่แสดงผลอะไร
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);

  // useEffect(() => {
  //   if (user && token) {
  //     // send to back
  //     currentUser(token)
  //       .then((res) => setOk(true))
  //       .catch((error) => setOk(false));
  //   }
  // }, []);
  // return ok ? element : <LoadingToRedirect />;
  useEffect(() => {
    if (user && token) {
      currentUser(token)
        .then(() => setOk(true))
        .catch(() => setOk(false));
    } else {
      setOk(false); // ถ้าไม่มี token หรือ user ก็ Redirect ทันที
    }
  }, [user, token]);

  return <PrivateRoute ok={ok}>{element}</PrivateRoute>;
};

export default ProtectRouteUser;
