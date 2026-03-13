import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">Wanderlust</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted travel companion for discovering amazing destinations worldwide.
            </p>
          </div>
          {[
            { title: "Explore", links: ["Hotels", "Flights", "Packages", "Destinations"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
            { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Wanderlust. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
