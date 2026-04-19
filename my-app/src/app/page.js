import Link from "next/link";
import "./styles/home_page_styles.css";

export default function Home() {
  return (
    <div>
      <h1 id="Home_Welcome_Header">Welcome to Nullify</h1>
      <p id="Information_para">Store your data safely</p>

      <Link href="/login">
        <button className="Login_btn">Login</button>
      </Link>

      <Link href="/signup">
        <button className="Signup_btn">Sign up</button>
      </Link>
    </div>
  );
}