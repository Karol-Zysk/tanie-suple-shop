
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const dashboard = [
  { href: "dashboard", linkName: "Panel" },
  { href: "orders", linkName: "Zamówienia" },
  { href: "products", linkName: "Produkty" },
  { href: "users", linkName: "Użytkownicy" },
];

const AdminPanel = () => {


  const data = useRouter()
  const path = data.pathname
    

  return (
    <div>
      <ul>
        {dashboard.map((el) => {
          return (
            <li value={el.href} className={path === `/admin/${el.href}` ? "font-bold" : ""} key={el.href}>
              <Link  href={`/admin/${el.href}`}>{el.linkName}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminPanel;
