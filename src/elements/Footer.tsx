export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* <!-- Logo and text --> */}
        <div className="flex items-center space-x-4">
          {/* <!-- Logo --> */}
          <div className="flex items-center">
            <img
              src="path/to/logo.svg"
              alt="Lucky Beard Logo"
              className="w-10 h-10"
            />
            <span className="ml-2 text-lg font-bold">LUCKY BEARD</span>
          </div>
        </div>

        {/* <!-- Policies --> */}
        <div className="mt-4 md:mt-0 flex space-x-4 text-sm">
          <a href="/privacy-policy" className="hover:underline">
            Privacy policy
          </a>
          <span>|</span>
          <a href="/cookie-policy" className="hover:underline">
            Cookie policy
          </a>
        </div>

        {/* <!-- Social media links --> */}
        <div className="mt-4 md:mt-0 flex space-x-4">
          <a href="#" className="text-purple-300 hover:text-purple-400">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="#" className="text-purple-300 hover:text-purple-400">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-purple-300 hover:text-purple-400">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-purple-300 hover:text-purple-400">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      {/* <!-- Cookie consent --> */}
      <div className="mt-6 flex justify-between items-center px-4">
        <p className="text-gray-400 text-sm">
          By using this website, you agree to our use of cookies. We use cookies
          to provide you with a great experience and to help our website run
          effectively.
        </p>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          Accept
        </button>
      </div>
    </footer>
  );
};
