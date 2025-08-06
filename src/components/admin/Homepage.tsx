import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-10 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 dark:text-white mb-4">
          Hello, Welcome!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This is your homepage. More features coming soo!
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          check the admin panel for more options.
        </p>
      </div>
    </div>
  );
}

export default HomePage;