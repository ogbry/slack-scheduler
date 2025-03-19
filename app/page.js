import SlackScheduler from "@/components/SlackScheduler";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SlackScheduler />
    </div>
  );
}
