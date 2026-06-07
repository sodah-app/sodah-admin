import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#020617",
        color: "white",
      }}
    >
      <h1>Sodah Admin</h1>

      <p>
        AI Business Management Platform
      </p>

      <Link href="/admin-login">
        Enter Admin Dashboard
      </Link>
    </div>
  );
}