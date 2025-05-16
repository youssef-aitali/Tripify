import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex justify-between items-center h-16 w-full px-[20%]">
        <div>Logo</div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="hover:bg-gray-200/50 cursor-pointer"
          >
            Login
          </Button>
          <Button className="bg-cyan-900/90 hover:bg-cyan-900 cursor-pointer">
            Sign up
          </Button>
        </div>
      </div>
      <div className="bg-gray-200 grow">Content</div>
    </div>
  );
}

export default App;
