import PlotWrapper from "@/components/PlotWrapper";
import { ReactNode, Suspense } from "react";
import { fetchSummary } from "./lib/server";

interface HomeStaticProps {
  children?: ReactNode
}

const SkeletonLoader = async () => (
  // <div className="w-[800px] h-[400px] flex justify-center items-center bg-gray-700">
  //   <div className="animate-pulse bg-gray-600 relative "/>
  //   <div className="animate-pulse bg-gray-600 h-[95%] w-[95%]"></div>
  //   <div className="animate-pulse bg-gray-400 h-8 w-full mb-4"></div>
  //   <div className="animate-pulse bg-gray-400 h-96 w-full"></div>
  // </div>
  // <div className="background bg-gray-700 w-[800px] h-[400px] relative">
  //   <div className="title bg-gray-600 animate-pulse w-[40%] h-[10%] absolute mt-4 ml-14" />

  //   <div className="container w-[95%] h-[60%]  flex mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  //     <div className="y-axis bg-gray-600 animate-pulse w-[20px] h-[100%] absolute top-1/2 transform -translate-y-1/2"></div>
  //     <div className="graph bg-gray-600 animate-pulse w-[70%] h-[100%] absolute top-1/2 transform -translate-y-1/2 ml-10"></div>
  //     <div className="legend bg-gray-600 animate-pulse w-[20%] h-[40%] absolute top-0 right-0 "></div>
  //   </div>
  //   <div className="container w-[95%] h-[60%] bg-gray-500 flex mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

  //   </div>
  // </div>
  <div className="w-[800px] h-[400px] flex justify-center items-center bg-[#253142]">
    <div className="flex animate-pulse w-[95%] h-[95%] bg-gray-700" />
  </div>
);

async function HomeStatic({ children }: HomeStaticProps) {
  return (
    <div className="parent flex justify-center items-center mx-auto">
      <div className="flex justify-center items-center bg-gray-900 p-2 rounded-md border border-gray-700">
        <div className="flex justify-center items-center bg-gray-800 p-8 rounded-md min-h-[485px] min-w-[1320px]">
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
          <div className="flex md:w-1/2 md:pl-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

async function HomeLoaded() {
  const summary_resp = await fetchSummary()
  if (summary_resp === null) {
    return <SkeletonLoader />
  }

  const graph = JSON.parse(summary_resp.pjson)

  return (
    <PlotWrapper graph={graph} />
  )
}

export default async function Home() {
  return (
    <HomeStatic>
      <Suspense fallback={<SkeletonLoader />}>
        <HomeLoaded />
      </Suspense>
    </HomeStatic>
  )
}