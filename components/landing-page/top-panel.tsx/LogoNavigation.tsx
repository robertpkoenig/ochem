import Link from "next/link";

const navigationItems = [
  { name: "How It Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
];

function LogoNavigation() {
  return (
    <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
      <nav
        className="relative flex items-center justify-between sm:h-10 lg:justify-start"
        aria-label="Global"
      >
        <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
          <div className="flex items-center justify-between w-full md:w-auto">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <div className="h-full">
                <img
                  src="./assets/logo-with-text.svg"
                  alt="logo"
                  className="h-9"
                />
              </div>
            </a>
          </div>
        </div>
        <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="font-medium text-gray-500 hover:text-gray-900">
                {item.name}
              </a>
            </Link>
          ))}
          <Link href="/auth/login">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default LogoNavigation;
