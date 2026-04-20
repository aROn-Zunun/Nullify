import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav id="navbar">
      <div id="nav_container">

        <h2 id="logo">Nullify</h2>

        <div id="nav_buttons">
          <Link href="/login">
            <button className="Login_btn">Login</button>
          </Link>

          <Link href="/signup">
            <button className="Signup_btn">Sign up</button>
          </Link>
        </div>

      </div>
    </nav>
  );
}