import { useRouter } from "next/router";
import React from "react";

type Props = {
  name?: string;
};

const OtherAdmin = ({ name }: Props) => {
  const router = useRouter();
  return (
    <div
      style={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Order is not accessible</h1>
      <p style={{ textAlign: "center" }}>
        <span style={{ fontWeight: "600" }}> {name || "Other Admin"}</span> is
        working on this order currently <br />
        Please try again later
      </p>
      <button
        onClick={() => router.back()}
        style={{
          width: "max-content",
          padding: 10,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        Go Back
      </button>
    </div>
  );
};
export default OtherAdmin;
