import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="parent flex justify-center items-center mx-auto">
      <div className="flex justify-center items-center bg-gray-900 p-2 rounded-md border border-gray-700">
        <div className="flex justify-center items-center bg-gray-800 p-8 rounded-md">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="text-3xl font-bold mb-4">Ratnalysis</h1>
            <p className="text-lg mb-4">A visualization of data from <a
              href="https://transitapp.com/rats"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank">
              TransitApp&apos;s website
            </a>
            </p>
          </div>
          <div className="md:w-1/2 md:pl-8">
            {/* TODO: Get an actual image */}
            <img src="/example-image.jpg" alt="Example" className="w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
