import { RepositoriesList } from "@/components/dashboard/repositories-list";

export default function RepositoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Repositories</h1>
        <p className="text-gray-400 mt-1">
          Manage and monitor your connected GitHub repositories.
        </p>
      </div>

      <RepositoriesList />
    </div>
  );
}
