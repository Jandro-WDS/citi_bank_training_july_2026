import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-blue-600">
      <Navbar/>
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Your Financial Future Starts Here
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8">
            Experience modern banking with secure, fast, and convenient financial solutions tailored for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            About Our Bank
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            Founded in 2010, our bank has been committed to providing exceptional financial services to millions of customers worldwide. We combine cutting-edge technology with personalized service to make banking easier, safer, and more rewarding for everyone.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="text-3xl font-bold text-blue-900 mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">
                Bank-level security with end-to-end encryption to protect your assets and personal information.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="text-3xl font-bold text-blue-900 mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast</h3>
              <p className="text-gray-600">
                Lightning-fast transactions and real-time updates so you're always in control of your money.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="text-3xl font-bold text-blue-900 mb-3">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global</h3>
              <p className="text-gray-600">
                Access your accounts anywhere in the world with 24/7 customer support in multiple languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-300 mb-2">50M+</div>
              <p className="text-blue-100 text-lg">Active Customers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-300 mb-2">150+</div>
              <p className="text-blue-100 text-lg">Countries Served</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-300 mb-2">$2T+</div>
              <p className="text-blue-100 text-lg">Assets Under Management</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-300 mb-2">99.9%</div>
              <p className="text-blue-100 text-lg">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Join Millions of Happy Customers?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sign up today and get started with secure, modern banking in just minutes.
          </p>
          <button className="bg-blue-900 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors duration-300">
            Create Your Account
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;