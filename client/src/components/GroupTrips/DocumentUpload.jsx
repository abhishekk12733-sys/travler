import React, { useState } from "react";
import { Upload } from "lucide-react";
import { uploadGroupTripDocument } from "../../utils/groupTripApi"; // Import the API function

export default function DocumentUpload({ selectedTripId }) {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDocumentName(e.target.files[0]?.name || "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedTripId) {
      setError("Please select a trip first.");
      return;
    }

    if (!file || !documentName) {
      setError("Please select a file and provide a document name.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("document", file); // Backend expects 'document' for file uploads
    formData.append("name", documentName);

    try {
      await uploadGroupTripDocument(selectedTripId, formData);
      setSuccess("Document uploaded successfully!");
      setFile(null);
      setDocumentName("");
    } catch (err) {
      setError(err.msg || "Failed to upload document. Please try again.");
      console.error("Error uploading document:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Upload Trip Documents
      </h3>

      {/* Document Upload Form */}
      <form onSubmit={handleUpload} className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="documentName"
            className="block text-sm font-medium text-gray-700"
          >
            Document Name
          </label>
          <input
            type="text"
            id="documentName"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="e.g., Flight Ticket, Hotel Booking"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, PDF up to 10MB
              </p>
              {file && (
                <p className="text-sm text-gray-900">Selected: {file.name}</p>
              )}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Document"}
        </button>
      </form>
    </div>
  );
}
