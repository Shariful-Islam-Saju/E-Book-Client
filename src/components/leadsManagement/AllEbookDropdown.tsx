import { useGetAllFilesQuery } from "@/redux/features/file/fileApi";
import React from "react";
import { MultiSelect } from "react-multi-select-component";

interface TEBookProps {
  selectedEbooks: {
    label: string;
    value: string;
  }[];
  setSelectedEbooks: React.Dispatch<
    React.SetStateAction<
      {
        label: string;
        value: string;
      }[]
    >
  >;
}

const dummyEbooks = [
  { label: "JavaScript Basics", value: "ebook1" },
  { label: "React Advanced", value: "ebook2" },
  { label: "Node.js Guide", value: "ebook3" },
  { label: "DSA in JS", value: "ebook4" },
];

const AllEbookDropdown = ({
  selectedEbooks,
  setSelectedEbooks,
}: TEBookProps) => {
  const { data } = useGetAllFilesQuery();

  // Transform API data into { label, value } format
  const options =
    data?.data?.map((ebook: any) => ({
      label: ebook.title, // or ebook.name depending on your API
      value: ebook.id, // or ebook.slug / unique identifier
    })) || [];

  return (
    <div className="w-full">
      <MultiSelect
        options={options }
        value={selectedEbooks}
        onChange={setSelectedEbooks}
        labelledBy="Select Ebook"
        hasSelectAll={false}
        className="w-full"
        valueRenderer={() =>
          selectedEbooks.length > 0
            ? `${selectedEbooks.length} selected`
            : "Select Ebook"
        }
        overrideStrings={{
          selectSomeItems: selectedEbooks.length
            ? `${selectedEbooks.length} selected`
            : "Select Ebook",
          allItemsAreSelected: "All selected",
          selectAll: "Select All",
        }}
      />

      <style jsx>{`
        /* Make the dropdown container professional */
        .multi-select-container {
          --rmsc-border: #dbeafe; /* Tailwind blue-200 */
          --rmsc-hover: #bfdbfe; /* Tailwind blue-200 */
          --rmsc-selected-bg: #bfdbfe;
          --rmsc-selected-color: #1e3a8a;
          --rmsc-border-radius: 0.5rem;
          --rmsc-padding: 0.25rem 0.5rem;
          --rmsc-font-size: 0.875rem;
        }

        /* Dropdown scroll */
        .multi-select-container .dropdown {
          max-height: 15rem;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default AllEbookDropdown;
