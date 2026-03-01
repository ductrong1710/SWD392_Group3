export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Men
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Women
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Accessories
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Shipping Info
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Returns
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Our Story
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Sustainability
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Careers
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Press
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Instagram
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Facebook
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Twitter
                </button>
              </li>
              <li>
                <button className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                  Newsletter
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
          <p>&copy; 2026 Fashion Store. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:underline">Privacy Policy</button>
            <button className="hover:underline">Terms of Service</button>
            <button className="hover:underline">Cookie Settings</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
