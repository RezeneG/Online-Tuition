export default function Header() {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-blue-600">LearnX</h1>
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a href="#" className="hover:text-blue-600">About Us</a>
              <a href="#" className="hover:text-blue-600">Certification</a>
              <a href="#" className="hover:text-blue-600">Courses</a>
            </nav>
          </div>
  
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="What would you like to learn?"
              className="border rounded-full px-4 py-2 w-64 text-sm focus:ring focus:ring-blue-200 outline-none"
            />
            <button className="text-sm font-medium hover:text-blue-600">Sign Up / Sign In</button>
            <button className="relative">🛒</button>
          </div>
        </div>
      </header>
    );
  }
  
