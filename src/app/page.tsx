import SearchForm from "@/components/SearchForm/SearchForm";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem-1px)] flex items-center justify-center bg-slate-200">
      <SearchForm className="flex flex-col lg:flex-row lg:items-center gap-2" />
    </div>
  );
}
