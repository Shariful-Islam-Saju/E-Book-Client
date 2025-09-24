import { User } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface EmptyStateProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const LeadsNotFound: React.FC<EmptyStateProps> = ({ search, setSearch }) => {
  return (
    <Card className="text-center border-blue-200 p-12 shadow-sm">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
        <User className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Leads Found
      </h3>
      <p className="text-gray-600 mb-4">
        {search
          ? "Try adjusting your search terms"
          : "Start collecting leads to see them here"}
      </p>
      {search && (
        <Button variant="outline" onClick={() => setSearch("")}>
          Clear Search
        </Button>
      )}
    </Card>
  );
};

export default LeadsNotFound;
