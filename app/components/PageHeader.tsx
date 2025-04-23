import React from "react";

const PageHeader = ({ children }) => {
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="flex justify-between align-middle sm:text-3xl text-lg font-bold tracking-tight text-gray-900">
            {children}
          </h1>
        </div>
      </header>
    </>
  );
};

export default PageHeader;
