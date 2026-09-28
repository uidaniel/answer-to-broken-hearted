import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <p>Dedicated to heartbreak, conflict and faith. {site.tagline}</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/#mission">Our mission</Link></li>
              <li><Link href="/#help">How we help</Link></li>
              <li><Link href="/shop">Products</Link></li>
              <li><Link href="/book">Book a session</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></li>
              <li><a href={`tel:${site.contactPhone.replace(/[^\d+]/g, "")}`}>{site.contactPhone}</a></li>
            </ul>
          </div>
        </div>
        <p className="care-note">
          <strong>In crisis?</strong> If you or someone you know is in immediate danger or thinking about self-harm,
          please contact your local emergency services right away. Our sessions do not replace emergency or medical care.
        </p>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>Not a financial empowerment organisation.</span>
        </div>
        <div className="footer-word" aria-hidden="true">Broken Hearted</div>
      </div>
    </footer>
  );
}
