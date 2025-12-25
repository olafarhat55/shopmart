"use client";

import {
  MapPin,
  Phone,
  Mail,

} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 mt-20">
      <div className="container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* ========= BRAND COLUMN ========= */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-bold text-xl rounded-sm">
              S
            </div>
            <span className="font-bold text-xl text-gray-900">ShopMart</span>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Your one-stop destination for the latest fashion, electronics, and lifestyle products — 
            delivered with premium quality and excellent customer service.
          </p>

          <div className="space-y-3 text-gray-700 text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1" />
              123 Shop Street, Octoper City, DC 12345
            </p>

            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              (+20) 01093333333
            </p>

            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              support@shopmart.com
            </p>
          </div>
        </div>

        {/* ========= SHOP COLUMN ========= */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">SHOP</h3>
          <ul className="space-y-2 text-gray-700">
            <li><Link href="#" className="hover:text-black">Electronics</Link></li>
            <li><Link href="#" className="hover:text-black">Fashion</Link></li>
            <li><Link href="#" className="hover:text-black">Home & Garden</Link></li>
            <li><Link href="#" className="hover:text-black">Sports</Link></li>
            <li><Link href="#" className="hover:text-black">Deals</Link></li>
          </ul>
        </div>

        {/* ========= CUSTOMER SERVICE COLUMN ========= */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">CUSTOMER SERVICE</h3>
          <ul className="space-y-2 text-gray-700">
            <li><Link href="#" className="hover:text-black">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-black">Help Center</Link></li>
            <li><Link href="#" className="hover:text-black">Track Your Order</Link></li>
            <li><Link href="#" className="hover:text-black">Returns & Exchanges</Link></li>
            <li><Link href="#" className="hover:text-black">Size Guide</Link></li>
          </ul>
        </div>

        {/* ========= POLICIES COLUMN ========= */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">POLICIES</h3>
          <ul className="space-y-2 text-gray-700">
            <li><Link href="#" className="hover:text-black">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-black">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-black">Cookie Policy</Link></li>
            <li><Link href="#" className="hover:text-black">Shipping Policy</Link></li>
            <li><Link href="#" className="hover:text-black">Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      
    </footer>
  );
}
