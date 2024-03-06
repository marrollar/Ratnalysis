import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex justify-center items-center m-0 w-100% h-100% h-lvh w-lvh">
      <div className="max-w-xl mx-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
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
          <div className="md:w-1/2">
            {/* TODO: Get an actual image */}
            <img src="/example-image.jpg" alt="Example" className="w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
